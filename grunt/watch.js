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
	concatjs: {
		files: ['js/**/*.src.js'],
		tasks: ['concat_in_order', 'uglify', 'newer:bytesize']
	},

	unitTest: {
	  files: ['tests/**/test-*.html', 'tests/**/*.js'],
	  tasks: ['qunit']
	},

	test: {
		files: ['js/**/*.js','spec/**/*.js'],
		tasks: ['jshint', 'jasmine:global:build']
	}

}
