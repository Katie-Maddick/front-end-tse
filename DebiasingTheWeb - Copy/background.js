chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'extractText') {
    //Send a POST request to your server with the extract text
        fetch('http://your-server-url/process-text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text: request.txt}),
        }) 
        .then((response) => response.json())
        .then((data) => {
            //Send the suggested article to the popup
            chrome.tabs.query({ active: true, currentWindows: true}, (tabs) => {
                chrome.tabs.sendMessage(tabs[0].id, { type: 'suggestedArticles', articles: data.article})
            }); 
        })   
        .catch((error) => console.error('Error:', error));
    }
});