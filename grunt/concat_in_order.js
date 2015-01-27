path = require('path');
module.exports = {
	options: {
		extractRequired: function(filepath, filecontent) {
			var workingdir = path.normalize(filepath).split(path.sep);
			workingdir.pop();

			var deps = this.getMatches(/\*\s*@depend\s(.*\.js)/g, filecontent);
			deps.forEach(function(dep, i) {
				var dependency = workingdir.concat([dep]);
				deps[i] = path.join.apply(null, dependency);
			});
			return deps;
		},
		extractDeclared: function(filepath) {
			return [filepath];
		},
		onlyConcatRequiredFiles: true
	},
	all: {
		files: {
			'js/mybuild.js': ['js/global/grillo.core.js']
		}
	},
	docs: {
		files: {
			'js/docs.js': 'js/docs/docs.src.js'
		}
	}
};
