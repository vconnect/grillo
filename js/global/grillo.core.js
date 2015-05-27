/*global document*/
(function(window, document){
	// The Grillo Framework...

	var _comps = {},
			_utils = {},
			_config = {};

	var _namespace = "vc";

	// Require variables
	var _requireTimeout = 5000;
	var _scriptPaths = {
		foo: 'spec/utilities/script5.js'
	};
	var _scriptStore = {};

	// Pub/Sub variables
	var channels = {};
	var hOP = channels.hasOwnProperty;

	// HELPER FUNCTIONS
	// ----------------

	var getCSS = function(el, prop){
		return ('getComputedStyle' in window) && window.getComputedStyle(el, null).getPropertyValue(prop) || el.currentStyle[prop];
	};

	var hasClass = function(el, className){
		if(el.classList)el.classList.contains(className);
		else new RegExp('(^| )' + className + '($| )', 'gi').test(el.className);
	};

	var addClass = function(el, className){
		if(el.classList)el.classList.add(className);
		else el.className += ' ' + className;
		return el;
	};
	// isFunction - http://stackoverflow.com/a/7356528
	var isFunction = function(fn) {
		var getType = {};
		return fn && getType.toString.call(fn) === '[object Function]';
	};

	var isString = function(i){
		return typeof i === 'string';
	};

	var isArray = function(i){
		return i.constructor === Array;
	};

	var noop = function(){};

	// from qunit.js
	var extend = function( a, b, c ) {
		for ( var prop in b ) {
			if ( b[ prop ] === undefined ) {
				delete a[ prop ];

			// Avoid "Member not found" error in IE8 caused by setting window.constructor
			} else if ( prop !== "constructor" || a !== window ) {
				a[ prop ] = b[ prop ];
			}
		}
		if(c){
			extend(a, c);
		}
		return a;
	};

	// THROTTLE AND DEBOUNCE
	// ---------------------
	var throttle = function(func, delay) {
  // Description:
  //    Executes a function a max of once every n milliseconds
  //
  // Arguments:
  //    Func (Function): Function to be throttled.
  //
  //    Delay (Integer): Function execution threshold in milliseconds.
  //
  // Returns:
  //    Lazy_function (Function): Function with throttling applied.
    var timer = null;

    return function () {
      var context = this, args = arguments;

      clearTimeout(timer);
      timer = setTimeout(function () {
        func.apply(context, args);
      }, delay);
    };
  };

  var debounce = function(func, delay, immediate) {
  // Description:
  //    Executes a function when it stops being invoked for n seconds
  //    Modified version of _.debounce() http://underscorejs.org
  //
  // Arguments:
  //    Func (Function): Function to be debounced.
  //
  //    Delay (Integer): Function execution threshold in milliseconds.
  //
  //    Immediate (Bool): Whether the function should be called at the beginning
  //    of the delay instead of the end. Default is false.
  //
  // Returns:
  //    Lazy_function (Function): Function with debouncing applied.
    var timeout, result;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, delay);
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

	function transitionEndSelect() {
		var el = document.createElement("div");
		if (el.style.WebkitTransition) return "webkitTransitionEnd";
		if (el.style.OTransition) return "oTransitionEnd";
		return 'transitionend';
	}

	// MatchMedia Polyfill
	window.matchMedia = window.matchMedia || function() {
		"use strict";
		console.log('a');
		// For browsers that support matchMedium api such as IE 9 and webkit
		var styleMedia = (window.styleMedia || window.media);

		// For those that don't support matchMedium
		if (!styleMedia) {
			var style       = document.createElement('style'),
					script      = document.getElementsByTagName('script')[0],
					info        = null;

			style.type  = 'text/css';
			style.id    = 'matchmediajs-test';

			script.parentNode.insertBefore(style, script);

			// 'style.currentStyle' is used by IE <= 8 and 'window.getComputedStyle' for all other browsers
			info = ('getComputedStyle' in window) && window.getComputedStyle(style, null) || style.currentStyle;

			styleMedia = {
				matchMedium: function(media) {
					var text = '@media ' + media + '{ #matchmediajs-test { width: 1px; } }';

					// 'style.styleSheet' is used by IE <= 8 and 'style.textContent' for all other browsers
					if (style.styleSheet) {
						style.styleSheet.cssText = text;
					} else {
						style.textContent = text;
					}

					// Test if media query is true or false
					return info.width === '1px';
				}
			};
		}

		return function(media) {
			return {
				matches: styleMedia.matchMedium(media || 'all'),
				media: media || 'all'
			};
		};
	}();

	// MEDIA QUERY FUNCTIONS
	// ---------------------

	var header_helpers = function (class_array) {
    var i = class_array.length;
    var head = document.querySelector('head');

    while (i--) {
    	if(head.querySelectorAll(class_array[i]).length === 0){
    		var metaEl = document.createElement('meta');
    		head.appendChild(addClass(metaEl, class_array[i]));
    	}
    	// for (var j = head.children.length - 1; j >= 0; j--) {
    	// 	if(head.children[j].nodeType != 8) //Skip comment nodes in IE8
    	// 		head.children[j]
    	// };
     //  if(head.has('.' + class_array[i]).length === 0) {
     //    head.append('<meta class="' + class_array[i] + '">');
     //  }
    }
  };

  header_helpers([
    'grillo-mq-xsmall',
    'grillo-mq-small',
    'grillo-mq-medium',
    'grillo-mq-large']);

	var mq = {
		xsmall: getCSS(document.querySelector('.grillo-mq-xsmall'), 'font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
		small: getCSS(document.querySelector('.grillo-mq-small'), 'font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
		medium: getCSS(document.querySelector('.grillo-mq-medium'), 'font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, ''),
		large: getCSS(document.querySelector('.grillo-mq-large'), 'font-family').replace(/^[\/\\'"]+|(;\s?})+|[\/\\'"]+$/g, '')
	};

	var patch = function(comp, scope){
		//Get default _config options from components
		// scope._config[comp] = {};
	};
	var init_comp = function(comp, scope){
		if(_comps.hasOwnProperty(comp)){
			// patch(_comps[comp], scope);
			return _comps[comp](scope).init.apply(_comps[comp], []);
		}
	};


	GrilloException = function(message){
		this.name = "GrilloException";
		this.message = message || "An error has occurred.";
	};
	GrilloException.prototype = Object.create(Error.prototype);
	GrilloException.prototype.constructor = GrilloException;


	window.grillo = {
		/**
		 * init The function used to initialise the system
		 * @param  {object} _config Optional. Configuration object to override the default config
		 * @return {boolean}         ...
		 */
		init: function(_config){
			// Initialize all components
			for(var comp in _comps){
				init_comp(comp, this);
			}
			this.transitionEnd = transitionEndSelect();
		},
		namespace: _namespace,
		comps: _comps,
		utils: _utils,
		config: _config,
		scriptStore: _scriptStore,
		extend: extend,
		throttle: throttle,
		debounce: debounce,

		/**
		 * addComponent Used to add a component to the system
		 * @param {string} compName Specifies the name of the component to be created
		 * @param {string} compDeps Specifies the dependencies of the component
		 * @param {function} compFn   Specifies the function definition of the component
		 */
		addComponent: function(compName, compDeps, compFn){
			// grillo.addComponent('component');
			// grillo.addComponent('component', fn);
			// grillo.addComponent('component', ['dependency1', 'dependency2'], fn);

			if(isFunction(compDeps)){
				// compDeps array skipped
				compFn = compFn || compDeps;
				compDeps = [];
			}
			// console.log(_comps[compName]);
			// Throw an exception if a component with the same name already exists
			if(_comps.hasOwnProperty(compName))throw new GrilloException("Already defined a component as: " + compName);
			_comps[compName] = compFn;
			_config[compName] = {};

			return this; //return the this object for chaining
		},

		/**
		 * addUtility Used to add a utility to the system
		 * @param {string} utilName Specifies the name of the utility to be created
		 * @param {string} utilDeps Specifies the dependencies of the utility
		 * @param {function} utilFn   Specifies the function definition of the utility
		 */
		addUtility: function(utilName, utilDeps, utilFn){
			// Getter/Setter
			// grillo.addUtility('utility');
			// grillo.addUtility('utility', fn);
			// grillo.addUtility('utility', ['dependency1', 'dependency2'], fn);

			if(isFunction(utilDeps)){
				// utilDeps array skipped
				utilFn = utilFn || utilDeps;
				utilDeps = [];
			}

			if(_utils.hasOwnProperty(utilName))throw new GrilloException("Already defined a utility as: " + utilName);
			_utils[utilName] = utilFn;
			_config[utilName] = {};

			this[utilName] = utilFn(this);

			return this; //return the this object for chaining
		},

		/**
		 * removeComponent removes a component from the system
		 * @param  {string} compName Name of the component to remove
		 * @return {object} grillo object
		 */
		removeComponent: function(compName){
			delete _comps[compName];
			delete _config[compName];

			return this; //return the this object for chaining
		},

		/**
		 * removeUtility removes a utility from the system
		 * @param  {string} utilName Name of the utility to remove
		 * @return {object} grillo object
		 */
		removeUtility: function(utilName){
			delete _utils[utilName];
			delete _config[utilName];

			delete this[utilName];

			return this; //return the this object for chaining
		},

		/**
		 * require Used to asynchronously load scripts into the webpage
		 * @param  {string/array}   scriptURLs specifies the URLs to be asynchronously loaded
		 * @param  {function}   testFn     optional. A Test to check if the scripts were loaded
		 * @param  {function} callback   The callback function to be called after loading the scripts
		 * @return {boolean}              ...
		 */
		require: function(scriptURLs, testFn, callback){
			// script loading - http://www.html5rocks.com/en/tutorials/speed/script-loading/

			var scripts = [];
			var src, script, scriptExists = false;
			var pendingScripts = [];
			var firstScript = document.scripts[0];
			var flgCount = 0;
			var failTimeout = null;

			var _failFn = noop;
			var _alwaysFn = noop;
			var _testFn = (callback && testFn) || function(){return true;}; //if two callbacks exist, then that must be testFn
			var _callback = callback || testFn || noop; //if only one callback exists, then that must be callback
			if(!isFunction(_callback)){
				var callbackObj = _callback;
				_callback = callbackObj.success || noop;
				_failFn = callbackObj.failure || noop;
				_alwaysFn = callbackObj.always || noop;
			}

			if(isString(scriptURLs)){ // make scriptURLs an array
				var tmp = [];
				tmp.push(scriptURLs);
				scriptURLs = tmp;
			}

			var noOfScripts = scriptURLs.length;
			for(var i=0; i < noOfScripts; i++){
				// Add the correct URLs for those in the storePaths object.
				scripts[scriptURLs[i]] = _scriptPaths[scriptURLs[i]] || scriptURLs[i];
			}

			var checkProgress = function(){
				if(++flgCount == noOfScripts){// Check testFn when all the scripts are loaded
					clearTimeout(failTimeout); // Prevent the failTimeout function from executing
					if(_testFn())_callback(); // Fire the callback if test passes
					else _failFn();
					_alwaysFn();
				}
			};

			// Watch scripts load in IE
			var stateChange = function(){
				var pendingScript;
				while(pendingScripts[0] && pendingScripts[0].readyState == 'loaded'){
					pendingScript = pendingScripts.shift();
					// avoid future loading events from this script (eg, if src changes)
					pendingScript.onreadystatechange = null;
					// can't just appendChild, old IE bug if element isn't closed
					firstScript.parentNode.insertBefore(pendingScript, firstScript);

					checkProgress(); //check for when all the scripts are loaded
				}
			};

			// Watch scripts load in modern browsers
			var stateChangeModern = function(){
				// console.log('modern onload called.');
				// console.log(arguments);
				checkProgress();
			};

			// loop through script URLs
			for(var key in scripts){
				src = scripts[key];
				scriptExists = false;
				console.log(src);
				if(src.split('.').pop() !== 'js'){ //check if URL is a JS file
					// Check for existing key with same name
					console.log('Not a JS file.');
					src += '.js';
				}
				for(var scpt in _scriptStore){
				// loop through scriptStore to check if the script has already been added
					if(_scriptStore[scpt] == src){
						scriptExists = true;
						checkProgress();
						break;
					}
				}
				if(!scriptExists){ //if the script doesn't yet exist
					if('async' in firstScript){ //for modern browsers
						script = document.createElement('script');
						script.async = false;
						script.onload = stateChangeModern;
						script.src = src;
						document.head.appendChild(script);
					}
					else if(firstScript.readyState){ //IE<10
						// create a script and add it to the TODO pile
						script = document.createElement('script');
						pendingScripts.push(script);
						// listen for state changes
						script.onreadystatechange = stateChange;
						// must set src AFTER onreadystatechange listener
						// so we don't miss the loaded event for cached scripts
						script.src = src;
					}
					else{ //fallback to defer
						document.write('<script src="' + src + '" defer></' + 'script>'); // jshint ignore:line
					}
					_scriptStore[key] = src;
				}
				// checkProgress();
			}
			if(flgCount < noOfScripts){
				// Only create the timeout if the scripts have not yet finished loading
				failTimeout = setTimeout(function(){ // call the failure function if the scripts were not completely loaded in the specified time
					_failFn();
					_alwaysFn();
					return false;
				}, _requireTimeout);
			}
		},

		/**
		 * getAttr Used to get the attribute of the specified name-value pair
		 * @param  {string} attrName  Specifies the name of the attribute to be gotten
		 * @param  {string} attrValue Specifies the value to check for when getting the attribute
		 * @return {string}           The attribute with the proper namespace-name-value combination
		 */
		getAttr: function(attrName, attrValue){
			if(attrName){
				if(attrValue){
					if(_namespace)return "[data-" + _namespace + "-" + attrName + "=" + attrValue + "]";
					return "[data-" + attrName + "=" + attrValue + "]";
				}
				if(_namespace)return "data-" + _namespace + "-" + attrName;
				return "data-" + attrName;
			}
			return "data-" + _namespace;
			// return (attrName && ((attrValue && "[data-" + _namespace + "-" + attrName + "=" + attrValue + "]") || (_namespace && "data-" + _namespace + "-" + attrName) || "data-" + attrName)) || "data-" + _namespace;
		},

		// PubSub from David Walsh - http://davidwalsh.name/pubsub-javascript
		/**
		 * publish Used to publish data to a specified channel
		 * @param  {string} channel Specifies the channel to be published to
		 * @param  {string} data    Specifies the data object
		 * @return {grillo object}         The grillo object (this)
		 */
		publish: function(channel, data){
			// If the channel doesn't exist, just return. (It simply means there are no listeners)
			if(!hOP.call(channels, channel)) return;
			data = data || {};
			lenListeners = channels[channel].length;
			for(i = 0; i < lenListeners; i++){
				// Execute each listener
				channels[channel][i] && channels[channel][i](data); // jshint ignore:line
			}
			return this;
		},

		/**
		 * subscribe Used to subscribe to a specific channel to receive updates
		 * @param  {string} channel  Specifies the channel to listen to
		 * @param  {function} listener Specifies the callback function to be executed when data is published
		 * @return {grillo object}          The grillo object (this)
		 */
		subscribe: function(channel, listener){
			// If the channel doesn't exist, create the object
			if(!hOP.call(channels, channel)) channels[channel] = [];

			// Add the listener to the queue
			var index = channels[channel].push(listener) - 1;

			return {
				remove:function(){
					delete channels[channel][index];
					// channels[channel].splice(index, 1);
				}
			};
		},

		/**
		 * mq Object containing the supported media queries
		 * @type {object}
		 */
		mq: mq
	};
}(this, document));

// depend components/grillo.alert.js
/**
* depend components/grillo.validate.js
* depend components/grillo.alert.js
*/
/*
Usage:

grillo.init(); => grillo object

grillo.init('jumbotron'); => only initialize jumbotron component

grillo.init({
	productlist:{
		majorClass: 'major'
	}
});

grillo API:
	grillo.addUtility('utility'); => return grillo object
	grillo.addComponent('component'); => return grillo object
	grillo.require('js/jquery.js');
	grillo.publish('event', data);
	grillo.subscribe('event', callback(data));
	grillo.notifyMe('notification');

	grillo.getAttr('role') => 'data-vc-role'

	matchMedia(grillo.mq.small) => true

	Functions of components are exposed to the component object in the grillo object
	grillo.tabs.show()

*/
