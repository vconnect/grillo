(function(){
	grillo.addUtility('alert', function(scope){
		var defaults = {
			containerClass: 'alert-container',
			alertBoxClass: 'alert-box',
			contentClass: 'alert-content',
			closeClass: 'alert-close',
			showClass: 'alert-show',
			hideClass: 'alert-hide',
			successClass: 'alert-success',
			errorClass: 'alert-error',
			infoClass: 'alert-info',
			warningClass: 'alert-warning',
			timeout: 4000,
			type: 'success',
			alertTpl: '<div data-vc-role="alert" class="vc-alert alert-box"><p class="alert-content"></p><a href="#" class="close">&times;</a></div>'
		};

		var container;
		var removeAlert = function(alertBox){
			alertBox.fadeOut(function(){
				$(this).remove();
			});
		};
		return function(msg, config){
			var alertBox, typeClass;
			var opts = scope.extend({}, defaults, scope.config.alert);
			opts = scope.extend(opts, config);
			// Creates the container element if not present in DOM
			if(!$('.' + opts.containerClass).length){
				container = $('<div>').addClass(opts.containerClass);
				$('body').append(container);
			}
			else{
				container = $('.' + opts.containerClass);
			}

			// Specify the typeClass to be applied to the alert box
			switch(opts.type){
				case 'warning':
					typeClass = opts.warningClass;
					break;
				case 'error':
					typeClass = opts.errorClass;
					break;
				case 'info':
					typeClass = opts.infoClass;
					break;
				case 'success':
					/* falls through */
				default:
					typeClass = opts.successClass;
			}

			alertBox = $('<div>')
				.addClass(opts.alertBoxClass)
				.addClass(typeClass)
				.hide()
				.attr(scope.getAttr('role'), 'alert')
				.append($('<div>').addClass(opts.contentClass).html(msg))
				.append('<a href="#" class="' + opts.closeClass + '">&times;</a>');

			container.append(alertBox);
			alertBox.fadeIn();

			// Create closure to set timeout for independent alerts
			// (function(alertBox){
			// 	setTimeout(function() {
			// 		alertBox.fadeOut();
			// 		console.log('sds');
			// 	}, opts.timeout);
			// })(alertBox);

			var tmout = setTimeout(function() {
				removeAlert(alertBox);
				// alertBox.removeClass(opts.showClass).addClass(opts.hideClass);
				// console.log('sds');
			}, opts.timeout);

			alertBox.find('.' + opts.closeClass).off('click.alert' + '.' + scope.namespace).on('click.alert' + '.' + scope.namespace, function(e){
				e.preventDefault();
				removeAlert($(this).closest('.' + opts.alertBoxClass));
			});
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
