var R = require ('ramda');
var amas = require ('./amas');

var pre_scripts = require ('./config') .pre .scripts;
var scripts_src = require ('./config') .paths .scripts .src;


module .exports = [pre_scripts]
	.map (R .chain (function (name) {
		return [amas .collect (name) (scripts_src)] 
			.map (R .values) 
			.map (R .slice (-1, Infinity)) 
		[0];
	}))
	.map (R .map (function (src) {
	    return src + ';\n'
	}))
	.map (R .reduce (function (sum, next) {
		 return sum + next; 
	}, ''))
[0];
