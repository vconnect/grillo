QUnit.module('Test Grillo Core APIs');

QUnit.test( "addComponent() adds component", function( assert ) {

	grillo.addComponent('dolphin', function(scope){
		var events = function(){
			console.log('Dolphin component events executed.');
			scope.subscribe('testChannel', function(data){
				runTest('Listener for testChannel in dolphin component executed.');
				runTest('Dolphin Listener Data received:')
				console.log(data);
			});
		}
		return{
			init:function(){
				runTest('Dolphin component initialized.');
				console.dir(scope);
				events();
			}
		}
	});

	assert.ok(grillo.comps.dolphin, "undefined fails.");
});



// var module = function(text){
// 	console.log('%c' + text, 'color:tomato; font-size:16px; font-weight:bold; font-family:roboto;');
// }
// var runTest = function(text){
// 	console.log('%c' + text, 'background:orange; color:white; padding:0 10px;');
// }

// var result = function(object){
// 	console.log(object);
// 	// , 'background:lightgray; color:darkgray; border:1px solid lime;padding:10px;'
// }

// module('Test Grillo Core APIs');
// runTest('addComponent() should add component');

// grillo.addComponent('dolphin', function(scope){
// 	var events = function(){
// 		console.log('Dolphin component events executed.');
// 		scope.subscribe('testChannel', function(data){
// 			runTest('Listener for testChannel in dolphin component executed.');
// 			runTest('Dolphin Listener Data received:')
// 			console.log(data);
// 		});
// 	}
// 	return{
// 		init:function(){
// 			runTest('Dolphin component initialized.');
// 			console.dir(scope);
// 			events();
// 		}
// 	}
// }).addUtility('dolphinUtil', function(scope){
// 	return function(text){
// 		console.log(scope.config);
// 		runTest('Dolphin utility executed: ' + text);
// 	}
// });

// result(grillo.comps);
// result(grillo.utils);
// result(grillo.config);

// grillo.subscribe('testChannel', function(data){
// 	runTest('Listener for testChannel in root scope executed.');
// 	runTest('Data received: ');
// 	console.log(data);
// });

// grillo.publish('testChannel', {val1: 'val1', val2: 'val2'});

// grillo.init();

// grillo.publish('testChannel', {val3: 'val3', val4: 'val4'});

// grillo.dolphinUtil('hi');
