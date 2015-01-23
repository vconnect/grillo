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
  }
}
