var R = require ('ramda');
var path = require ('path');
var fs = require ('fs-extra');
var child_process = require ('child_process');

var time = require ('./_util') .time;
var file = require ('./_util') .file;
var write = require ('./_util') .write;
var files = require ('./_util') .files;



var base = require ('./_config') .paths .src;
var ama_cache = require ('./_config') .paths .ama .cache;



var cache_at = function (_path, source) {
	var relative_path = _path .slice (base .length + 1);
	var cache_path = path .join (ama_cache, relative_path);
	if (fs .existsSync (cache_path)) {
		var cache = file (cache_path)
		return cache;
	}
	else {
		var cache = time ('diving ' + relative_path, source);
		
		write (cache_path) (cache);
		
		return cache;
	}
};


var dive = function (ama) {
	return child_process .spawnSync ('bash', ['-c',
		'cat << :EOF// | ' + '\n' +
			ama + '\n' +
		':EOF//' + '\n' +
		'ama'
	]) .stdout .toString ()
};
var probe = function (amas) {
	fs .ensureDirSync (ama_cache);

	return [amas] 
		.map (R .toPairs)
		.map (R .map (R .applySpec ({
			_path: R .prop (0),
			contents: R .prop (1)
		})))
		.map (R .map (function (_) {
			return [_ ._path, cache_at (_ ._path, function () {
				return dive (_ .contents/* pearl */);
			})];
		}))
		.map (R .fromPairs)
	[0];
};
var collect = function (extension) {
	return function (dir) {
		return function (_) {
			return R .merge (_ .plain_files, _ .ama_files);
		} ({
			plain_files: [files (extension) (dir)]
				 .map (R .map (function (_path) {
					return [_path, file (_path)];
				}))
				.map (R .fromPairs)
			[0],
			ama_files: [files (extension + '-ama') (dir)]
				.map (R .map (function (_path/* of file*/) {
					return [_path .slice (0, - '-ama' .length), file (_path)] 
				}))
				.map (R .fromPairs)
				.map (probe)
			[0]
		})
	};
};

module .exports = {
	dive: dive,
	probe: probe,
	collect: collect
};
