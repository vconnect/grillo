describe("jumbotron component", function(){
	beforeEach(function(){
		jasmine.getFixtures().fixturesPath = "spec/jumbotron";
		loadFixtures('jumbotron-basic.html');
		grillo.init('jumbotron');
	});

	it("should set the background image", function(){
		expect($('.jumbotron')).toHaveAttr('style');
		expect($('.jumbotron')).toHaveCss({'background-image': 'url(' + $('.jumbotron').attr('data-vc-jumbotron') + ')'});
	});

	it("should set the image background class", function(){
		expect($('.jumbotron')).toHaveClass('image-bg');
	});
});
