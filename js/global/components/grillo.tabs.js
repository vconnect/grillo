(function(){
	grillo.addComponent('tabs', function(scope){
		var defaults = {
			tabsContainerClass: 'tabs-content',
			tabsClass: 'content',
			activeTabClass: 'active',
			tabTriggersListClass: 'nav-tabs'
		};
		var opts = scope.extend({}, defaults, scope.config.alert);

		var cacheVariables = function(){
			opts.tabTriggers = $('[' + scope.getAttr('tab') + ']');
			opts.tabContents = $('.' + opts.tabsContainerClass).find('.' + opts.tabsClass);
		};
		var events = function(){
			opts.tabTriggers.off('click.tabs.' + scope.namespace).on('click.tabs.' + scope.namespace, function(e){
				e.preventDefault();

				showTab(this);
			});
		};

		var showTab = function(tabTrigger){
			var tabTarget = $(tabTrigger).attr('href');
			// console.log(tabTarget);
			// console.log(opts.tabContents);
			// console.log(opts.tabContents.find(tabTarget));
			//
			// 1. Remove active class from all the tabs
			opts.tabContents.removeClass(opts.activeTabClass);

			// 2. Add active class to current tab
			opts.tabContents.filter(tabTarget).addClass(opts.activeTabClass);

			// 3. Remove active class from all tab triggers
			$(tabTrigger).closest('.' + opts.tabTriggersListClass).children('li').removeClass(opts.activeTabClass);
			// 4. Add the active class to the tab trigger
			$(tabTrigger).closest('.' + opts.tabTriggersListClass + ' li').addClass(opts.activeTabClass);
		}

		return {
			init:function(){
				//NOTE: If div is hidden, the page will not jump
				cacheVariables();
				events();

				// show tab for initially active tab => [data-vc-tab="active"]
				opts.tabTriggers.filter(function(){
					return $(this).attr(scope.getAttr('tab')) === 'active';
				}).each(function(){
					showTab(this);
				});
			}
		};
	});
}());
