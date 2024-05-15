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

extractTextContent();
