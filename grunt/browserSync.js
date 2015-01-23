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
    server: {
      baseDir: "./"
    },
    port: 5555,
    minify: false
  }

}
