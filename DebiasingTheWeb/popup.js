//Gets the data from the website given
//async function fetchData() {
//   const res=await fetch ("https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/nonce");
//    const record=await res.json();
//    document.getElementById("date").innerHTML=record.data[0].date;
//    document.getElementById("areaName").innerHTML=record.data[0].areaName;
//    document.getElementById("latestBy").innerHTML=record.data[0].latestBy;
//}

//Reads in from a text file
function readTextFile() {
	document.getElementById('dataFile.txt') //Specifies document
	.addEventListener('change', funtion () { 
		let fr - new FileReader(); 
		fr.onload = function () {
			document.getElementByID("date") //Sets data as date
			.textContent = fr.result; 
		}
		
		fr.readAsBinaryString(this.files[0]);
	}
}

//This was a test to see if I could get it to get the URL of the website
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

//Was another test
//chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function 
//	(tabs) {
//		var url = tabs[0].url;
//		document.getElementById("host").innerHTML = url;
//	});
//	let a = "a";



//Calls functions
readTextFile();
popup();