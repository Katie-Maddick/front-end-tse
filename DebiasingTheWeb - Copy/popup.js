//Gets URL
function popup() {
	chrome.tabs.query(
		{active:true},
		tabs=>{
			const tab=tabs[0];
			console.log("URL:", tab.url) //Displays 
			let urlWeb = tab.url; //Gets separately
		}
		)
}

//Calls functions
popup();