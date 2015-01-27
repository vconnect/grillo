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
    tasks: ['newer:sass', 'newer:cssmin', 'newer:bytesize'],
  },

	js: {
		files: ['js/**/*.js'],
		tasks: ['newer:uglify', 'newer:bytesize']
	},

	unitTest: {
	  files: ['test/keyLogger/*.html', 'test/keyLogger/*.js', 'test/keyLogger/js/*.js'],
	  tasks: ['unit']
	}

}
