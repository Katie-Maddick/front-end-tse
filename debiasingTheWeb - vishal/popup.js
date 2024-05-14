document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['suggestedArticles'], (data) => {
      const suggestedArticles = data.suggestedArticles || [];
      const tableBody = document.querySelector('table tbody');
  
      suggestedArticles.forEach((article, index) => {
        const row = tableBody.insertRow();
        const websiteCell = row.insertCell(0);
        const biasCell = row.insertCell(1);
        const urlCell = row.insertCell(2);
  
        websiteCell.textContent = `Article ${index + 1}`;
        biasCell.textContent = article.sentiment;
        urlCell.textContent = article.url;
        urlCell.classList.add('link');
        urlCell.addEventListener('click', () => {
          chrome.tabs.create({ url: article.url });
        });
      });
    });
  });