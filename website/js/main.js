
/*
var fortuneClick = function(e) {
	$(".cookie").toggleClass("open closed");
};

$("div.fortune").bind('click', fortuneClick);
*/

var fortuneClick = function(e) {
	if( $(".cookie").hasClass("closed") ) {
		$(".cookie").switchClass("closed", "open", 500, "easeOutQuint");
	}
	else {
		$(".cookie").switchClass("open", "closed", 500, "easeOutQuint");

	}
};


var scrollFade = function () {
  $("div#scroll").fadeIn(3000, function () {
  $("div#scroll p").fadeIn(100);
  });
  return false;
};


$("div.fortune, div.generate, #share").bind({
	'click' : fortuneClick,
	'click' : scrollFade,
	});