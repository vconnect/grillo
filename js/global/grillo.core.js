(function(){
	// The Grillo Framework...
	var grillo = {
		scope:this,
		init:function(config){
			for(comp in this.comps){
				this.init_comp(comp);
			}
		},
		init_comp:function(comp){
			if(this.comps.hasOwnProperty(comp)){
				this.patch(this.comps[comp]);
				return this.comps[comp].init.apply(this.comps[comp], []);
			}
		},
		patch:function(comp){
			// Patch component: Assign component variables
			comp.config = $.extend(true, {}, comp.config, this.config);

			//Provide access to utilities within component to all components
			$.extend(this.utils, comp.utils);

			// Provide access to utilities within component to application
			$.extend(this, comp.utils);

			// Provide access to utility functions in component
			// $.extend(comp, this.utils);
			// comp.o = this.o;
		}
	};
}());

/*
Usage:

grillo.init(); => object

*/
