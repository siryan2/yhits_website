(function($){
	console.log('ready!');
	if ( $('.owl-carousel').length > 0 ) {
		$('.owl-carousel').owlCarousel({
			items: 1,
			lazyLoad: true,
			loop: true,
			margin: 10
		});
	}
	// if ( $('.project__card-img').length > 0 ) {
	// 	$('.project__card-img').one('load', function (e) {
	// 		var that = this;
	// 		setTimeout(function(){
	// 			$(that).parent('.loading__indicator').removeClass('loading__indicator');
	// 		}, 300);
	// 	});
	// }
})(jQuery)
