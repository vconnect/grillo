//Simple key logger
function KeyLogger( target ) {
	this.target = target;
	this.log = [];

	var that = this;
	this.target.off( "keydown" ).on( "keydown", function( event ) {
	   that.log.push( event.keyCode );
	});
}
