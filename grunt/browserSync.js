module.exports = {

  // options: {
  //     server: {
  //         baseDir: "./"
  //     },
  //     watchTask: true
  // }

  docs: {
      src : [
      	'css/docs.css',
      	'js/docs/**/*.js',
      	'docs/*.html'
      ]
  },
  bsFiles: {
    src : ["css/*.css", "./*.html", "js/min/app.min.js"]
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
