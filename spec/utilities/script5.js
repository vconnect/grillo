setTimeout(function(){
	grillo.publish('script5Called', 'I am inside script5.js');
	console.log('script5 setTimeout invoked');
}, 3000);

console.log('in script5.js.');
