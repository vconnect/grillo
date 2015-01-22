modules.exports = {
			options: {
				livereload: true
			},

	    css: {
	      files: ['scss/**/*.scss'],
	      tasks: ['compass'],
	    },

			js: {
				files: ['js/**/*.js'],
				tasks: ['newer:uglify']
			}
		},

}
