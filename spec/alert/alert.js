describe("alert utility", function(){
	beforeEach(function(){
		jasmine.getFixtures().fixturesPath = "spec/alert";
		loadFixtures('alert-basic.html');
	});

	it("should create the container element", function(){
		grillo.alert('Highlander!');
		expect($('.alert-container')).toBeInDOM();
	});

	it("should create the alert element", function(){
		expect($('.alert-box')).toBeInDOM();
	});
});
// grillo.alert('Hi');
// grillo.alert('Hi', {
// 	type: 'error',
// 	timeout: 4000
// });
//
// should create container element
// should display alert element
// should remove alert element after specified timeout
// should add the correct class to alert element
