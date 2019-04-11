window.onload = (e) =>{
    document.querySelector("#searchbutton").onclick = searchButtonClicked
};

let term = "";
let resultsDiv = document.querySelector("#searchresults");

function searchButtonClicked()
{
    console.log("searchButtonClicked() called");

    const CLEARBIT_URL = "https://autocomplete.clearbit.com/v1/companies/suggest?query=";

    let CLEARBIT_KEY = "sk_8224e775b5b1adaa47085c6266c0842e";

    let url = CLEARBIT_URL;

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

function dataLoaded(e){
    let xhr = e.target;
	
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
		
		// 6 - put together HTML
		let numberofresults = `<p><i>Here are <b>${results.length}</b> results!</i></p>`; // ES6 String Templating
		let bigString = "";
		for (let i=0;i<results.length;i++){
			let result = results[i];
			let url = result.domain;
			let logo = result.logo;
			let name = result.name;
			let line = `<div class='result'><div id ='logo'><img src='${logo}'/><button type="button" class="btn btn-default btn-sm"><span class="glyphicon glyphicon-star"></span>Favorite!</button></div>`;
			line += `<div id='name'><p>${name}</p></div>`
			line += `<div id='domain'><a href='${url}'>${name}'s Homepage</a></div></div>`
			bigString += line;
		}
		
		// 7 - display final results to user
		document.querySelector("#searchresults").innerHTML = bigString;
		document.querySelector("#numberofresults").innerHTML = numberofresults;
}