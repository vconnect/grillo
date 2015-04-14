module.exports = {
	grillo: {
		files: [{
			expand: true,
			cwd: 'css',
			src: ['css/*.css', '!*.min.css'],
			dest: 'css',
			ext: '.min.css'
		}]
	},
	docs: {
		files: [{
			expand: true,
			cwd: 'css',
			src: ['css/docs.css', '!*.min.css'],
			dest: 'css',
			ext: '.min.css'
		}]
	}
};
