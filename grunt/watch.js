module.exports = {
	options: {
		livereload: true
	},
	html: {
		files: ['templates/**/*.hbs', 'includes/**/*.hbs', 'layouts/**/*.hbs', 'data/**/*.{json,yml}'],
		tasks: ['assemble']
	},

  css: {
    files: ['scss/**/*.scss'],
    tasks: ['sass', 'newer:cssmin', 'newer:bytesize'],
  },

	js: {
		files: ['js/**/*.js'],
		tasks: ['newer:jshint:all','newer:uglify', 'newer:bytesize']
	},

	unitTest: {
	  files: ['tests/**/test-*.html', 'tests/**/*.js'],
	  tasks: ['qunit']
	}

}
