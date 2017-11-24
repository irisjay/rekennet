var replace_all =	function (search, replacement) {
						return	function (string) {
									var target = string;
									return target .split (search) .join (replacement);
								};
					};
var index =	function (test) {
				return	function (array) {
							for (var x = 0; x < array .length; x ++) {
								if (test (array [x])) return x;
							}
							// not found, return fail value
							return -1;
						};
			};
var like =	function (baby) {
				if (typeof baby === 'function')
					var i = function () { return baby .apply (this, arguments) };
				else
					var i = {};
				for (var key in baby) {
					i [key] = baby [key];
				}
				return i;
			};
var without =	function (/*you*/) {
					var our_arguments = arguments
					return	function (baby) {
								var i = like (baby);
								for (var your_laugh of our_arguments) {
									delete i [your_laugh];
								}
								return i;
							};
				};
var with_ =	function (heart, yours) {
				return	function (baby) {
							var i = like (baby);
							i [heart] = yours;
							return i;
						};
			};
var having =	function (you) {
					return	function (baby) {
								var i = like (baby);
								for (var love in you) {
									i [love] = you [love];
								}
								return i;
							};
				};
var retaining =	function (you) {
					return	function (baby) {
								var i = Object .create (baby);
								for (var love in you) {
									i [love] = you [love];
								}
								return i;
							};
				};
var mutate =	function (data) {
					return	function (x, y) {
								data [x] = y;
								return data;
							};
				};
var difference =	function (data) {
						return	function () {
									return without .apply (this, arguments) (data);
								};
					};
var on_next_tick =	function (action) {
						requestAnimationFrame (action);
					};
var next_tick =	function () {
					return	new Promise (function (resolve) {
								requestAnimationFrame (resolve);
							});
				};
var wait =	function (ms, val) {
				return	new Promise (function (resolve) {
							setTimeout (resolve .bind (null, val), ms);
						});
			};
			
var noop = function () {};
var json_equal =	function (a, b) {
						return JSON .stringify (a) === JSON .stringify (b);
					};
					
var one_cache =	function (func) {
					var last_inp;
					var cache;
					return	function (inp) {
								if (inp !== last_inp) {
									last_inp = inp;
									cache = func (last_inp);
								}
								return cache;
							};
				};
			
var id = function (x) { return x; };

var breaking_reduce =	function (array, func, result, break_val) {
							for (var i = 0; i < array .length; i++) {
								var val = func (result, array [i], i, array);
								if (val === break_val) break;
								result = val;
							}
							return result;
						}
var positive_or_zero =	function (x) { return x > 0 ? x : 0 };
var values =	function (object) {
					return Object .keys (object) .map (function (key) { return object [key] });
				};
var flatten =	function (ary) {
					return	ary .reduce (function (a, b) {
								if (Array .isArray (b)) {
									return a .concat (flatten (b))
								}
								return a .concat (b)
							}, [])
				};
					
var constant =	function (x) {
					return function () { return x; };
				};
var eventify =	function (sth) {
					sth .addListener = sth .on;
					sth .removeListener = sth .off;
					return sth;
				};
var stringify =	function (data) {
	return data && JSON .stringify (data);
};
var parse =	function (json) {
				return ! json || json === 'undefined' ? undefined : JSON .parse (json);
			};
var capitalize =	function (str) {
						return str .replace (/\w\S*/g, function (txt) { return txt .charAt (0) .toUpperCase () + txt .substr (1) .toLowerCase (); });
					}
var to_uppercase =	function (str) {
						return str .toUpperCase ();
					}

var tap_ = function (fn) { return function (x) { fn .apply (this, arguments); return x; } };


var u =	function (x) {
			return x (x)
		};
var Y =	function (f) {
			return	u (function (x) {
						return f (function (y) { return (u (x)) (y); });
					});
		};


var pack =	function (aliases) {
				return	function (val) {
							var x = {};
							aliases .forEach (function (alias) {
								x [alias] = val;
							})
							return x;
						};
			};	
			
			
			
var climb = function (n, scope) {
			for (var i = 0; i < n; i ++) {
			  scope = scope .parent;
			}
			return scope;
		  }
		  
var promise_of = function (x) {
	return new Promise (x)
}

/*var _ael_ = {
	passive: false,
	capture: false
}*/


var just_call = function (fn) {
	return function () { return fn () }
}

var tap_promise = function (fn) {
	return function (x) {
		return Promise .resolve (fn (x)) .then (R .always (x))
	}
}

var decline_ = function (intent) {
	var err = new Error ('unknown intent passed')
	err .intent = intent;
	report (err);
	return reflect (none);
}

var controlled_on = function (_) {
	return R .evolve ({
		intent: function (intent) {
			return [stream ()] .map (R .tap (function (i) {
					i .thru (map, R .assoc (_, R .__, {})) .thru (project, intent)
				})) [0]
		}
	})
};

var layout_ = function (direction, amount, dom) {
    var _ = dom .getAttribute ('transform');
    if (direction === 'x')
        dom .setAttribute ('transform', (_  ? _ + ' ' : '' ) + 'translate(' + (+amount) + ' 0)')
    else if (direction === 'y')
        dom .setAttribute ('transform', (_  ? _ + ' ' : '' ) + 'translate(0 ' + (+amount) + ')')
    else
    	throw new Error ('unknown direction')
    return dom;
};
var create_document_fragment = function () { return document .createDocumentFragment () };
var frag = function (html) {
	var container = document .createElement ('template');
	container .innerHTML = html;
	return container .content;
}; 

var filterObjIndexed = R .curry (function (fn, obj) {
	var x = {};
	R .forEachObjIndexed (function (value, key) {
		if (fn (value, key))
			x [key] = value;
	}) (obj);
	return x;
});

//TODO: expand to include queryselectorall
var dom_tree = function (selector_tree, root) {
	if (R .is (String) (selector_tree)) {
		return root .querySelector (selector_tree)
	}
	else {
		root = selector_tree ._ ? selector_tree ._ instanceof Node ? selector_tree ._ : root .querySelector (selector_tree ._) : root;
		return [selector_tree]
			.map (filterObjIndexed (function (x, key) {
				return key !== '_'
			}))
			.map (R .map (function (subtree) {
				return dom_tree (subtree, root);
			}))
			.map (function (x) {
				if (selector_tree ._)
					return R .assoc ('_') (root) (x)
				else
					return x;
			})
		[0]
	}
};
var n_times = function (n, x) {
	return Array (n) .fill (x);
}


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
var hint_path = function (hint) {
	return use_path (hint_use (hint))
};
var hint_use = function (hint) {
	return hint .querySelector ('use');
};
var use_path = function (use) {
	var id = use .getAttribute ('xlink:href') || use .getAttribute ('href');//console.log(id);
	return svg_ (use) .querySelector (id);
};