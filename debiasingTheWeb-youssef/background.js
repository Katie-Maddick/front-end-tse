console.log('Registering onClicked event listener...');
chrome.action.onClicked.addListener((tab) => {

    console.log('Extension icon clicked');
  
    const url = new URL(tab.url);
    const domain = url.hostname;
    console.log(domain);
  
    console.log('Sending request to the server...');
  
    fetch('http://localhost:3000/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ domain }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Received response from the server:', data);
        // ... rest of the code
      })
      .catch((error) => console.error('Error:', error));
  
    console.log('Request sent to the server.');
  });