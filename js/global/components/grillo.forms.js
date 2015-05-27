(function(){
	grillo.addComponent('forms', function(scope){
		var defaults = {
			validateTimeout: 1000,
			invalidAttr: 'invalid',
			patterns : {
        alpha: /^[a-zA-Z]+$/,
        alpha_numeric : /^[a-zA-Z0-9]+$/,
        integer: /^\d+$/,
        number: /-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?/,

        // generic password: upper-case, lower-case, number/special character, and min 8 characters
        password : /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/,

        // amex, visa, diners
        card : /^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
        cvv : /^([0-9]){3,4}$/,

        // http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#valid-e-mail-address
        email : /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,

        url: /(https?|ftp|file|ssh):\/\/(((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-zA-Z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-zA-Z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?/,
        // abc.de
        domain: /^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,

        datetime: /([0-2][0-9]{3})\-([0-1][0-9])\-([0-3][0-9])T([0-5][0-9])\:([0-5][0-9])\:([0-5][0-9])(Z|([\-\+]([0-1][0-9])\:00))/,
        // YYYY-MM-DD
        date: /(?:19|20)[0-9]{2}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])-(?:30))|(?:(?:0[13578]|1[02])-31))/,
        // HH:MM:SS
        time : /(0[0-9]|1[0-9]|2[0-3])(:[0-5][0-9]){2}/,
        dateISO: /\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}/,
        // MM/DD/YYYY
        month_day_year : /(0[1-9]|1[012])[- \/.](0[1-9]|[12][0-9]|3[01])[- \/.](19|20)\d\d/,

        // #FFF or #FFFFFF
        color: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/
      },
      validations:{
      	delay:function(el){
      		return {
      			valid: false,
      			message: 'Hell no! After all that time!'
      		};
      	}
      },
      pending: {}
		};
		var opts = scope.extend({}, defaults, scope.config.alert);
		var cacheVariables = function(){
			opts.forms = $('[' + scope.getAttr('form') + ']');
			// console.log(opts.container);
		};
		var events = function(){
			// events..
			// 1. Disable browser validate
			// 2. Bind to submit and validate
			// 3. Bind to reset and reset
			// 4. Bind to blur and keydown events on input elements and validate
			opts.forms
				.attr('novalidate', 'novalidate')
				.off('submit.forms.' + scope.namespace).on('submit.forms.' + scope.namespace, function(e){
					console.log('Form submitted, so validate.');
					var isAjax = /ajax/i.test($(this).attr(scope.getAttr('form')));
					return validate($(this).find('input, textarea, select').get(), e, isAjax);
				})
				.off('reset.forms.' + scope.namespace).on('reset.forms.' + scope.namespace, function(e){
					console.log('Form resetted, so reset.');
					return reset(this);
				})
				.find('input, textarea, select')
					.off('blur.forms.' + scope.namespace).on('blur.forms.' + scope.namespace, function(e){
						console.log('Blurred from input element, so validate.');
						validate([this], e);
					})
					.off('keydown.forms.' + scope.namespace).on('keydown.forms.' + scope.namespace, scope.debounce(function(e){
						console.log('Key down in input element, debounce and validate.');
						validate([this], e);
					}, opts.validateTimeout));
		};

		var reset = function(form){
			$(form).removeAttr(opts.invalidAttr);
			$(form).find('[' + opts.invalidAttr + ']').removeAttr(opts.invalidAttr);
			$(form).find('.error').not('small').removeClass('error');
			return true;
		};
		var validate = function(els, e, isAjax){
			// validate function..
			// Check each element, apply validation styles
			var validateFlag = true,
					result,
					isSubmit = e && /submit/.test(e.type),
					form = $(els[0]).closest('form'),
					focusEl = null;

			for (var i = els.length - 1; i >= 0; i--) {
				console.log(els[i]);
				result = validateEl(els[i]);
				if(result !== true && !result.valid){
					console.log(result.message);
					renderState(els[i], false);
					validateFlag = false;
					focusEl = els[i];
				}
				else{
					renderState(els[i], true);
				}
			}

			if(validateFlag){
				console.log('All is well. :)');

				if(isSubmit){
					form.trigger('valid.forms.' + scope.namespace);
				}

				if(isAjax)return false;
				return true;
			}
			else{
				console.log(':( Something is not right.');

				console.log(focusEl);
				if(focusEl && isSubmit)$(focusEl).focus();
			}

			return false;
		};
		var validateEl = function(el){
			// Check for required
			// Check for pattern matching
			// Check for type matching
			// Check custom pattern matching
			// Check custom validation - accepts element, returns {valid:boolean, message:string}

			var value = $(el).val();
			var required = $(el).attr('required');
			// var validLength = required ||

			if(!required && !value.length){
				console.log('Input is empty and is not required. No need to validate.');
				return true;
			}

			if(required && !value.length){
				// Input is required but there is no input
				return {valid: false, message: 'Input is required'};
			}

			var pattern = $(el).attr('pattern') || '';
			if(pattern && !new RegExp(pattern).test(value)){
				// The input doesn't match the provided pattern
				return {valid: false, message: 'The input doesnt match the provided pattern'};
			}

			var type = $(el).attr('type');
			if(type && value.length > 0 && opts.patterns.hasOwnProperty(type) && !opts.patterns[type].test(value)){
				return {valid: false, message: 'The input has value which doesnt match the type'};
			}

			var patternName = $(el).attr(scope.getAttr('pattern'));
			if(patternName && !opts.patterns[patternName].test(value)){
				// The input doesn't match the provided pattern
				return {valid: false, message: 'The input doesnt match the provided custom pattern'};
			}

			var elValidations = $(el).attr(scope.getAttr('validation'));
			if(elValidations){
				elValidations = elValidations.split(' ');
				for(var i = 0, len = elValidations.length; i < len; i++){
					if(opts.validations[elValidations[i]]){
						var result = opts.validations[elValidations[i]](el);
						return result;
					}
				}
			}

			if(elValidations && !opts.validations[elValidations].test(value)){
				// The input doesn't match the provided pattern
				console.log('The input doesnt match the provided custom pattern');
				return {valid: false};
			}

			return true;
		};
		var renderState = function(el, valid){
			// render the state for the elements, based on if the validation fails or not
			if(valid)$(el).removeAttr(opts.invalidAttr).closest('.form-group').removeClass('error');
			else $(el).attr(opts.invalidAttr, '').closest('.form-group').addClass('error');
		};

		/**
		 * invalidate function - called to show errors in a form
		 * @param  {form element} form the form containing the elements with the errors
		 * @param  {object} data contains the data that describes the elements and their error messages
		 * @return {boolean}      ...
		 */
		var invalidate = function(form, data){
			// data format
			// {
			// 	fname: "Your first name is wrong",
			// 	surname: "I dont like your surname",
			// 	email: ""
			// }
			console.log('invalidating...');
			console.log(form);
			for(var element in data){
				if(data.hasOwnProperty(element)){
					// data[element]
					console.log(element);
					renderState($(form).find('[name="' + element + '"]')[0], false);
				}
			}
		};

		scope.addUtility("invalidateForm", function(scope){
			return invalidate;
		});

		return {
			init:function(){
				cacheVariables();
				events();
				// console.log(opts.forms);
			}
		};
	});
}());
