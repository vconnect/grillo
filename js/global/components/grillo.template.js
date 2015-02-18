grillo.addUtility('template', function(scope){
    return function(templateString, data){
      /* Nano Templates (Tomasz Mazur, Jacek Becela) */
			return templateString.replace(/\{([\w\.]*)\}/g, function(str, key) {
				var keys = key.split("."), v = data[keys.shift()];
				for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
				return (typeof v !== "undefined" && v !== null) ? v : "";
			});
    };
});
