var path = require ('path');
var serve = function (x) {
	return [x .cloneNode (true)]
		.map (R .tap (function (x) {
			x .setAttribute ('page', '');
		}))
		.map (R .tap (function (x) {
			//when debugging
			/*[] .forEach .call (x .querySelectorAll ('[example]'), function (_) {
				_ .outerHTML = '';
			})*/
		}))
	[0];
}
var frag = function (html) {
	var container = document .createElement ('template');
	container .innerHTML = html;
	return container .content;
}; 
var svg_ = function (el) {
	while (el .tagName .toUpperCase () !== 'SVG') {
		el = el .parentElement;
	} 
	return el;
};
var clip_ = function (x) {
	var url = x .getAttribute ('clip-path');
	var id = url .match (/url\((.*)\)/) [1];
	return svg_ (x) .querySelector (id);
};
var path_ = function (x) {
	return x .querySelector ('path');
};
var hint_ = function (x) {
	return x .querySelector ('#hint');
};
var hint_bounds = function (hint) {
	return bound_rectangle (hint_path (hint));
};
var hint_path = function (hint) {
	return use_path (hint_use (hint))
};
var hint_use = function (hint) {
	return hint .querySelector ('use');
};
var use_bounds = function (use) {
	return bound_rectangle (use_path (use))
};
var use_path = function (use) {
	var id = use .getAttribute ('xlink:href') || use .getAttribute ('href');//console.log(id);
	return svg_ (use) .querySelector (id);
};
var bound_rectangle = function (path) {
	var d = path .getAttribute ('d');
	var path_segments = require ('svg-path-parser') .makeAbsolute (require ('svg-path-parser') (d));
	var path_points = path_segments .map (function (segment) {
			return {
				x: segment .x,
				y: segment .y
			}
		});
	var point_xs = path_points .map (function (path) { return path .x })
	var point_ys = path_points .map (function (path) { return path .y })
	return {
		x_min: Math .min .apply (null, point_xs),
		x_max: Math .max .apply (null, point_xs),
		y_min: Math .min .apply (null, point_ys),
		y_max: Math .max .apply (null, point_ys),
	}
};
var input_ify = function (hint) {
	var use = hint_use (hint .querySelector ('g'));
	var bounding_box = use_bounds (use)
	
	return  '<rect ' +
				'transform="' + use .getAttribute ('transform') + '" ' +
				'width="' + (bounding_box .x_max - bounding_box .x_min) + '" ' +
				'height="' + (bounding_box .y_max - bounding_box .y_min) + '" ' +
				'fill-opacity="0.001"' +
			'>' +
				'<animate attributeName="fill" from="black" to="blue" dur="1s" repeatCount="indefinite" />' +
			'</rect>' +
			'<foreignObject ' +
				'style="' + hint .getAttribute ('style')+ '; display: block;" ' +
				'transform="' + use .getAttribute ('transform') + '" ' +
				'width="' + (bounding_box .x_max - bounding_box .x_min) + '" ' +
				'height="' + (bounding_box .y_max - bounding_box .y_min) + '" ' +
			'>' +
				'<overflow-clip ' +
					'style="' + 
						'padding: 0;' +
						'background: transparent;' + 
						'width: 100%;' +
						'height: 100%;' + 
						'overflow: hidden;' + 
						'z-index: 9999;' + 
						'display: flex;' + 
						'flex-direction: column;' +
						'align-content: space-around;' +
				'">' +
					'<input ' +
						([] .filter .call (hint .attributes, function (attr) { return attr .nodeName !== 'style' })
							.map (function (attr) {
								return attr .nodeName + '="' + attr .nodeValue + '"'
							}
						) .join (' ')) + ' ' +
						'style="' +
							'outline: none;' + 
							'border: none;' + 
							'padding: 0px;' + 
							'margin: 0px;' + 
							'display: block;' +
							'background: transparent;' +
							'width: 1e+07vw;' + 
							'-webkit-appearance: none;' +
					'">' +
				'</overflow-clip>' +
			'</foreignObject>';
};
var text_ify = function (hint, text) {
	text = text || '';
	
	var use = hint_use (hint);
	var bounding_box = use_bounds (use)
	
	return '<foreignObject ' +
		([] .map .call (
			hint .attributes,
			function (attr) {
				return attr .nodeName + '="' + attr .nodeValue + '"'
			}
		) .join (' ')) + ' ' +
		'transform="' + use .getAttribute ('transform') + '" ' +
		'width="' + (bounding_box .x_max - bounding_box .x_min) + '" ' +
		'height="' + (bounding_box .y_max - bounding_box .y_min) + '" ' +
	'>' +
		'<positioner text style="' + (hint .getAttribute ('positioner-style') || '') + '">' +
			text .replace (/&/g, "&amp;") .replace (/</g, "&lt;") .replace (/>/g, "&gt;") +
		'</positioner>' +
	'</foreignObject>';
};
var image_ify = function (hint, src) {
	var use = hint_use (hint);
	var bounding_box = use_bounds (use)
	
	return '<foreignObject ' +
		([] .filter .call (hint .attributes, function (attr) { return attr .nodeName !== 'style' })
			.map (function (attr) {
				return attr .nodeName + '="' + attr .nodeValue + '"'
			}
		) .join (' ')) + ' ' +
		'transform="' + use .getAttribute ('transform') + '" ' +
		'width="' + (bounding_box .x_max - bounding_box .x_min) + '" ' +
		'height="' + (bounding_box .y_max - bounding_box .y_min) + '" ' +
	'>' +
		'<positioner style="' + (hint .getAttribute ('positioner-style') || '') + '">' +
			(src ?
				'<img src="' + src + '" style="' + (hint .getAttribute ('style') || '') + '">' :
				'<img style="' + (hint .getAttribute ('style') || '') + '">'
			) +
		'</positioner>' +
	'</foreignObject>';
}
var fulfill_scroll = function (scroll) {
	var hinted = scroll .parentElement;
	
	var use = hint_use (scroll);
	var transform = use .getAttribute ('transform');
	var bounding_box = use_bounds (use);
	if (transform && transform .startsWith ('translate(')) {
		var translation = transform .slice ('translate(' .length, transform .indexOf (')'));
		var numbers = translation .split (' ') .map (function (x) {
			return +x;
		})
		bounding_box .x_min += numbers [0];
		bounding_box .x_max += numbers [0];
		bounding_box .y_min += numbers [1];
		bounding_box .y_max += numbers [1];
	}
	
	scroll .outerHTML = '';
	
	hinted .setAttribute ('scroll-x-min', bounding_box .x_min);
	hinted .setAttribute ('scroll-x-max', bounding_box .x_max);
	hinted .setAttribute ('scroll-y-min', bounding_box .y_min);
	hinted .setAttribute ('scroll-y-max', bounding_box .y_max);
};

var recitify = function (dom) {
	[] .forEach .call (dom .querySelectorAll ('[id*="/"]'), function (node) {
		var id = node .getAttribute ('id');
		var parts = id .split (' ');
		if (parts [0] [0] !== '/') {
			node .setAttribute ('id', parts [0]);
			var attribute_string = parts .slice (1) .join (' ');
		}
		else {
			var attribute_string = id;
		}
		
		var attributes = [];
		
		while (attribute_string) {
			var next_attribute = /^\/([^"/ =]+)(?:=([^"/ ]+)|="([^"/]+)")?/ .exec (attribute_string);
			if (! next_attribute)
				throw new Error ('invalid attribute string ' + id);
			else {
				var name = next_attribute [1];
				var value = next_attribute [2] || next_attribute [3] || '';
				node .setAttribute (name, value);
				attribute_string = attribute_string .slice (next_attribute [0] .length);
				if (attribute_string [0] === ' ')
					attribute_string = attribute_string .slice (1);
			}
		}
	})
}
var uniqify = function (dom) {
	var prefix = 'x-' + require ('uuid/v4') () + '-';
	var defs = dom .querySelector ('defs');
	var ids = [] .map .call (defs .children, function (def) {
		return def .getAttribute ('id');
	});
	[] .forEach .call (defs .children, function (def) {
		return def .setAttribute ('id', prefix + def .getAttribute ('id'));
	});
	walk_dom (dom, function (node) {
		[] .forEach .call (node .attributes, function (attribute) {
			ids .forEach (function (id) {
				if (attribute .nodeValue .includes ('#' + id))
					node .setAttribute (
						attribute .nodeName,
						attribute .nodeValue .split ('#' + id) .join ('#' + prefix + id)
					)
			})
		})
	})
}

var exemplify = function (instances, processing) {
	var list = [] .slice .call (instances) .reverse ();
	var x = list [0];
	if (processing && ! processing .apply) processing [0] (list);
	list .slice (1) .forEach (function (u) {
		u .outerHTML = '';
	})
	if (processing && ! processing .apply) processing [1] (x);
	else if (processing) processing (x);
	/*[] .forEach .call (x .querySelectorAll ('[example]'), function (y) {
		y .outerHTML = '';
	});*/
	return x;
}

/*var isolated_step = function (i) {
	return function (dom, selector, depth) {
		if (depth === undefined)
			depth = dom_depth (dom);
		if (depth === 0)
			return null;
		else {
			
		}
	}
}

var dom_depth = function (x, depth) {
	depth = depth || 5;
	var max = Math .Infinity;
	var min = 0;
	while (max !== min) {
		if (max === Math .Infinity) depth = depth * 2;
		else depth = Math .ceiling ((max + min) / 2);
		var works = x .querySelector ((new Array (depth)) .fill ('*') .join ('>'));
		if (works) min = depth;
		else max = depth - 1;
	}
	return max;
}*/

var y_translation = function (g) {
	return + hint_use (g) .getAttribute ('transform') .match (/translate\(-?\d+ (-?\d+)\)/) [1]
}
var x_translation = function (g) {
	return + hint_use (g) .getAttribute ('transform') .match (/translate\((-?\d+) -?\d+\)/) [1]
}
var walk_dom = function (node, func) {
	var continue_ = (func (node) !== false);
	node = node .firstElementChild;
	while (continue_ && node) {
		walk_dom (node, func);
		node = node .nextElementSibling;
	}
};

var native_array = function (x) {
	return [] .slice .call (x);
};
var assert = function (msg) {
	return function (x) {
		if (! x)
			throw new Error (msg + ' is false')
		else
			return x;
	}
};

var node_children_collect = function (samples, info_collect) {
	return [samples [0] .children]
		.map (native_array)
		.map (R .addIndex (R .map) (info_collect))
		.map (R .addIndex (R .map) (function (x, i) {
			return [i, x]
		}))
		.map (R .filter (R .pipe (R .prop (1), R .keys, R .length)))
		.map (R .fromPairs)
	[0]
};

var scale_flux = function (x) {
	var dx1 = x [1] .width - x [0] .width;
	var dx2 = x [2] .width - x [0] .width;
	var dy1 = x [1] .height - x [0] .height;
	var dy2 = x [2] .height - x [0] .height;
	var dv1 = x [1] ._ - x [0] ._;
	var dv2 = x [2] ._ - x [0] ._;
	
	var x_flux = (dy2 * dv1 - dy1 * dv2) / (dx1 * dy2 - dy1 * dx2)
	var y_flux = (dx1 * dv2 - dx2 * dv1) / (dx1 * dy2 - dy1 * dx2)
	
	return {
		x_flux: x_flux,
		y_flux: y_flux
	};
}

var val_scale_info = function (samples) {
	var number_breakdowns = samples .map (number_breakdown_from_val);
	var base_numbers = number_breakdowns [0] .filter (function (v, i) {
		return i % 2 === 1;
	});
	if (! base_numbers .length)
		return []
	else
		return base_numbers .reduce (function (sum, next, k) {
			var i = 2 * k + 1;
			if (next === number_breakdowns [1] [i] && next === number_breakdowns [2] [i]) {
				return R .adjust (
					R .concat (R .__, '' + next + number_breakdowns [0] [i + 1])
				) (sum .length - 1) (sum)
			}
			else {
				var fluxes = scale_flux (samples .map (function (sample, l) {
					return R .merge (sample, {
						_: number_breakdowns [l] [i]
					})
				}));
				return R .concat (sum, [[next, fluxes .x_flux, fluxes .y_flux], number_breakdowns [0] [i + 1]]);
			}
		}, [number_breakdowns [0] [0]])
};
	var val_string_break = function (x) {
		return x
			.split (/(-?\d+(?:\.\d+)?(?:e-?\d+)?)/)
			.map (function (v, i) {
				if (i % 2 === 1) return + v; else return v
			});
	};
	var number_breakdown_from_val = R .pipe (R .prop ('_'), val_string_break);

var element_scale_info = function (samples) {
	return [samples [0] ._ .attributes]
		.map (native_array)
		.map (R .map (R .prop ('nodeName')))
		.map (R .chain (function (name) {
			var vals = samples .map (R .evolve ({
				_: function (_) {
					return _ .getAttribute (name);
				}
			}));
			if (vals [0] ._ == vals [1] ._ && vals [1] ._ == vals [2] ._) 
				return [];
			else
				return [[name, val_scale_info (vals)]]
		}))
		.map (R .fromPairs)
	[0]
};

var node_children_scale_info = function (samples) {
	return node_children_collect (samples .map (R .prop ('_')), function (child, i) {
		return node_scale_info (samples .map (R .evolve ({
			_: R .pipe (R .prop ('children'), R .nth (i))
		})))
	});
};

var node_scale_info = function (samples) {
	return R .merge (
		node_children_scale_info (samples),
		[element_scale_info (samples)]
			.map (R .cond ([
				[R .pipe (R .keys, R .length, R .equals (0), R .not),
					 R .objOf ('scale')
				]
			]))
		[0]
	)
};

/*
var def_node_scale_info = function (samples) {
	return node_children_collect (samples, function (child) {
		var def_id = child .getAttribute ('id');
		return node_scale_info ([
			{ _: child, width: samples [0] .width, height: samples [0] .height },
			// HACK: sometimes stretched svgs have different connections, so || child after get selector
			{ _: assert ('sample 1 matches') (samples [1] ._ .querySelector ('#' + def_id) || child), width: samples [1] .width, height: samples [1] .height },
			{ _: assert ('sample 2 matches') (samples [2] ._ .querySelector ('#' + def_id) || child), width: samples [2] .width, height: samples [2] .height }
		])
	});
};

var defs_scale_info = function (samples) {
	return R .merge (
		def_node_scale_info (samples),
		[element_scale_info (samples)]
			.map (R .cond ([
				[R .pipe (R .keys, R .length, R .equals (0), R .not),
					 R .objOf ('scale')
				]
			]))
		[0]
	)
};
*/

var id_by_attr = function (name) {
	return R .pipe (
		function (x) {
			return x .getAttribute (name);
		},
		(name === 'xlink:href') && R .match (/^(#[^]+)$/)
			|| (name === 'fill') && R .match (/^url\((#[^)]+)\)$/),
		R .nth (1)
	)
};

var element_connection_info = function (samples) {
	return [samples [0] .attributes]
		.map (native_array)
		.map (R .map (R .prop ('nodeName')))
		.map (R .filter (R .contains (R .__, [ 'xlink:href', 'fill' ])))
		.map (R .map (function (name) {
			return samples .map (id_by_attr (name));
		}))
		.map (R .chain (function (ids) {
			if (! R .all (R .identity) (ids))
				return [];
			else
				return [ids];
		}))
	[0]
};

var node_children_connection_info = function (samples) {
	return node_children_collect (samples, function (child, i) {
		return node_connection_info (samples
			.map (R .pipe (R .prop ('children'), R .nth (i)))
			.map (R .tap (function (x, i) {
				assert ('sample ' + i + ' connection matches') (x);
			}))
		)
	})
};

var node_connection_info = function (samples) {
	return R .merge (
		node_children_connection_info (samples),
		[element_connection_info (samples)]
			.map (R .cond ([
				[R .pipe (R .keys, R .length, R .equals (0), R .not),
					 R .objOf ('connection')
				]
			]))
		[0]
	); 
};

var merge_classes = function (classes) {
	if (! classes .length)
		return classes;
	else
		return [classes [0]] 
			.map (R .keys) 
			//merge classes by merge_index
			.map (R .reduce (function (classes, merge_index) {
				//merge reduced classes with next class by merge_index
				return [classes] .map (R .reduce (function (classes, next) {
					return R .concat ( 
						//irrelvant classes
						[classes] .map (R .filter (function (class_) { 
							return ! R .intersection (class_ [merge_index], next [merge_index]) .length
						})) [0],
						//classes to merge
						[[classes]
							.map (R .filter (function (class_) {
								return R .intersection (class_ [merge_index], next [merge_index]) .length
							}))
							.map (function (x) { 
								return ! x .length ?
									next
								: 
									[x [0]]
										.map (R .keys)
										.map (R .map (function (q) {
											return [R .concat (x, [next])]
												.map (R .map (R .nth (q)))
												.map (R .reduce (R .concat, []))
												.map (R .uniq)
											[0]
										}))
									[0]
							})
						[0]]
					)
				}, [])) [0];
			}, classes))
		[0];
};

var connection_to_classes = function (x) {
	var node_classes = ! x .connection ?
			[]
		:
			 [x .connection]
				.map (R .reduce (function (classes, next) {
					return R .identity (function (_) {
						return merge_classes (R .concat (classes, [_ .next_as_class]))
					} ({
						next_as_class: next .map (function (x) { return [x]; })
					})) 
				}, []))
			[0];
	return [x]
		.map (R .omit (['connection']))
		.map (R .values)
		.map (R .map (connection_to_classes)) 
		.map (R .reduce (function (connections, next) {
			return merge_classes (R .concat (connections, next))
		}, node_classes))
	[0]
};

var svg_with_dimensions = function (x) {
	return { _: x, width: + x .getAttribute ('width'), height: + x .getAttribute ('height') }
};

var svg_structure = function (svg) {
	var undefed = svg .cloneNode (true);
	[undefed .querySelectorAll ('defs')]
		.map (native_array)
		.forEach (R .forEach (function (defs) {
			defs .parentNode .removeChild (defs);
		}));
	return undefed;	
};

var reconnected_svg = function (svgs, connection_classes) {
	var reconnected_structures = svgs .map (function (x, i) {
		return [svg_structure (x)]
			.map (R .tap (function (x) {
				[x .querySelectorAll ('[*|href]')]
					.map (native_array)
					.forEach (R .forEach (function (x) {
						var id = id_by_attr ('xlink:href') (x);

						if (id) {
							x .setAttribute ('xlink:href', R .find (R .pipe (R .nth (i), R .contains (id)), connection_classes) [0] [0]);
						}
					}));
				[x .querySelectorAll ('[*|fill]')]
					.map (native_array)
					.forEach (R .forEach (function (x) {
						var id = id_by_attr ('fill') (x);

						if (id) {
							x .setAttribute ('fill', 'url(' + R .find (R .pipe (R .nth (i), R .contains (id)), connection_classes) [0] [0] + ')');
						}
					}));
			}))
		[0];
	});
	var reconnected_defs = svgs .map (function (x, i) {
		var defs = x .querySelector ('defs') .cloneNode (true);
		var canon_defs = [connection_classes]
			.map (R .map (function (q) {
				return { canon_id: q [0] [0], represent: defs .querySelector (q [i] [0]) };
			}))
		[0];

		canon_defs .forEach (function (_) {
			_ .represent .setAttribute ('id', R .tail (_ .canon_id));
		});
		[canon_defs]
			.map (R .sort (function (a, b) {
				return a .canon_id > b .canon_id && +1
					|| a .canon_id === b .canon_id && 0
					|| a .canon_id < b .canon_id && -1
			}))
			.map (R .map (R .prop ('represent')))
			.forEach (R .forEach (function (_) {
				defs .appendChild (_);
			}));
		[defs .children]
			.map (native_array)
			.map (R .reject (R .contains (R .__, canon_defs .map (R .prop ('represent')))))
			.forEach (R .forEach (function (_) {
				defs .removeChild (_);
			}));
		return defs;
	});
	var full_connections = merge_classes (R .concat (connection_classes, node_classes (reconnected_defs)));
	reconnected_defs .forEach (function (x, i) {
		[x .querySelectorAll ('[*|href]')]
			.map (native_array)
			.forEach (R .forEach (function (x) {
				var id = id_by_attr ('xlink:href') (x);

				if (id) {
					x .setAttribute ('xlink:href', R .find (R .pipe (R .nth (i), R .contains (id)), full_connections) [0] [0]);
				}
			}));
		[x .querySelectorAll ('[*|fill]')]
			.map (native_array)
			.forEach (R .forEach (function (x) {
				var id = id_by_attr ('fill') (x);

				if (id) {
					x .setAttribute ('fill', 'url(' + R .find (R .pipe (R .nth (i), R .contains (id)), full_connections) [0] [0] + ')');
				}
			}));
	});
	return reconnected_structures .map (function (x, i) {
		x .appendChild (reconnected_defs [i]);
		return x;
	})
};

var node_classes = R .pipe (
	node_connection_info,
	connection_to_classes
);

var svg_classes = R .pipe (
	R .map (svg_structure),
	node_classes
);

var canonize_svg = function (svgs) {
	return reconnected_svg (svgs, svg_classes (svgs))
};

var svg_scale_info = function (svgs) {
	var canonicals = canonize_svg (svgs);
	return {
		svg: canonicals [0],
		scale: node_scale_info (canonicals .map (svg_with_dimensions))
	};
};

/*
var scale_using = function (scale_info, width, height) {
	return function (dom) {
		
	};
};
*/
