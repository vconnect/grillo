(function(){
	grillo.addComponent('alert', function(scope){
		var _privateThings = true;
		return {
			init: function(){
				// initialize component
				console.log('Alert component initialized')
			};
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
