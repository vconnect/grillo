modules.exports = {
	options:{
		style: 'compressed'
	},

	grillo:{
		files:{// remember sass does the concat
			'css/main.css': 'scss/main.scss'
		}
	}
}
