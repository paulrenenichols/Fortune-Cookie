
$(document).ready(function() {

var fortuneClick = function(e) {
	console.log("fortuneClick");
	if( $(".cookie, #cookie-break").hasClass("closed") ) {
		$(".cookie, #cookie-break").switchClass("closed", "open", 500, "easeOutQuint");
		  $("div#scroll").fadeIn(400, function () {
			  $("div#scroll p").fadeIn(100);
			  });
		  
		  getRandomFortune();
	}
	else {
 		
			  $(".cookie, #cookie-break").switchClass("open", "closed", 500, "easeOutQuint");
			  $("div#scroll").fadeOut(50);
	}
};


/*
 * This algorithm is curtesy of @chewxy.
 * 
 * You find it at the bottom of this blog post:
 * 
 * http://blog.chewxy.com/2012/11/16/random-documents-from-couchdb/
 * 
 */
var getRandomFortune = function(event) {
	
	var putFortuneInScrollElement = function(fortuneBody) {
		$("div#scroll p").text(fortuneBody);
	};
	
	/*
	 * This function is the event handler for successfully
	 * grabbing our random fortune data the first time.
	 * 
	 * If we get zero rows, we try again.
	 * 
	 * When we try again, we do the opposite of what we
	 * did the first time.  If we searched ascending the
	 * first time, we search descending the second time.
	 * 
	 * If we searched descending the first time, we search
	 * ascending the second time.
	 */
	var getRandomFortuneRowsFirstTime = function(data) {
		var couchData = $.parseJSON(data);
		var randomFortuneRows = couchData['rows'];
		
		if( randomFortuneRows.length == 0 ) {
			
			/*
			 * Do the opposite search of last time.
			 */
			if( getFortunesDescending ) { //if we searched descending last time, do ascending this time
				
				fortuneURL = ascendingFortuneURL;
			}
			else { //if we did ascending search last time, do descending this time
				
				fortuneURL = descendingFortuneURL;
			}
			$.get(fortuneURL)
			.success( getRandomFortuneRowsSecondTime ).error( function(err) { /*alert("Error: " + err.responseText + " Status: " + err.status);*/ })
			.complete( function() { } );
		}
		else { //We have rows, use the first one.
			putFortuneInScrollElement(randomFortuneRows[0]["value"]);
		}
	};

	/*
	 * This function is the event handler for successfully
	 * grabbing our random fortune data the second time.
	 */
	var getRandomFortuneRowsSecondTime = function(data) {
		var couchData = $.parseJSON(data);
		var randomFortuneRows = couchData['rows'];
		
		putFortuneInScrollElement(randomFortuneRows[0]["value"]);
	};
	
	//Generate a Random Key for searching the view
	var randomKey = Math.random();
	
	/*
	 * Generate a "Coin Flip", which is a Random Number
	 * with a value of either 0 or 1.
	 * 
	 * Since Math.random returns a Random Number r such 
	 * that 0 <= r < 1, so 0 <= 2r < 2.
	 * 
	 * So if take the "floor" of 2r, we should get a random
	 * number that is either 0 or 1.  This is our "Coin Flip".
	 */
	var coinFlip = Math.floor( 2 * Math.random() );
	
	/*
	 * We are going to use the Coin Flip to determine whether or not
	 * we are going to get fortunes from the database in ascending
	 * or in descending order.
	 * 
	 * If coinFlip == 1, we will get the fortunes in descending order.
	 * 
	 * If coinFlip == 0, we will get the fortunes in ascending order.
	 */
	var getFortunesDescending = false;
	if( coinFlip == 1 ) {
		getFortunesDescending = true;
	}
	
	/*
	 * This is the base URL for the view.  We are going to concatenate
	 * strings on to the end of it to specify parameters for the searching
	 * the view.
	 */
	var baseViewURL = "http://127.0.0.1:5984/fortunes/_design/fortune/_view/random_fortune?";
	
	var endKeyString = "endkey=";
	var startKeyString = "startkey=";
	var descendingFortuneString = "&descending=true";
	
	var ascendingFortuneURL = baseViewURL + startKeyString + randomKey;
	var descendingFortuneURL = baseViewURL + endKeyString + randomKey + descendingFortuneString;
	
	var fortuneURL = ascendingFortuneURL;
	if( getFortunesDescending ) {
		fortuneURL = descendingFortuneURL;
	}
	
	$.get(fortuneURL)
	.success( getRandomFortuneRowsFirstTime ).error( function(err) { /*alert("Error: " + err.responseText + " Status: " + err.status);*/ })
	.complete( function() { } );
};

var postNewFortuneToDatabase = function(fortuneBody) {
	var fortuneData = {};
	fortuneData["type"] = "fortune";
	fortuneData["body"] = fortuneBody;
	fortuneData["random_id"] = Math.random();
	
	var currentDate = new Date();
	fortuneData["created_at"] = currentDate.toUTCString();
	
	var jsonFortuneData = JSON.stringify(fortuneData);
	//console.log(jsonFortuneData);
	
	
	//var jqxhr = $.post("http://127.0.0.1:5984/fortunes/", JSON.stringify(fortuneData))
	//.success( postNewFortuneSuccess ).error( function(err) { /*alert("Error: " + err.responseText + " Status: " + err.status);*/ })
	//.complete( function() { } );
	
	
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:5984/fortunes/",
		data: jsonFortuneData,
		success: postNewFortuneSuccess,
		dataType: "json",
		contentType: "application/json"
	});
};

var foundURLInText = function(text) {
	
	/*
	 * This pattern represents a way of searching for "http:" or "https:"
	 */
	var pattern = /https?\:/;

	//test to see if the text contains a URL like string
	var result = text.match(pattern);

	/*
	 * If the result is not null, then we found a URL like string,
	 * so return true to indicate that we found a match.
	 * 
	 * Otherwise return false to indicate no match found.
	 */
	if( result != null ) {
		return true;
	}
	else {
		return false;
	}
};

var submitNewFortune = function(e) {
	
	//This line of code prevents page reload when we click the submit button.
	e.preventDefault();
	
	postNewFortuneToDatabase( $("#new-fortune").val() );
};

var postNewFortuneSuccess = function(data) {
	//console.log("fortune posted to database: " + data);
	$("#new-fortune").val("");
};

/*
 *  This function exists to enable the submit button
 *  only when there is actually text in the textarea #new-fortune
 *  
 *  2013Jan15  Paul Nichols
 *  This function now checks for URL-like strings as the user is typing
 *  to prevent the database from getting spammed with URLs.
 */
var newFortuneTextInputChange = function(e) {
	var newFortuneContent = $("#new-fortune").val();
	
	//console.log("newFortuneTextInputChange triggered: " + newFortuneContent);
	
	if (newFortuneContent == "") {  //disable submit if fortune text box is empty
		
		$("#share").addClass("submit-disabled");
		$("#share").attr("disabled", "disabled");
	}
	else if( foundURLInText( $("#new-fortune").val() ) ) {   //disable submit and alert user if they try entering a URL
		$("#share").addClass("submit-disabled");
		$("#share").attr("disabled", "disabled");
		alert("URLs are not allowed in fortunes.");
	}
	else {   //If the text box is not empty, and there are no URLs in the text box, enable submit.
		
		$("#share").removeClass("submit-disabled");
		$("#share").removeAttr("disabled");
	}
};

$("#new-fortune").bind("input propertychange", newFortuneTextInputChange);

$("div.fortune, div.generate").bind('click', fortuneClick);

/*
 * 2013Jan15  Paul Nichols
 * 
 * Tried using the submit event, but could not disable reload while using it.
 * 
 * Now that I'm using the click event on the submit button, the page reload is disabled.
 * 
 */
$("#share").click( submitNewFortune );

});