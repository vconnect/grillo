module.exports = {
	docs: {
		files: [{
			expand: true,
			cwd: 'css',
			src: ['*.css', '!*.min.css'],
			dest: 'css',
			ext: '.css'
		}]
	}
};
