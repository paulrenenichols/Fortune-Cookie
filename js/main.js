
/*
var fortuneClick = function(e) {
	$(".cookie").toggleClass("open closed");
};

$("div.fortune").bind('click', fortuneClick);
*/

var fortuneClick = function(e) {
	if( $(".cookie").hasClass("open") ) {
		$(".cookie").switchClass("open", "closed", 500, "easeOutQuint");
	}
	else {
		$(".cookie").switchClass("closed", "open", 500, "easeOutQuint");

	}
};

$("div.fortune").bind('click', fortuneClick);