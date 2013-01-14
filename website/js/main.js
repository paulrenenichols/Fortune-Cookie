
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

/*
 *  This function exists to enable the submit button
 *  only when there is actually text in the textarea #new-fortune
 */

var newFortuneTextInputChange = function(e) {
	var newFortuneContent = $("#new-fortune").val();
	
	//console.log("newFortuneTextInputChange triggered: " + newFortuneContent);
	
	if (newFortuneContent == "") {
		//console.log("newFortuneTextInputChange triggered: " + newFortuneContent); 
		$("#share").addClass(".submit-disabled");
		$("#share").attr("disabled", "disabled");
	}
	else {
		$("#share").removeClass(".submit-disabled");
		$("#share").removeAttr("disabled");
	}
};

$("#new-fortune").bind("input propertychange", newFortuneTextInputChange);

$("div.fortune, div.generate").bind('click', fortuneClick).bind('click', getOnClick);

$("#share");