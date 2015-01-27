/*global document*/
(function(window, document){
	// The Grillo Framework...

	var _comps = {};
	var _utils = {};
	var _config = {};

	// Pub/Sub variables
	var channels = {};
	var hOP = channels.hasOwnProperty;

	// Helper functions

	// isFunction - http://stackoverflow.com/a/7356528
	var isFunction = function(fn) {
		var getType = {};
		return fn && getType.toString.call(fn) === '[object Function]';
	}

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
	}


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

	window.grillo = {
		init: function(_config){
			// Initialize all components
			for(comp in _comps){
				init_comp(comp, this);
			}
		},
		comps: _comps,
		utils: _utils,
		config: _config,
		addComponent: function(compName, compDeps, compFn){
			// Getter/Setter
			// grillo.addComponent('component');
			// grillo.addComponent('component', fn);
			// grillo.addComponent('component', ['dependency1', 'dependency2'], fn);

			if(isFunction(compDeps)){
				// compDeps array skipped
				compFn = compFn || compDeps;
				compDeps = [];
			}

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

			_utils[utilName] = utilFn;
			_config[utilName] = {};

			this[utilName] = utilFn(this);

			return this; //return the this object for chaining
		},
		require: {},
		// PubSub from David Walsh - http://davidwalsh.name/pubsub-javascript
		publish: function(channel, data){
			// If the channel doesn't exist, just return. (It simply means there are no listeners)
			if(!hOP.call(channels, channel)) return;
			data = data || {};
			lenListeners = channels[channel].length;
			for(i = 0; i < lenListeners; i++){
				// Execute each listener
				channels[channel][i](data);
			}
		},
		subscribe: function(channel, listener){
			// If the channel doesn't exist, create the object
			if(!hOP.call(channels, channel)) channels[channel] = [];

			// Add the listener to the queue
			var index = channels[channel].push(listener) - 1;

			return {
				remove:function(){
					delete channels[channel][index];
				}
			};
		}
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
				console.log('Alert component initialized')
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

grillo.comps.comp_name = (function(scope){
	var _privateThings = true;
	return {
		init: function(){
			initialise component
		};
	};
}());
*/

/**
* @depend ../global/grillo.core.js
* @depend ../global/components/grillo.alert.js
*/
