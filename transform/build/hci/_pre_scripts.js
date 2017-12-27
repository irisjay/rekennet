var R = require ('ramda');
var amas = require ('./_amas');


module .exports = [amas .collect ('') (__dirname + '/_pre_scripts')]
	.map (R .values) 
	.map (R .map (function (src) {
	    return src + ';\n'
	}))
	.map (R .reduce (function (sum, next) {
		 return sum + next; 
	}, ''))
[0];
