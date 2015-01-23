modules.exports = {
  // desktop: {
  //     src : [
  //     	'css/styles.css',
  //     	'js/min/app.min.js',
  //     	'./*.html'
  //     ]
  // },

  // options: {
  //     server: {
  //         baseDir: "./"
  //     },
  //     watchTask: true
  // }

  bsFiles: {
    src : ["css/*.css", "./*.html", "js/min/app.min.js"]
  },

  options: {
<<<<<<< HEAD
    server: {
      baseDir: "./"
    },
    port: 5555,
    minify: false
=======
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
>>>>>>> 6066ca847a5fe216523c6451a2685bd99a60e975
  }

}
