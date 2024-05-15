document.addEventListener('DOMContentLoaded', () => {
  chrome.runtime.sendMessage({ type: 'getSuggestedArticles' }, (response) => {
    const suggestedArticles = response.suggestedArticles || [];
    const tableBody = document.querySelector('table tbody');

    suggestedArticles.forEach((article, index) => {
      const row = tableBody.insertRow();
      const biasCell = row.insertCell(0);
      const urlCell = row.insertCell(1);

      biasCell.textContent = article.sentiment;
      urlCell.textContent = article.url;
      urlCell.classList.add('link');
      urlCell.addEventListener('click', () => {
        chrome.tabs.create({ url: article.url });
      });
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'updatePopup') {
    chrome.runtime.sendMessage({ type: 'getSuggestedArticles' }, (response) => {
      const suggestedArticles = response.suggestedArticles || [];
      const tableBody = document.querySelector('table tbody');

      // Clear the existing rows
      while (tableBody.firstChild) {
        tableBody.removeChild(tableBody.firstChild);
      }

      // Add the new rows
      suggestedArticles.forEach((article, index) => {
        const row = tableBody.insertRow();
        const biasCell = row.insertCell(0);
        const urlCell = row.insertCell(1);

        biasCell.textContent = article.sentiment;
        urlCell.textContent = article.url;
        urlCell.classList.add('link');
        urlCell.addEventListener('click', () => {
          chrome.tabs.create({ url: article.url });
        });
      });
    });
  }
});