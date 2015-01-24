module.exports = {
	options:{
		style: 'compressed'
	},

	grillo:{
		files:{// remember sass does the concat
			'css/main.css': 'scss/main.scss'
		}
	},
	docs: {
		files: {
			'css/docs.css': 'scss/docs.scss'
		}
	}
}
