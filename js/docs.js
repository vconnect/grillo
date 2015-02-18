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
		foo: 'js/script5.js'
	};
	var _scriptStore = {};

	// Pub/Sub variables
	var channels = {};
	var hOP = channels.hasOwnProperty;

	// Helper functions

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
	var extend = function( a, b ) {
		for ( var prop in b ) {
			if ( b[ prop ] === undefined ) {
				delete a[ prop ];

			// Avoid "Member not found" error in IE8 caused by setting window.constructor
			} else if ( prop !== "constructor" || a !== window ) {
				a[ prop ] = b[ prop ];
			}
		}
		return a;
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
		init: function(_config){
			// Initialize all components
			for(var comp in _comps){
				init_comp(comp, this);
			}
		},
		comps: _comps,
		utils: _utils,
		config: _config,
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
			if(_comps.hasOwnProperty(compName))throw new GrilloException("Already defined a component as: " + compName);
			_comps[compName] = compFn;
			_config[compName] = {};

			return this; //return the this object for chaining
		},
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

			failTimeout = setTimeout(function(){ // call the failure function if the scripts were not completely loaded in the specified time
				_failFn();
				_alwaysFn();
				return false;
			}, _requireTimeout);
		},
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
		scriptStore: _scriptStore
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

*/

(function(){
	grillo.addComponent('alert', function(scope){
		var _privateThings = true;
		return {
			init: function(){
				// initialize component
				console.log('Alert component initialized');
			}
		};
	});
}());

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

grillo.addUtility('template', function(scope){
    return function(templateString, data){
      /* Nano Templates (Tomasz Mazur, Jacek Becela) */
			return templateString.replace(/\{([\w\.]*)\}/g, function(str, key) {
				var keys = key.split("."), v = data[keys.shift()];
				for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
				return (typeof v !== "undefined" && v !== null) ? v : "";
			});
    };
});

/**
* @depend ../global/grillo.core.js
* @depend ../global/components/grillo.alert.js
* @depend ../global/components/grillo.template.js
*/
