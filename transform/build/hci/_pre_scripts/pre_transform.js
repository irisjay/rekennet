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
var fun_loader_ify = function (hint) {
	if (hint) {
		var use = hint_use (hint);
		var bounding_box = use_bounds (use)
		
		var match = use .getAttribute ('transform') .match (/translate\((-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)\)/);
		var x = match [1];
		var y = match [2];
		
		return '<svg viewBox="-20 -20 140 140" ' +
				[] .map .call (hint .attributes, function (attr) {
					return attr .nodeName + '="' + attr .nodeValue + '"'
				}) .join (' ') + ' ' +
				'x="' + x + '" ' +
				'y="' + y + '" ' +
				'width="' + (bounding_box .x_max - bounding_box .x_min) + '" ' +
				'height="' + (bounding_box .y_max - bounding_box .y_min) + '" ' +
			'>' +
				'<g filter="url(#968cf0c5-f88b-458d-afae-646d01b91ab9)" >' +
					'<circle cx="50" cy="0" r="10" transform="rotate(0 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(45 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(90 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(135 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(180 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(225 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(270 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(315 50 50)" />' +
					'<circle loader cx="50" cy="0" r="10" transform="" />' +
				'</g>' +
				'<defs>' +
				    '<filter id="968cf0c5-f88b-458d-afae-646d01b91ab9">' +
						'<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />' +
						'<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo" />' +
						'<feBlend in2="goo" in="SourceGraphic" result="mix" />' +
				    '</filter>' +
				'</defs>' +
			'</svg>'
	}
	else 
		return '<svg viewBox="-20 -20 140 140">' +
				'<g filter="url(#968cf0c5-f88b-458d-afae-646d01b91ab9)" >' +
					'<circle cx="50" cy="0" r="10" transform="rotate(0 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(45 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(90 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(135 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(180 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(225 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(270 50 50)" />' +
					'<circle cx="50" cy="0" r="10" transform="rotate(315 50 50)" />' +
					'<circle loader cx="50" cy="0" r="10" transform="" />' +
				'</g>' +
				'<defs>' +
				    '<filter id="968cf0c5-f88b-458d-afae-646d01b91ab9">' +
						'<feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />' +
						'<feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo" />' +
						'<feBlend in2="goo" in="SourceGraphic" result="mix" />' +
				    '</filter>' +
				'</defs>' +
			'</svg>'
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

var scale_info = function (base, aux_1, aux_2) {
	return _scale_info (
		{
			_: base,
			width: + base .getAttribute ('width'),
			height: + base .getAttribute ('height')
		},
		{
			_: aux_1,
			width: + aux_1 .getAttribute ('width'),
			height: + aux_1 .getAttribute ('height')
		},
		{
			_: aux_2,
			width: + aux_2 .getAttribute ('width'),
			height: + aux_2 .getAttribute ('height')
		})
}

var scale_flux = function (sample_0, sample_1, sample_2) {
	var dx1 = sample_1 .width - sample_0 .width;
	var dx2 = sample_2 .width - sample_0 .width;
	var dy1 = sample_1 .height - sample_0 .height;
	var dy2 = sample_2 .height - sample_0 .height;
	var dv1 = sample_1 ._ - sample_0 ._;
	var dv2 = sample_2 ._ - sample_0 ._;
	
	var x_flux = (dy2 * dv1 - dy1 * dv2) / (dx1 * dy2 - dy1 * dx2)
	var y_flux = (dx1 * dv2 - dx2 * dv1) / (dx1 * dy2 - dy1 * dx2)
	
	return {
		x_flux: x_flux,
		y_flux: y_flux
	};
	//(z1 - z0) = c1 (y1 - y0) + c2 (x1 - x0)
	//(z2 - z0) = c1 (y2 - y0) + c2 (x2 - x0)

	//(z - z0) = c1 (y - y0) + c2 (x - x0)
	/*
	
	
	  x1-x0 y1-y0    c1     z1-z0
	                     =      
	  x2-x0 y2-y0    c2     z2-z0
      
      
      c1         1       y2-y0 y0-y1    z1-z0
          =  ---------
      c2     (       )   x0-x2 x1-x0    z2-z0

	*/
}
var _scaled_val = function (sample_0, sample_1, sample_2) {
	sample_0 ._ = sample_0 ._ .split (/(-?\d+(?:\.\d+)?(?:e-?\d+)?)/) .map (function (v, i) { if (i % 2 === 1) return + v; else return v });
	sample_1 ._ = sample_1 ._ .split (/(-?\d+(?:\.\d+)?(?:e-?\d+)?)/) .map (function (v, i) { if (i % 2 === 1) return + v; else return v });
	sample_2 ._ = sample_2 ._ .split (/(-?\d+(?:\.\d+)?(?:e-?\d+)?)/) .map (function (v, i) { if (i % 2 === 1) return + v; else return v });
	var base_numbers = sample_0 ._ .filter (function (v, i) {
		return i % 2 === 1;
	});
	return base_numbers .reduce (function (sum, next, k) {
		var i = 2 * k + 1;
		if (next === sample_1 ._ [i] && next === sample_2 ._ [i]) {
			return R .adjust (R .concat (R .__, '' + next + sample_0 ._ [i + 1])) (sum .length - 1) (sum)
		}
		else {
			var fluxes = scale_flux ({
					_: next,
					width: sample_0 .width,
					height: sample_0 .height
				}, {
					_: sample_1 ._ [i],
					width: sample_1 .width,
					height: sample_1 .height
				}, {
					_: sample_2 ._ [i],
					width: sample_2 .width,
					height: sample_2 .height
				}
			);
			return sum .concat ([[next, fluxes .x_flux, fluxes .y_flux], sample_0 ._ [i + 1]]);
		}
	}, base_numbers .length ? [sample_0 ._ [0]] : [])
};

var _scale_info = function (sample_0, sample_1, sample_2) {
	return R .merge (
		[sample_0 ._ .attributes]
			.map (native_array)
			.map (R .map (function (attr) {
				var name = attr .nodeName;
				var val = attr .nodeValue;
				var val_1 = sample_1 ._ .getAttribute (name);
				var val_2 = sample_2 ._ .getAttribute (name);
				if (val !== val_1 || val !== val_2) {
					return [name, _scaled_val (
						{
							_: val,
							width: sample_0 .width,
							height: sample_0 .height
						},
						{
							_: val_1,
							width: sample_1 .width,
							height: sample_1 .height
						},
						{
							_: val_2,
							width: sample_2 .width,
							height: sample_2 .height
						}
					)]
				}
			}))
			.map (R .filter (R .identity))
			.map (R .fromPairs)
			.map (R .cond ([
				[R .pipe (R .keys, R .length, R .equals (0), R .not), R .objOf ('scale')],
				[R .T, R .always ({})]
			]))
		[0]
	) ([sample_0 ._ .children]
		.map (native_array)
		.map (R .addIndex (R .map) (function (child, i) {
			return _scale_info ({
					_: child,
					width: sample_0 .width,
					height: sample_0 .height
				}, {
					_: assert ('sample 1 matches') (sample_1 ._ .children [i]),
					width: sample_1 .width,
					height: sample_1 .height
				}, {
					_: assert ('sample 2 matches') (sample_2 ._ .children [i]),
					width: sample_2 .width,
					height: sample_2 .height
				}
			)
		}))
		.map (R .addIndex (R .map) (function (x, i) {
			return [i, x]
		}))
		.map (R .filter (R .pipe (R .prop (1), R .keys, R .length)))
		.map (R .fromPairs)
	[0])
};

var mark_scale = function (info, dom) {
	var dom_ = dom .cloneNode (true);
	[info]
		.map (R .omit (['scale']))
//		.forEach (R .)
	return dom_;
};
