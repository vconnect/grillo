modules.exports = {
  desktop: {
      src : [
      	'css/styles.css',
      	'js/min/app.min.js',
      	'./*.html'
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
  		'test/keyLogger/index.html',
  		'test/keyLogger/test.js',
  		'test/keyLogger/js/keyLogger.js'
  	]
  }
}
