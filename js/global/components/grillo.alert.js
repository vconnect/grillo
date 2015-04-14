(function(){
	grillo.addUtility('alert', function(scope){
		var defaults = {
			containerClass: 'alert-container',
			alertBoxClass: 'alert-box',
			contentClass: 'alert-content',
			closeClass: 'alert-close',
			alertTpl: '<div data-vc-role="alert" class="vc-alert alert-box"><p class="alert-content"></p><a href="#" class="close">&times;</a></div>'
		};

		var opts = scope.extend(defaults, scope.config.alert);

		var container, alertBox;
		return function(msg){
			// Creates the container element if not present in DOM
			if(!$('.' + opts.containerClass).length){
				container = $('<div>').addClass(opts.containerClass);
				$('body').append(container);
			}
			else{
				container = $('.' + opts.containerClass);
			}
			alertBox = $('<div>')
				.addClass(opts.alertBoxClass)
				.attr(scope.getAttr('role'), 'alert')
				.hide()
				.append($('<div>').addClass(opts.contentClass).html(msg))
				.append('<a href="#" class="' + opts.closeClass + '">&times;</a>');

			container.append(alertBox);
			alertBox.fadeIn();
		};
	});
}());

// grillo.alert('Hello');
// grillo.alert('Hello', 'error');
// grillo.alert('Hello', 'error', 4000);
/*
grillo.addUtility('comp_name', function(scope){
	var _privateThings = true;
	return {
		init: function(){
			initialise component
		};
	};
});

grillo.addComponent('comp_name', function(scope){
	var _privateThings = true;
	return {
		init: function(){
			initialise component
		};
	};
}); => returns the grillo object
grillo.publish('vc:alert', 'Hi there!');
grillo.comps.comp_name = (function(scope){
	var _privateThings = true;
	return {
		init: function(){
			initialise component
		};
	};
}());
*/
