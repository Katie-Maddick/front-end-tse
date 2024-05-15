// server.js
const express = require('express');
const puppeteer = require('puppeteer');
const natural = require('natural');
const nlp = require('compromise');
const cors = require('cors');

const app = express();
const PORT = 3000;

//using cors
app.use(cors({
  origin: '*',
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type'
}));

app.use(express.json());

// Configuration for Google search API
const GOOGLE_API_KEY = 'AIzaSyBgwzoNbaAePUngsVKmoDhYeqhqgNtpnOA'; // Replace with your API key
const GOOGLE_CSE_ID = '86f248a0d941d4c0e'; // Replace with your custom search engine ID

// Function to normalise text
function normaliseText(text) {
  text = text.toLowerCase();
  text = text.replace(/[\.?!]/g, "");
  let words = text.split(/\s+/);

  const stemmer = natural.PorterStemmer;
  words = words.map(word => stemmer.stem(word));
  return words;
}

// Function to calculate TF-IDF vectors for a single document
function calculateTFIDF(document) {
  let tf = {};
  let totalWords = 0;
  document.forEach(word => {
    totalWords++;
    if (tf[word]) {
      tf[word] += 1;
    } else {
      tf[word] = 1;
    }
  });

  for (let word in tf) {
    tf[word] = tf[word] / totalWords;
  }
  return tf;
}

// Function to apply TF-IDF transformation using the TF-IDF vector of a seed article
function applyTFIDFTransformation(seedTFIDF, document) {
  let tfidfVector = {};
  let tf = calculateTFIDF(document);
  for (let word in seedTFIDF) {
    tfidfVector[word] = tf[word] ? tf[word] * seedTFIDF[word] : 0;
  }
  return tfidfVector;
}

// Function to calculate the total tf-idf score
function calculateTotalScore(tfidfVector) {
  let totalScore = 0;
  for (let word in tfidfVector) {
    totalScore += tfidfVector[word];
  }
  return totalScore;
}

// Sentiment analysis using natural.js
function sentimentAnalysis(articleData) {
  const Analyser = natural.SentimentAnalyzer;
  const analyser = new Analyser("English", null, "afinn");

  const result = analyser.getSentiment(articleData);
  const humanReadableSentiment = result > 0 ? "Positive" : result < 0 ? "Negative" : "Neutral";

  return humanReadableSentiment;
}

// Function to extract keywords
function extractKeywords(text) {
  const doc = nlp(text);
  const keywords = doc.nouns().out('array');

  const stopWords = ['a', 'an', 'the', 'and', 'is', 'in', 'it', 'you', 'that', 'of', 'for', 'on', 'are', 'as', 'with', 'his', 'they', 'at', 'be', 'this', 'from', 'or', 'one', 'had', 'by', 'not', 'but', 'what', 'all', 'your', 'when', 'out', 'up', 'no', 'she', 'he', 'which', 'their', 'if', 'there', 'about', 'get', 'will', 'can', 'her', 'all', 'would', 'my', 'like', 'so', 'them', 'other', 'into', 'see', 'time', 'could', 'now', 'than', 'its', 'only', 'think', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'];
  const filteredKeywords = keywords.filter(word => !stopWords.includes(word));

  return filteredKeywords.join(' ');
}

// Function to perform a Google search
async function searchGoogle(query) {
  const { default: fetch } = await import('node-fetch');
  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(query)}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data.items ? data.items.map(item => item.link) : [];
}

// Root route to test server status
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Endpoint to process seed article and get suggestions
app.post('/processSeedArticle', express.json(), async (req, res) => {
  const seedArticleText = req.body.seedArticleText;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const normalisedSeedArticle = normaliseText(seedArticleText);
  const seedTFIDF = calculateTFIDF(normalisedSeedArticle);
  const seedArticleSentiment = sentimentAnalysis(normalisedSeedArticle);

  const extractedTitle = extractKeywords(seedArticleText);
  const articleURLs = await searchGoogle(extractedTitle + ' news article');
  let suggestedArticles = [];

  for (let url of articleURLs) {
    console.log(`Navigating to URL: ${url}`); //log to track URLs
    try {
      await page.goto(url);
      const articleData = await page.evaluate(() => {
        const text = Array.from(document.querySelectorAll('article p')).map(p => p.innerText).join('\n');
        return text;
      });

      let normalisedArticle = normaliseText(articleData);
      let articleTFIDFVector = applyTFIDFTransformation(seedTFIDF, normalisedArticle);
      let totalScore = calculateTotalScore(articleTFIDFVector);
      let articleSentiment = sentimentAnalysis(normalisedArticle);

      if (totalScore > 0 && articleSentiment !== seedArticleSentiment) {
        suggestedArticles.push({
          url: url,
          tfidfScore: totalScore,
          sentiment: articleSentiment
        });
      }
    } catch (error) {
      console.error(`Failed to navigate to ${url}`);
    }
  }

  await browser.close();
  res.json({ suggestedArticles });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});