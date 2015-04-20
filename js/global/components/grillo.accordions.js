(function(){
	grillo.addComponent('accordions', function(scope){
		var defaults = {
			panelClass: 'accordion-item',
			activePanelClass: 'active',
			triggerContainerClass: 'accordion-heading'
		};
		var opts = scope.extend({}, defaults, scope.config.alert);

		var cacheVariables = function(){
			opts.accordions = $('[' + scope.getAttr('accordion') + ']');
			opts.accordionTriggers = opts.accordions.find('.' + opts.triggerContainerClass + ' a');
		};
		var events = function(){
			opts.accordionTriggers.off('click.accordions.' + scope.namespace).on('click.accordions.' + scope.namespace, function(e){
				e.preventDefault();

				showPanelContent(this);
			});
		};

		var showPanelContent = function(panelTrigger){
			var panelTarget = $(panelTrigger).attr('href');

			// 1. Remove active class from all the accordion panels
			opts.accordions.find('.' + opts.panelClass).removeClass(opts.activePanelClass);

			// 2. Add active class to current accordion panel
			opts.accordions.find(panelTarget).closest('.' + opts.panelClass).addClass(opts.activePanelClass);
		}

		return {
			init:function(){
				//NOTE: If div is hidden, the page will not jump
				cacheVariables();
				events();
			}
		};
	});
}());
