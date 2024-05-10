//Reads in from a text file
function readTextFile() {
	document.getElementById('dataFile.txt') //Specifies document
	.addEventListener('change', funtion () );
    { 
		let fr = new FileReader(); 
		fr.onload = function () {
			document.getElementByID("date") //Sets data as date
			.textContent = fr.result; 
		}
		
		fr.readAsBinaryString(this.files[0]);
	}
}

//Doesn't seem to work but should
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
readTextFile();
popup();