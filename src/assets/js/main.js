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


	/**
	 * Lazy load Images
	 */
	if('IntersectionObserver' in window) {

		var images = document.querySelectorAll('.js-lazyload');

		var config = {
			root: null,
			rootMargin: '0px 0px 50px 0px',
			threshold: 0
		};

		var observer = new IntersectionObserver(function (entries, self) {
			entries.forEach(function(entry) {

				if(entry.isIntersecting) {

					var src = $(entry.target).attr('data-src');
					$(entry.target).attr('src', src);

					self.unobserve(entry.target);
				}
			});
		}, config);

		images.forEach(function(image){
			observer.observe(image);
		});
	}

})(jQuery);
