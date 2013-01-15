
/*
var fortuneClick = function(e) {
	$(".cookie").toggleClass("open closed");
};

$("div.fortune").bind('click', fortuneClick);
*/

var fortuneClick = function(e) {
	console.log("fortuneClick");
	if( $(".cookie").hasClass("closed") ) {
		$(".cookie").switchClass("closed", "open", 500, "easeOutQuint");
		  $("div#scroll").fadeIn(400, function () {
			  $("div#scroll p").fadeIn(100);
			  });
	}
	else {
 		
			  $(".cookie").switchClass("open", "closed", 500, "easeOutQuint");
			  $("div#scroll").fadeOut(50);
	}
};

var getFortuneBody = function(data) {
	var couchData = $.parseJSON(data);
	var rows = couchData['rows'];
	var fortune = rows[0]['value'];
	$("div#scroll p").text(fortune);
};

var getOnClick = function(e) {
	var jqxhr = $.get("http://127.0.0.1:5984/fortunes/_design/fortune/_view/random_fortune?key=0.3")
	.success( getFortuneBody ).error( function(err) { /*alert("Error: " + err.responseText + " Status: " + err.status);*/ })
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
	console.log(jsonFortuneData);
	
	
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

var submitNewFortune = function(e) {
	
	//This line of code prevents page reload when we click the submit button.
	e.preventDefault();
	
	postNewFortuneToDatabase( $("#new-fortune").val() );
};

var postNewFortuneSuccess = function(data) {
	console.log("fortune posted to database: " + data);
};

/*
 *  This function exists to enable the submit button
 *  only when there is actually text in the textarea #new-fortune
 */
var newFortuneTextInputChange = function(e) {
	var newFortuneContent = $("#new-fortune").val();
	
	//console.log("newFortuneTextInputChange triggered: " + newFortuneContent);
	
	if (newFortuneContent == "") {
		//console.log("newFortuneTextInputChange triggered: " + newFortuneContent); 
		$("#share").addClass("submit-disabled");
		$("#share").attr("disabled", "disabled");
	}
	else {
		$("#share").removeClass("submit-disabled");
		$("#share").removeAttr("disabled");
	}
};

$("#new-fortune").bind("input propertychange", newFortuneTextInputChange);

$("div.fortune, div.generate").bind('click', fortuneClick).bind('click', getOnClick);

/*
 * 2013Jan15  Paul Nichols
 * 
 * Tried using the submit event, but could not disable reload while using it.
 * 
 * Now that I'm using the click event on the submit button, the page reload is disabled.
 * 
 */
$("#share").click( submitNewFortune );
