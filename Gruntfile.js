module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
  	loadGruntTasks: {
      pattern: ['*','!load-grunt-config'],
      config: require('./package.json'),
      scope: 'devDependencies'
  	}
	});
};
