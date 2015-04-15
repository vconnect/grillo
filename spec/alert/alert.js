describe("alert utility", function(){
	beforeEach(function(){
		jasmine.getFixtures().fixturesPath = "spec/alert";
		loadFixtures('alert-basic.html');
		// jasmine.clock().install();
		// setTimeout(function() {
		// 	done();
		// }, 4000);
	});

	afterEach(function(){
		// jasmine.clock().uninstall();
	});

	it("should create the container element", function(){
		grillo.alert('Highlander!');
		grillo.alert('There!',{timeout:1000});
		grillo.alert('Alright!', {timeout:2000});
		grillo.alert('Doodles!', {type: 'error'});
		grillo.alert('Peeka!', {type: 'warning', timeout:3000});
		expect($('.alert-container')).toBeInDOM();
	});

	it("should create the alert element", function(){
		grillo.alert('Peeka!');
		expect($('.alert-box')).toBeInDOM();
	});

	it("should remove the alert after the default timeout", function(done){
		grillo.alert('Doodles');
		expect($('.alert-box')).toBeInDOM();
		setTimeout(function() {
			// console.log($('.alert-box'));
			expect($('.alert-box')).not.toBeInDOM();
			done();
		}, 4500); //4000ms timeout plus 500ms offset for animation
	});

	it("should remove the alert after the specified timeout", function(done){
		grillo.alert('Doodles', {timeout: 2000});
		expect($('.alert-box')).toBeInDOM();
		setTimeout(function() {
			// console.log($('.alert-box'));
			expect($('.alert-box')).not.toBeInDOM();
			done();
		}, 2500); //4000ms timeout plus 500ms offset for animation
	});

	it("should remove the alert when the close button is clicked", function(done){
		grillo.alert('Peeka');
		$('.alert-box .alert-close').click();
		setTimeout(function() {
			// console.log($('.alert-box'));
			expect($('.alert-box')).not.toBeInDOM();
			done();
		}, 1000);
	});

	it("should have the specified type", function(done){
		grillo.alert('Janko', {timeout: 2000, type: 'error'});
		expect($('.alert-box')).toHaveClass('alert-error');
		setTimeout(function() {
			// console.log($('.alert-box'));
			expect($('.alert-box')).not.toBeInDOM();
			done();
		}, 2500); //4000ms timeout plus 500ms offset for animation
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
