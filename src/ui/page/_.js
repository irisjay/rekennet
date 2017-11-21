/*
	global pre
	global files
	global R
	global stream
	global routes
	global interaction
	global transition
	global retaining
	global dropRepeats
	global filter
	global riot
	global map
	global routing
	global tap
	global log
	global decline_
*/
+ function () {
	var riot_pages = pre (function () {
		var pages_src = require ('./config') .paths .pages .src;
		var files = require ('./util') .files;
		
		var pages =	files ('.ejs') (pages_src)
						.map (function (tag_path) {
							var tag_relative_path = tag_path .slice (pages_src .length + 1);
							var tag_name =	tag_relative_path
												.split ('/') .join ('-')
												.split ('.') [0];
							return tag_name
						})
						.filter (R .identity)
						.filter (R .compose (R .not, R .equals ('_')));
		return pages;
	});
	
	
	window .page_exists =	function (page_name) {
							return window .uis [page_name] || riot_pages .indexOf (page_name) !== -1;
						};
	window .page_name =	function (path) {
							var hash_position = path .indexOf ('#');
							var params_position = path .indexOf ('/#');
							
							var begin_position = hash_position + 1;
							var end_position =	params_position !== -1 || path [path .length - 1] === '/' ?
													params_position
												:
													undefined;
							
							return path .slice (begin_position, end_position) .split ('/') .join ('-') || routes .default;
						};
	window .page_params =	function (path) {
								return path .indexOf ('/#') !== -1 ?
										path .slice (path .indexOf ('/#') + '/#' .length) .split ('/')
									:
										[];
							};
	window .page_hash = 	function (path) {
								var params = page_params (path);
								return '#' + page_name (path) .split ('-') .join ('/') + (params .length ? '/#' + params .join ('/') : '');
							};
		
	var ui_ = function (page_name) {
		return window .uis [page_name];
	};
	var nav_of = R .cond ([
		[R .identity, R .prop ('nav')]]);
	var dom_of = function (x) {
		return x .dom || x .state && x .state () .dom || x .root;
	};
	var sync_hash = function (nav_state) {
		if (R .hasIn ('transition') (nav_state))
			replace_hash (nav_state .hash);
		else
			silent_replace_hash (nav_state .hash);
	};
		var replace_hash = function (x) {
			window .history .pushState (null, null, x);
		};
		var silent_replace_hash = function (x) {
			window .history .replaceState (null, null, x);
		};
	var replace_dom = function (curr, last_state) {
		document .body .insertBefore (dom_of (curr), document .body .firstElementChild);
		if (last_state) {
			document .body .removeChild (dom_of (last_state));
		}
	};
	var make_nav = function (naver, _name) {
		var x = interaction (noop);
		x .state
			.thru (tap, function (transition_info) {
				var transition = R .head (transition_info);
				var nav_intent =	R .merge (
										[routing (_name, transition)]
											.map (R .applySpec ({
												page: page_name,
												params: page_params,
												hash: page_hash
											}))
										[0]
									) ({
										transition: transition,
										args: R .tail (transition_info)
									});
				naver .intent (['nav', nav_intent, naver .state ()]);
			});
		return x;
	};
	var make_page = function (naver, nav_intent) {
		if (ui_ (nav_intent .page)) {
			var nav = make_nav (naver, nav_intent .page);
			return	R .merge (
						ui_ (
							nav_intent .page
						) ({}, { nav: nav }),
						{
							nav: nav
						}
					)
		}
		else {
			var nav = make_nav (naver, nav_intent .page);
			var _tag_name = tag_name (nav_intent .page);
			var x =	riot .mount (
						document .createElement (_tag_name),
						_tag_name,
						nav_intent .params
					) [0];
			if (x .nav) {
				nav .intent .thru (tap, x .nav .intent);
				x .nav .state .thru (tap, nav .state);
			}
			return retaining ({ nav: nav }) (x);
		}		
	};
		var tag_name =	function (page_name) {
							return 'page-' + page_name;
						};
	var intent_to_state = function (intent, page) {
		return retaining (intent) (page);
	};
	var intent_from_state = function (state) {
		return Object .getPrototypeOf (state)
	};
		
	window .master_ui = function (components, unions) {
		var loaded_pages = stream ({});
		
		var extension = interaction (transition (function (intent, license) {
			if (intent [0] === 'nav') {
				var nav_intent = intent [1];
				var last_state = intent [2];
				
				return function (tenure) {
					var time = new Date ();
					
					var cached = loaded_pages () [nav_intent .hash];
					var curr = cached ?
							intent_to_state (nav_intent, cached)
						:
							intent_to_state (nav_intent, make_page (extension, nav_intent));
					
					if (nav_of (curr)) {
						nav_of (curr) .intent (['prepare', curr .intent] .concat (curr .args || []));
					}
					if (! license ()) {
						if (last_state !== curr) {
							var _time = new Date ();
							
							sync_hash (curr);
							replace_dom (curr, last_state);
							
							log ('render page time ' + (new Date () - _time) + 'ms', curr);	
						}
						var last_loaded = curr;
					}
					else {
						var last_loaded = last_state;
					}
					
					if (last_state) {
						nav_of (last_state) .intent (['reset']);
					}
		
					log ('process page time ' + (new Date () - time) + 'ms', curr);	
		
					tenure (last_loaded);
					tenure .end (true);
					if (license ())
						extension .intent (license ());
				}
			}
			else {
				return decline_ (intent);
			}
		}));
		
		
		var manual_nav = stream ();
		manual_nav
			.thru (map, R .applySpec ({
				page: page_name,
				params: page_params,
				hash: page_hash
			}))
			.thru (filter, R .pipe (R .prop ('page'), page_exists))
			.thru (tap, function (nav_intent) {
				extension .intent (['nav', nav_intent, extension .state ()]);
			});
		window .addEventListener ('hashchange', function () {
			manual_nav (window .location .hash)
		});
		
		if (page_exists (page_name (window .location .hash))) {
			manual_nav (window .location .hash)
		}
		else {
			window .location .hash = routes .default;
		}
		
		extension .state
			.thru (filter, R .identity)
			.thru (dropRepeats)
			.thru (tap, function (page) {
				if (! loaded_pages () [page .hash] && ! page .temp)
					loaded_pages (
						R .assoc (page .hash, intent_from_state (page)) (loaded_pages ()))
			});
			
		return {
			_: extension,
			loaded_pages: loaded_pages
		};		
	};
} ();