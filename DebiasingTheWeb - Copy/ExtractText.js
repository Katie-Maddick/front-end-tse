// contentScript.js

function extractTextContent() {
    const paragraphs = document.getElementsByTagName('p');
    let textContent = '';
  
    for (const paragraph of paragraphs) {
      textContent += paragraph.textContent + ' ';
    }
  
    return textContent.trim();
  }
  
  const seedArticleText = extractTextContent();
  console.log('Sending request to local server at http://localhost:3000/processSeedArticle'); 
  fetch('http://localhost:3000/processSeedArticle', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ seedArticleText })
  })
    .then(response => response.json())
    .then(data => {
      console.log('Suggested articles:', data.suggestedArticles);
      chrome.storage.local.set({ suggestedArticles: data.suggestedArticles });
    })
    .catch(error => console.error('Error:', error));