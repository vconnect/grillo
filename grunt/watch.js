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
	},

	unitTest: {
	  files: ['test/keyLogger/*.html', 'test/keyLogger/*.js', 'test/keyLogger/js/*.js'],
	  tasks: ['unit']
	}

}
