// Listen for tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Check if the URL has changed and the tab is active
  if (changeInfo.url && tab.active) {
    console.log('Tab URL changed:', tab.url);

    // Send a fetch request to the backend with the domain of the current tab
    const url = new URL(tab.url);
    const domain = url.hostname;

    fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetch request response:', data);
        // ... rest of the code
      })
      .catch((error) => console.error('Error:', error));
  }
});