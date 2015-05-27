(function(){
	grillo.addComponent('modal', function(scope){
		var defaults = {
			imgBgClass: 'image-bg',
			animationClass: 'fade',
			modalOpenClass: 'open',
			modalOpenAnchorClass: 'open-anchor',
			modalWrapperClass: 'modal-container',
			overlayClass: 'modal-overlay',
			closeButtonClass: 'modal-close',
			blurContainerClass: 'modal-blur',
			blurContainerSelector: '.wrapper',
			modalTop: 20,
			modals: {}
		};
		var opts = scope.extend({}, defaults, scope.config.alert);

		var Modal = function(target){
			var _ = this;
			this.modal = $(scope.getAttr('modal-id', target));
			this.modalWrapper = $('<div>').addClass(opts.modalWrapperClass);
			this.closeButton = $('<a href="#">&times;</a>').addClass(opts.closeButtonClass);
			this.closeButton.appendTo(this.modalWrapper);
			this.overlay = $('<div>').addClass(opts.overlayClass);
			this.originalParent = this.modal.parent();
			this.blurContainer = $(opts.blurContainerSelector);

			this.initializeEvents = function(){
				this.overlay.off('click.modal' + '.' + scope.namespace).on('click.modal' + '.' + scope.namespace, function(){
					_.close();
				});
				this.closeButton.off('click.modal' + '.' + scope.namespace).on('click.modal' + '.' + scope.namespace, function(e){
					e.preventDefault();
					_.close();
				});

				$('body').off('keyup.modal' + '.' + scope.namespace).on('keyup.modal' + '.' + scope.namespace, function(e){
					if (e.which === 27) { // 27 is the keycode for the Escape key
						_.close();
					}
				});
			};

			return this; //chaining
		};

		Modal.prototype = scope.extend(Modal.prototype, {
			open: function(){
				this.modal.detach().appendTo(this.modalWrapper);
				$('body').append(this.modalWrapper.addClass(opts.animationClass));
				$('body').append(this.overlay.addClass(opts.animationClass));

				//force the browser to recalculate and recognize the elements.
				//This is so that CSS animation has a start point
				window.getComputedStyle(this.modalWrapper[0]).height; // jshint ignore:line

				if(this.modalWrapper.height()>$(window).height()){
					this.modalWrapper.addClass(opts.modalOpenAnchorClass);
				}
				this.modalWrapper.css('top', $(window).scrollTop() + opts.modalTop + 'px');
				this.modalWrapper.addClass(opts.modalOpenClass);
				this.overlay.addClass(opts.modalOpenClass);
				this.blurContainer.addClass(opts.blurContainerClass);

				this.initializeEvents();
				// console.log(this.modal);
			},
			close: function(){
				var _ = this;

				this.overlay.removeClass(opts.modalOpenClass);
				this.modalWrapper.removeClass(opts.modalOpenClass);
				this.modalWrapper.removeClass(opts.modalOpenAnchorClass);
				this.modalWrapper.css('top', '');

				this.overlay.off(scope.transitionEnd).on(scope.transitionEnd, function(){
					var $this = $(this);
					$this.off(scope.transitionEnd);
					$this.remove();
				});

				this.modalWrapper.off(scope.transitionEnd).on(scope.transitionEnd, function(){
					var $this = $(this);
					$this.off(scope.transitionEnd);
					_.modal.detach().appendTo(this.originalParent);
					$this.remove();
				});

				this.blurContainer.removeClass(opts.blurContainerClass);

				$('body').off('keyup.modal' + '.' + scope.namespace);
			}
		});


		var cacheVariables = function(){
			opts.modalTargets = $('[' + scope.getAttr('modal-id') + ']');
			opts.modalTrigger = $('[' + scope.getAttr('modal-target') + ']');
		};
		var events = function(){
			opts.modalTrigger.off('click.modal' + '.' + scope.namespace).on('click.modal' + '.' + scope.namespace, function(e){
				e.preventDefault();
				var targetModal = $(this).attr(scope.getAttr('modal-target'));
				var modal = opts.modals[targetModal].open();
			});
		};

		return {
			init:function(){
				cacheVariables();
				events();

				opts.modalTargets.each(function(){
					// trigger modals
					var modalID = $(this).attr(scope.getAttr('modal-id'));

					opts.modals[modalID] = new Modal(modalID);
				});
			}
		};
	});
}());
