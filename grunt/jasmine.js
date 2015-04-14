module.exports = {
	global: {
		src: ['js/global/grillo.core.js', 'js/global/*/*.js'],
		options: {
			specs: [
				'spec/**/*.js',
				'!spec/utilities/*.js'
			],
			vendor: [
				'js/vendor/jquery-1.10.2.min.js',
				'js/vendor/jasmine-jquery.js'
			],
			styles: [
				'css/grillo.css'
			]
		}
	}
}
