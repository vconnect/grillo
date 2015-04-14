(function(){
	grillo.addComponent('productlist', function(scope){
		// var _privateThings = true;
		return {
			init:function(){
				// var cf = scope.config.productlist;
				// cf.$productsList = $('.products-list');
				// // console.log('Productlist component initialized.');
				// var validProductsList = cf.$productsList.filter(function(index, elem){
				// 	return $(elem).children('li').length > cf.majorLength;
				// });
				// $('<a href="#">Show all</a>').addClass('view-products hover-underline').appendTo(validProductsList);
				// cf.$viewProducts = $(cf.$viewProducts.selector);

				// validProductsList.addClass('show-few').each(function(index, elem){
				// 	$(elem).children('li').slice(0,cf.majorLength).addClass('major');
				// });
				// this.events();
			},
			events:function(){
				var self = this,
						cf = scope.config.productlist;
				// Contains the event bindings and subscriptions
				cf.$viewProducts.on('click', function(e){
					// toggle class to show all
					e.preventDefault();
					var $curList = $(this).closest(cf.$productsList);
					$curList.toggleClass('show-few');
					if($curList.hasClass('show-few')){
						$curList.find(cf.$viewProducts).html('Show all');
					}
					else{
						$curList.find(cf.$viewProducts).html('Show less');
					}
				});

				cf.$productsList.find('a').on('click', function(e){
					e.preventDefault();
					// scope.publish('vc:productlist/select', this);
				});
			}
		};
	});
}());
