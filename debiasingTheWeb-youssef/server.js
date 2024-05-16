const express = require('express');
const puppeteer = require('puppeteer');
const natural = require('natural');
const nlp = require('compromise');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
app.use(cors())
app.use(bodyParser.json());

// Configuration for Google search API
const GOOGLE_API_KEY = 'AIzaSyBgwzoNbaAePUngsVKmoDhYeqhqgNtpnOA'; // Replace with your API key
const GOOGLE_CSE_ID = '86f248a0d941d4c0e'; // Replace with your custom search engine ID

console.log('Server started');

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

// Endpoint to process seed article and get suggestions
app.post('/api', async (req, res) => {
  console.log('Received request:', req.body);
  const domain = req.body.domain;
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // ...

  const articleURLs = await searchGoogle(extractedTitle);
  let suggestedArticles = [];

  // Use Promise.all() to wait for all asynchronous operations to complete
  try {
    const promises = articleURLs.map(async (url) => {
      try {
        await page.goto(url);
        const articleData = await page.evaluate(() => {
          const text = Array.from(document.querySelectorAll('article p')).map(p => p.innerText).join('\n');
          return text;
        });

        // ...

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
    });

    await Promise.all(promises);
  } finally {
    await browser.close();
  }

  res.json({ suggestedArticles });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
