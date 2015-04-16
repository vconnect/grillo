(function(){
	grillo.addComponent('jumbotron', function(scope){
		var defaults = {
			imgBgClass: 'image-bg'
		};
		var opts = scope.extend({}, defaults, scope.config.alert);
		var cacheVariables = function(){
			opts.container = $('[' + scope.getAttr('jumbotron') + ']');
			// console.log(opts.container);
		};
		return {
			init:function(){
				cacheVariables();
				opts.container.each(function(){
					var bgImageUrl = $(this).attr(scope.getAttr('jumbotron'));
					if(bgImageUrl){
						$(this).css({
							background: 'url('+ bgImageUrl + ') no-repeat',
							backgroundSize: 'cover'
						}).addClass(opts.imgBgClass);
					}
				});
			}
		};
	});
}());
