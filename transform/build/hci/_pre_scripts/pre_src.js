var frames_src = require ('./_config') .paths .frames .src;
var file = require ('./_util') .file;

var frame_string = function (_) {
	return file (path .join (frames_src, _ + '.svg'));
}					


var frame = function (x) {
	x = /*time ('parse ' + x, () =>*/ frag (frame_string (x))/*)*/ .children [0];
	recitify (x);
	//uniqify (x);
	//console .log (x .outerHTML)
	return x;
}
var piece = function (x) {
	return frag (file (path .join (frames_src, x)))/*)*/ .children [0];
}
