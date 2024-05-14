// contentScript.js

function extractTextContent() {
    const paragraphs = document.getElementsByTagName('p');
    let textContent = '';

    for (const paragraph of paragraphs) {
      textContent += paragraph.textContent + ' ';
    }

    textContent = textContent.trim();

    //Send a message to the background script with the extracted text
    chrome.runtime.sendMessage({ type: 'extractText', text: textContent });
  }

  const seedArticleText = extractTextContent();

  // Store the seed text in Chrome Storage
  chrome.storage.local.set({ seedArticleText });

  // popup.js

// Retrieve the seed text from Chrome Storage
chrome.storage.local.get(['seedArticleText'], (data) => {
    const seedArticleText = data.seedArticleText;

    // Use the seed article text in your popup script
    // For example, normalize the text and calculate the TF-IDF vector
    //THIS IS FOR AFTER MERGING WITH THE BACK END const normalizedSeedArticle = normaliseText(seedArticleText);
    //THIS IS FOR AFTER MERGING WITH THE BACK END const const seedTFIDF = calculateTFIDF(normalizedSeedArticle);

    // ...
})

extractTextContent();
