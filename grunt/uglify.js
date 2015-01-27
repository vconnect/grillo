module.exports = {
	options: {
		mangle: false
	},
	all: {
		files: {
			'js/min/grillo.min.js': ['js/**/*.js']
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

