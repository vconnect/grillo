QUnit.module('Test addComponent() behaviour');

QUnit.test("addComponent() adds component", function( assert ) {

	grillo.addComponent('dolphin1', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return{
			init:function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
			}
		}
	});
	assert.ok(grillo.comps.dolphin1, "dolphin1 component is added.");
});

QUnit.test("calls the callback initialize function", function(assert){
	calledInit = false;
	grillo.addComponent('dolphin2', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
		}
		return{
			init:function(){
				console.dir(scope);
				events();
				calledInit = true;
			}
		}
	});

	grillo.init();

	assert.ok(window.calledInit, "component is init() function is called.");
});

QUnit.test("passes in the grillo scope object", function(assert){
	grillo.addComponent('dolphin3', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
		}
		return{
			init:function(){
				console.dir(scope);
				events();
				assert.equal(scope, grillo, "The grillo scope is passed into the component.");
			}
		}
	});

	grillo.init();
});

QUnit.test("doesn't override existing component", function(assert){
	grillo.addComponent('dolphin4', function(scope){
		compFlag = 0;
		var events = function(){
			console.log('Dolphin component events executed.');
		}
		return{
			init:function(){
				console.dir(scope);
				events();
				compFlag = 1;
			}
		}
	});
	var addComp = function(){
		grillo.addComponent('dolphin4', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
			}
			return{
				init:function(){
					console.dir(scope);
					events();
					compFlag = 2;
				}
			}
		});
	}

	assert.throws(addComp, "throws an exception when another component with same name is added.");

	grillo.init();

	assert.equal(compFlag, 1, "Initial component is not overriden");
});

QUnit.test("returns grillo object", function(assert){
	assert.equal(
		grillo.addComponent('dolphin5', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
			}
			return{
				init:function(){
					console.dir(scope);
					events();
					assert.equal(scope, grillo, "The grillo scope is passed into the component.");
				}
			}
		}),
		grillo, "returns the grillo object"
	);
});


QUnit.module("Test addUtility() behaviour");

QUnit.test("addUtility() adds utility", function( assert ) {

	grillo.addUtility('dolphinUtil1', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			events();
		}
	});
	assert.ok(grillo.utils.dolphinUtil1, "Adds utility to the system.");
});

QUnit.test("fires utility function when called", function( assert ) {
	var calledBack = false;
	grillo.addUtility('dolphinUtil2', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			calledBack = true;
			events();
		}
	});

	grillo.dolphinUtil2();
	assert.ok(calledBack, "utility function executed.");
});

QUnit.test("passes in the grillo scope", function( assert ) {

	grillo.addUtility('dolphinUtil3', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			assert.equal(scope, grillo, "passed in the correct object.");
			events();
		}
	});

	grillo.dolphinUtil3();
});

QUnit.test("doesn't override existing utility", function( assert ) {
	utilFlag = 0;
	grillo.addUtility('dolphinUtil4', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			events();
			utilFlag = 1;
		}
	});
	var addUtil = function(){
		grillo.addUtility('dolphinUtil4', function(scope){
			var events = function(){
				console.log('Dolphin component events executed.');
				scope.subscribe('testChannel', function(data){
					// runTest('Listener for testChannel in dolphin component executed.');
					// runTest('Dolphin Listener Data received:')
					console.log(data);
				});
			}
			return function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
				utilFlag = 2;
			}
		})
	}
	assert.throws(addUtil, "throws an exception when utility is added with same name");
	grillo.dolphinUtil4();
	assert.equal(utilFlag, 1, "Doesn't override existing function.");
});

QUnit.test("utility in grillo scope in other utilities and components", function( assert ) {

	grillo.addUtility('dolphinUtil5', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			events();
			return "dolphinUtil utility";
		}
	});

	grillo.addUtility('gorillaUtil', function(scope){
		var events = function(){
			console.log('gorilla component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in gorilla component executed.');
				// runTest('gorilla Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('gorilla component initialized.');
			console.dir(scope);
			events();
			assert.equal(scope.dolphinUtil5(), "dolphinUtil utility", "utility in scope of utility");
		}
	});

	grillo.addComponent('kiwi', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return{
			init:function(){
				// runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
				assert.equal(scope.dolphinUtil5(), "dolphinUtil utility", "utility in scope of component");
			}
		}
	});

	grillo.init();
	grillo.gorillaUtil();
});

QUnit.test("returns the grillo object", function( assert ) {

	var dolph = grillo.addUtility('dolphinUtil6', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			events();
		}
	});
	assert.equal(dolph, grillo, "Adds utility to the system.");
});


QUnit.module("Test pubsub functionality", {
	beforeEach:function(){
		var listener1 = listener2 = listener3 = {remove:function(){}};
	},
	afterEach:function(){
		listener1.remove();
		listener2.remove();
		listener3.remove();
	}
});

QUnit.test("listeners in global scope get fired", function(assert) {

	listener1 = grillo.subscribe('fireEvent', function(){
		assert.ok(true, "Called listener in global scope");
	});

	grillo.publish('fireEvent');
});

QUnit.test("listeners in components get fired", function(assert) {
	grillo.addComponent('dolphin', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
		}
		return{
			init:function(){
				console.dir(scope);
				events();
				listener1 = scope.subscribe('fireEvent', function(){
					assert.ok(true, "Called listener in component.");
				});
			}
		}
	});

	grillo.addUtility('dolphinUtil', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			listener2 = scope.subscribe('fireEvent', function(data){
				// runTest('Listener for testChannel in dolphin component executed.');
				// runTest('Dolphin Listener Data received:')
				console.log(data);
				assert.ok(true, "Called listener in utility.");
			});
		};
		return function(){
			// runTest('Dolphin component initialized.');
			console.dir(scope);
			events();
		}
	});

	listener3 = grillo.subscribe('fireEvent', function(){
		assert.ok(true, "Called listener in global scope");
	});

	grillo.init();
	grillo.dolphinUtil();

	grillo.publish('fireEvent');
});

QUnit.test("passes the data object", function(assert) {

	var originalData = {text: "Hi"};
	listener1 = grillo.subscribe('fireEvent', function(data){
		assert.deepEqual(data, originalData, "passes the data object.");
	});

	grillo.publish('fireEvent', originalData);
});

QUnit.test("passes an empty object when there is no data", function(assert) {
	listener1 = grillo.subscribe('fireEvent', function(data){
		console.log(data);
		assert.deepEqual(data, {}, "passes an empty object.");
		assert.ok(data, "passes an empty object.");
	});

	grillo.publish('fireEvent');
});

QUnit.test("publish() returns the grillo object", function( assert ) {
	listener1 = grillo.subscribe('fireEvent', function(data){
		console.log(data);
	});
	assert.deepEqual(grillo.publish('fireEvent'), grillo, "returns the grillo object.");
});

QUnit.test("remove() function removes listener", function( assert ) {
	var inListener = false;
	listener1 = grillo.subscribe('fireEvent', function(data){
		console.log(data);
		inListener = true;
	});
	listener1.remove();
	grillo.publish('fireEvent');

	assert.equal(inListener, false, "listener was not called.");
});

/*
	addComponent:
		-adds component
		-calls callback initialize function
		-passes in the grillo scope object
		-doesn't override existing component
		-returns grillo object

	addUtility:
		-adds utility
		-fires utility function when called
		-passes in the grillo scope object
		-doesn't override existing utilities
		-utility in grillo scope in other components
		-utility in grillo scope in other utilities
		-returns the grillo object

	publish:
		-listeners in global scope get fired
		-listeners in components get fired
		-passes the data object
		-passes an empty data object when there is no data
		-returns the grillo object

	subscribe:
		-remove() function removes listener

	getAttr:
		returns new string with data namespace
		without options, returns the data namespace alone
		with two arguments, returns data namespace with the specified value
*/
