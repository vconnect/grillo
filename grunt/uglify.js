module.exports = {
	options: {
		mangle: false
	},
	all: {
		files: {
			'js/min/grillo.min.js': ['js/global/*.js', 'js/global/*/*.js', '!js/min/**/*.js']
		}
	},
	docs: {
		files: {
			'js/min/docs.min.js': ['js/docs.js']
		}
	}

	// all: {
	// 	files: [{
	// 		expand: true,
	// 		cwd: 'js',
	// 		src: '**/*.js',
	// 		dest: 'js/min'
	// 	}]
	// }
}

