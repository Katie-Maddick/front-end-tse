chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL has changed, the tab is active, and the URL is a valid website
  if (changeInfo.url && tab.active && (tab.url.startsWith('http://') || tab.url.startsWith('https://'))) {
    console.log('Tab URL changed:', tab.url);

    // Send a fetch request to the backend with the domain of the current tab
    const url = new URL(tab.url);
    console.log(url);
    
    fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetch request response:', data);
        // ... rest of the code
      })
      .catch((error) => console.error('Error:', error));
  }
});
