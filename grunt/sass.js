module.exports = {
	options:{
		style: 'compressed',
		sourceMap: true
	},

	grillo:{
		files:{// remember sass does the concat
			'css/grillo.css': 'scss/grillo.scss'
		}
	},
	docs: {
		files: {
			'css/docs.css': 'scss/docs.scss'
		}
	}
}
