/*global document*/
(function(window, document){
	// The Grillo Framework...

	var comps = {};
	var utils = {};
	var config = {};

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
		//Get default config options from components
		// scope.config[comp] = {};
	};
	var init_comp = function(comp, scope){
		if(comps.hasOwnProperty(comp)){
			// patch(comps[comp], scope);
			return comps[comp](scope).init.apply(comps[comp], []);
		}
	};

	window.grillo = {
		init: function(config){
			// Initialize all components
			for(comp in comps){
				init_comp(comp, this);
			}
		},
		comps: comps,
		utils: utils,
		config: config,
		component: function(compName, compDeps, compFn){
			// Getter/Setter
			// grillo.component('component');
			// grillo.component('component', fn);
			// grillo.component('component', ['dependency1', 'dependency2'], fn);

			if(isFunction(compDeps)){
				// compDeps array skipped
				compFn = compFn || compDeps;
				compDeps = [];
			}

			comps[compName] = compFn;
			config[compName] = {};
		},
		utility: function(utilName, utilDeps, utilFn){
			// Getter/Setter
			// grillo.utility('utility');
			// grillo.utility('utility', fn);
			// grillo.utility('utility', ['dependency1', 'dependency2'], fn);

			if(isFunction(utilDeps)){
				// utilDeps array skipped
				utilFn = utilFn || utilDeps;
				utilDeps = [];
			}

			utils[utilName] = utilFn;
			config[utilName] = {};

			this[utilName] = utilFn;
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

/*
Usage:

grillo.init(); => object

grillo.init({
	productlist:{
		majorClass: 'major'
	}
});

grillo API:
	grillo.addUtility('utility');
	grillo.addComponent('component');
	grillo.require('js/jquery.js');
	grillo.publish('event', data);
	grillo.subscribe('event', callback(data));
	grillo.notifyMe('notification');


*/
