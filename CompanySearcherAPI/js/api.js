window.onload = (e) =>{
    document.querySelector("#searchbutton").onclick = searchButtonClicked
};

let term = "";
let resultsDiv = document.querySelector("#searchresults");
let limit = 0;
let firstTime = "true";
let lastSearchedTerm = ""; 
let savedTerm = "txw4522-lastsavedterm";

function searchButtonClicked()
{
	
    console.log("searchButtonClicked() called");

    const CLEARBIT_URL = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";

    let CLEARBIT_KEY = "not needed for our purposes"

		let url = CLEARBIT_URL;
		/*couldnt get the first time you search to save that value, here is my attempt
		if(firstTime == "true")
		{
			lastSearchedTerm = document.querySelector("#serachterm").value;
			firstTime = "false";
		}
		else{
			lastSearchedTerm = term;
		}
		*/
		lastSearchedTerm = term;
		localStorage.setItem(savedTerm, lastSearchedTerm);
		term = document.querySelector("#searchterm").value;
	
    term = term.trim();
    
		term = encodeURIComponent(term);

    if(term.length < 1) return;

    url += term;

    console.log(url);

    let xhr = new XMLHttpRequest();

		// 6 - set the onload handler
	xhr.onload = dataLoaded;
	
		// 7 - set the onerror handler
	xhr.onerror = dataError;

		// 8 - open connection and send the request
	xhr.open("GET",url);
	xhr.send();
}
function dataError(e){
    console.log("An error occucred!");
}

let websites = {};
let favWebsites = {};

let counter = 0;
function dataLoaded(e){
		let xhr = e.target;
		limit = document.querySelector("#limit").value;
		// 2 - xhr.responseText is the JSON file we just downloaded
		console.log(xhr.responseText);
	
		// 3 - turn the text into a parsable JavaScript object
		let obj = JSON.parse(xhr.responseText);
		
		// 4 - if there are no results, print a message and return
		if(obj.error){
			let msg = obj.error;
			document.querySelector("#searchresults").innerHTML = `<p><i>Problem! <b>${msg}</b></i></p>`;
			return; // Bail out
		}
		
		// 5 - if there is an array of results, loop through them
		// this is a weird API, the name of the key is the day of the week you asked for
		let results = obj
		if(!results){
			document.querySelector("#searchresults").innerHTML = `<p><i>Problem! <b>No results for "${term}"</b></i></p>`;
			return;
		}
		let websitesLength = 0;
		// 6 - put together HTML
		let numberofresults = `<p><i>Here are <b>${limit}</b> results!</i></p>`; // ES6 String Templating
		let bigString = "";
		for (let i=0;i<limit;i++){
			let result = results[i];
			let url = result.domain;
			let logo = result.logo;
			let name = result.name;
			let line = `<div class='result'><div id ='logo'><img src='${logo}'/><button type="button" class="btn btn-default btn-sm" id="button${i}" value ="unclicked"><span class="glyphicon glyphicon-star"></span>Favorite!</button></div>`;
			line += `<div id='name'><p>${name}</p></div>`
			line += `<div id='domain'><button type="button" id="homepage" a href='${url}'>${name}'s Homepage</a></div></div>`
			bigString += line;			
			websites[i] = {companyLogo: logo, companyName : name, companyDomain: url, favorited: "false"};
			websitesLength++;
			websites.length = websitesLength;
		}				
		// 7 - display final results to user
		document.querySelector("#searchresults").innerHTML = bigString;
		document.querySelector("#numberofresults").innerHTML = numberofresults;

		function addFav(x){
			if(websites[x].favorited == "false")
			{
				favWebsites[counter] = websites[x];
				websites[x].favorited = "true"
				counter++;
			}
			favWebsites.length = counter;
		}

		function buttonsCheck(){
			var buttons = document.getElementsByClassName('btn-sm');
            for (var i=0 ; i < buttons.length ; i++){
              (function(index){
								buttons[index].onclick = function(){
									addFav(index);
								}
              })(i)
            }
		}
		buttonsCheck();
}
		/*Favorites button*/
		let modal = document.getElementById('myModal');

		// Get the button that opens the modal
		let btn = document.getElementById("myBtn");

		// Get the <span> element that closes the modal
		let span = document.getElementsByClassName("close")[0];

		// When the user clicks on the button, open the modal 
		let favResults = "";
		btn.onclick = function() {
			modal.style.display = "block";
			for (let i=0;i<favWebsites.length;i++){
				let result = favWebsites[i];
				let url = result.companyDomain;
				let logo = result.companyLogo;
				let name = result.companyName;
				let line = `<div class='result'><div id ='logo'><img src='${logo}'/></div>`;
				line += `<div id='name'><p>${name}</p></div>`
				line += `<div id='domain'><button type="button" id="homepage" a href='${url}'>${name}'s Homepage</a></div></div>`
				favResults += line;
		}
		if(favResults != "")
		{
			document.querySelector("#favResults").innerHTML = favResults;
			favResults = "";
		}
		else{
			document.querySelector("#favResults").innerHTML = "You currently have no favorites! Click on the 'Favorite!' button to start adding some to your list.";
		}


		// When the user clicks on <span> (x), close the modal
		span.onclick = function() {
			modal.style.display = "none";
		}

		// When the user clicks anywhere outside of the modal, close it
		window.onclick = function(event) {
			if (event.target == modal) {
				modal.style.display = "none";
		}
	} 
}
