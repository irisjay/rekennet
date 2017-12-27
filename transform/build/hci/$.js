//constants
var R = require ('ramda');
var path = require ('path');

var $_src = require ('./_config') .paths .src;
var $_dist = require ('./_config') .paths .dist;
var primary_src = require ('./_config') .paths .primary .src;
var primary_dist = require ('./_config') .paths .primary .dist;
var uis_src = require ('./_config') .paths .uis .src;
var uis_dist = require ('./_config') .paths .uis .dist;
var uis_hydrators_dist = require ('./_config') .paths .uis .hydrators_dist;
var scripts_src = require ('./_config') .paths .scripts .src;
var scripts_dist = require ('./_config') .paths .scripts .dist;
var tags_src = require ('./_config') .paths .tags .src;
var tags_dist = require ('./_config') .paths .tags .dist;
var tags_strs_dist = require ('./_config') .paths .tags .strs_dist;
var styles_src = require ('./_config') .paths .styles .src;
var styles_dist = require ('./_config') .paths .styles .dist;
var assets_src = require ('./_config') .paths .assets .src;
var assets_dist = require ('./_config') .paths .assets .dist;


//utils
var fs = require ('fs-extra');
var child_process = require ('child_process');
var time = require ('./_util') .time;
var file = require ('./_util') .file;
var files = require ('./_util') .files;
var write = require ('./_util') .write;
var prepare = require ('./_util') .prepare;

var amas = require ('./_amas');
var riot_tags = require ('./_riot');
var uis = require ('./_uis');
var styles = require ('./_styles');
					
					
					


//build
time ('build', function () {
	fs .removeSync ($_dist);
	[
		primary_dist,
		uis_dist,
		uis_hydrators_dist,
		scripts_dist,
		tags_dist,
		tags_strs_dist,
		styles_dist,
		assets_dist
	]
		.forEach (prepare);

	fs .copySync (primary_src, primary_dist);
	
	[amas .collect ('.js') (uis_src)] 
		.map (R .toPairs)
		.map (R .map (R .applySpec ({
			_path: R .prop (0),
			contents: R .prop (1)
		})))
		.map (R .map (function (_) {
			var relative_path = _ ._path .slice (uis_src .length + 1);
			var name =	R .head (
							relative_path
								.split ('/') .join ('_')
								.split ('.')
						);
										
			return time ('preprocessing ' + name, function () {
				return uis .process (_ .contents);
			})
		}))
		.map (R .map (function (src) {
		    return src + ';\n'
		}))
		.map (R .reduce (function (sum, next) {
			 return sum + next; 
		}, ''))
		.forEach (function (_) {
			write (uis_dist) (_);
			write (uis_hydrators_dist) (time ('serializing hydrators', uis .hydration));
		});

	[amas .collect ('.ejs') (tags_src)]
		.map (R .toPairs)
		.map (R .map (R .applySpec ({
			_path: R .prop (0),
			contents: R .prop (1)
		})))
		.map (R .map (function (_) {
			var tag_relative_path = _ ._path .slice (tags_src .length + 1);
			var tag_name =	R .head (
								tag_relative_path
									.split ('/') .join ('-')
									.split ('.')
							);
			return R .merge (_, {
				name: tag_name
			});
		}))
		.map (R .tap (R .forEach (function (_) {
			R .uniq ([_ .name, R .last (_ .name .split ('-'))])
				.forEach (function (name) {
					if (! riot_tags .name_resolution [name]) riot_tags .name_resolution [name] = [];
					riot_tags .name_resolution [name] .push (path)
				})
		})))
		.map (R .map (function (_) {
			return time ('parsing ' + _ .name, function () {
				return riot_tags .parse (_ .contents, _ .name);
			})
		}))
		//.map (R .values)
		.map (R .reduce (function (sum, next) { return sum + next; }, ''))
		.map (function (x) {
			return time ('compiling', function () {
				return riot_tags .compile (x);
			})
		})
		.map (function (x) {
			return time ('stripping long strings', function () {
				return riot_tags .strip_long_strings (x);
			})
		})
		.forEach (function (riot_scripts) {
			var _ = riot_scripts .src;
			var strings = riot_scripts .strs;
			
			write (tags_dist) (_);
			write (tags_strs_dist) (strings);
		});

	[
		function (_) {
			return R .concat (_ .scss_seeds, _ .riot_style_seeds);
		} ({
			scss_seeds: [R .merge (amas .collect ('.css') (styles_src), amas .collect ('.scss') (styles_src))] 
				.map (R .toPairs)
				.map (R .map (R .applySpec ({
					_path: R .prop (0),
					contents: R .prop (1)
				})))
				.map (R .map (function (_) {
					return {
						names: [R .head (R .last (_ ._path .split ('/')) .split ('.'))],
						path: _ ._path .slice (styles_src .length + 1),
						dependencies: [],
						metastyles: _ .contents
					}
				})) [0],
			riot_style_seeds: [riot_tags .metastyles_resolution] 
				.map (R .keys)
				.map (R .map (function (name) {
					return {
						names: R .uniq ([name, R .last (name .split ('-'))]),
						path: name,
						dependencies: [],
						metastyles: [(riot_tags .metastyles_resolution [name] || []) .join ('\n')]
							/* implements custom selector */
							.map (function (def) {
								return def .replace (/-> ?{([^}]+)}/g, ' $1');//:not(& $1 $1)');
							})
							.map (function (def) {
								/*return	tag + ',[data-is="' + tag + '"] {' + '\n' +*/
								return	name + ' {' + '\n' +
											def + '\n' +
										'}';
							}) [0]
					};
				})) [0]
		})
	]
		.map (function (build_nodes) {
	        var tree = styles .weave (build_nodes);
	
			styles .invalidate ()
			var answer = styles .grow (tree);
			styles .clean ();
	
			return answer 
		})
		.map (R .chain (function (branch) {
			//console .log ('debug: ' + JSON .stringify (R .omit (['styles', 'metastyles']) (branch), null, 4));
			return branch .path === '*' ?
				[branch .styles]
			:
				[];
		}))
		.map (R .tap (function (branches) {
			if (branches .length !== 1)
				throw 'can\'t find answer' + '\n\n' + '\n' +
					'branches length is ' + branches .length  
		}))
		.map (R .head)
		.forEach (write (styles_dist));

	[amas .collect ('.js') (scripts_src)] 
		.map (R .toPairs)
		.map (R .map (R .applySpec ({
			_path: R .prop (0),
			contents: R .prop (1)
		})))
		.forEach (R .forEach (function (_) {
			var name = R .last (_ ._path .split ('/'));
			var dest_path = path .join (scripts_dist, name);
			write (dest_path) (_ .contents);
		}));

	files ('') (assets_src)
		.forEach (function (_path/* of file*/) {
			var name = _path .slice (assets_src .length + 1);
			var dest_path = path .join (assets_dist, name);
			fs .ensureDirSync (dest_path .split ('/') .slice (0, -1) .join ('/'));
			//prepare (dest_path);
			fs .symlinkSync (_path, dest_path);
		});

});
