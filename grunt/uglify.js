module.exports = {
	options: {
		mangle: false
	},
	all: {
		files: {
			'js/min/grillo.min.js': ['js/global/*.js']
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

