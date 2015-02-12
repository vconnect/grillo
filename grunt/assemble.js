module.exports = {
	options: {
		flatten: true,
		assets: './',
		layout: 'default.hbs',
		plugins: ['permalinks'],
		layoutdir: 'layouts',
		ext: '.html'
	},
	docs: {
		options: {
			layout: 'docs/default.hbs',
			data: ['data/docs/**/*.{json,yml}'],
			partials: ['includes/docs/*.hbs']
		},
		src: ['templates/docs/*.hbs'],
		dest: './docs/'
	}
}


/*Take Note*/
// You must have content within all the included files for it to compile.
