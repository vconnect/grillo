module.exports = {

  // options: {
  //     server: {
  //         baseDir: "./"
  //     },
  //     watchTask: true
  // }

  grillo: {
      src : [
      	'css/grillo.css',
      	'js/global/**/*.js',
      	'spec/**/*.js'
      ]
  },
  docs: {
      src : [
      	'css/docs.css',
      	'js/docs/**/*.js',
      	'docs/*.html'
      ]
  },

  options: {
      server: {
          baseDir: "./"
      },
      watchTask: true
  },

  unitTest: {
  	src : [
  		'tests/keyLogger/index.html',
  		'tests/keyLogger/test.js',
  		'tests/keyLogger/js/keyLogger.js'
  	]
  }

}
