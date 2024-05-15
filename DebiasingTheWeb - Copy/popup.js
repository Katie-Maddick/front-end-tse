//Gets URL
function popup() {
	chrome.tabs.query(
		{active:true},
		tabs=>{
			const tab=tabs[0];
			console.log("URL: ", tab.url) //Displays 
			let urlWeb = tab.url; //Gets separately
		}
	)

	chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
		if (request.type === 'suggestedArticles') {
			const suggestedArticles = request.articles;

			//Update the table in the popup with the suggested articles
			const table = document.querySelector('table tbody');
			suggestedArticles.forEach((article, index) => {
				const row = table.rows[index];
				row.cells[0] = article.sentiment;
				row.cells[1].innerHTML = <a href="$(article.url)" target="_blank">${article.url}</a>;
			})
		}
	})
}

//Calls functions
popup();