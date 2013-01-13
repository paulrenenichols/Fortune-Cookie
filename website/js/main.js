
/*
var fortuneClick = function(e) {
	$(".cookie").toggleClass("open closed");
};

$("div.fortune").bind('click', fortuneClick);
*/

var fortuneClick = function(e) {
	if( $(".cookie").hasClass("closed") ) {
		$(".cookie").switchClass("closed", "open", 500, "easeOutQuint");
		  $("div#scroll").fadeIn(400, function () {
			  $("div#scroll p").fadeIn(100);
			  });
	}
	else {

		  $("div#scroll").fadeOut(200, function () { 		
			  $(".cookie").switchClass("open", "closed", 500, "easeOutQuint");
			  });
	}
};


$("div.fortune, div.generate, #share").bind('click', fortuneClick);
