+ function () {
	var items = [
		{
			image: 'assets/recipes/recipe-1'
		},
		{
			image: 'assets/recipes/recipe-2'
		},
		{
			image: 'assets/recipes/recipe-3'
		}
	];
	
	var ui_info = pre (function () {
		var ui = frame ('recipes');

		var major_item_dom = ui .querySelector ('#item[major][template]');
			major_item_dom .removeAttribute ('template');
		var major_item_clip_dom = clip_ (major_item_dom);
			major_item_dom .removeAttribute ('clip-path');
			major_item_clip_dom .removeAttribute ('id');
			var major_bounding_box = bound_rectangle (path_ (major_item_clip_dom));
			[] .forEach .call (major_item_dom .querySelectorAll ('[example]'), function (_) {
				_ .outerHTML = '';
			});
			[] .forEach .call (major_item_dom .querySelectorAll ('#hint[for=image]'), function (_) {
				_ .outerHTML = image_ify (_);
			});
			//console .log (major_item_dom .querySelector ('#hint[for=text]') .getAttribute ('style'));
			var major_item = {
				height: major_bounding_box .y_max - major_bounding_box .y_min,
				clip: {
					dom: major_item_clip_dom
				},
				dom: major_item_dom
			};
			
		var minor_item_dom = ui .querySelector ('#item[minor][template]');
			minor_item_dom .removeAttribute ('template');
			var minor_bounding_box = bound_rectangle (path_ (clip_ (minor_item_dom)));
			var minor_item = {
				height: minor_bounding_box .y_max - minor_bounding_box .y_min,
			};
			
		//[] .forEach .call (ui .querySelectorAll ('#item, #template clipPath'), function (_) {
		[] .forEach .call (ui .querySelectorAll ('#item, #templates [clip-rule]'), function (_) {
			_ .outerHTML = '';
		});
			
		return {
			dom: serve (ui),
			major: major_item,
			minor: minor_item
		};
	});
	
	var snap_roll_scroll = {
		time: 0.5
	};
	
	var height_ratio = function (item1, item2) {
		return item1 .height / item2 .height;
	};
	var height_difference = function (item1, item2) {
		return item1 .height - item2 .height;
	};
	
	var item_snap_ = function (list) {
		var y_s = [];
			y_s .push (- ui_info .major .height);
			y_s .push (0);
			list .slice (2) .map (function (v, x_1th) {
				return (ui_info .minor .height / 2 + ui_info .major .height / 2) + x_1th * ui_info .minor .height;
			}) .forEach (function (y) {
				y_s .push (y)
			});
			
		return function (dom, clip_path_dom) {
			return {
				pre: function () {
					var un_slide = TweenMax .fromTo (dom, 0, {
							y: y_s [y_s .length - 1]
						}, {
							y: y_s [0]
						});
					var unroll = TweenMax .fromTo (clip_path_dom, 0, {
							scaleY: height_ratio (ui_info .minor, ui_info .major)
						}, {
							scaleY: 1
						});
					
					
					var slide_down = TweenMax .fromTo (dom, 1, {
							y: y_s [0],
						},
						{
							y: y_s [1]
						});
					var roll_lock = TweenMax .fromTo (clip_path_dom, 0, {scaleY: 1}, {scaleY: 1});

					return [un_slide, unroll, slide_down];
				} (),
				major: function () {
					var slide_down = TweenMax .fromTo (dom, 1, {
							y: y_s [1],
						}, 
						{
							y: y_s [2],
						});
					var roll = TweenMax .fromTo (clip_path_dom, 1, {
							scaleY: 1,
							transformOrigin: '50% 50%'
						},
						{
							scaleY: height_ratio (ui_info .minor, ui_info .major),
							transformOrigin: '50% 50%'
						});
					
					return [slide_down, roll];
				} (),
				minor: function (n) {
					return function () {
						var slide_down = TweenMax .fromTo (dom, 1, {
								y: y_s [n],
							}, 
							{
								y: y_s [n + 1],
							});
						var roll_lock = TweenMax .fromTo (clip_path_dom, 0, {scaleY: height_ratio (ui_info .minor, ui_info .major)}, {scaleY: height_ratio (ui_info .minor, ui_info .major), ease: Linear .easeNone});
						
						return [slide_down, roll_lock];
					} ()
				}
			}
		};
	};
	
	var scrolls_ = function (dom, effective_items, _, reversals) {
		var reverse_capture = reversals .capture;
		var reverse_release = reversals .release;

		var item_snapper = item_snap_ (effective_items);
		
		var items_doms = effective_items .map (function (item, n) {
			var clip_id = 'clip-item-' + n;
			var item_dom = ui_info .major .dom .cloneNode (true)
			var clip_dom = ui_info .major .clip .dom .cloneNode (true);
			clip_dom .setAttribute ('id', clip_id);
			item_dom .setAttribute ('clip-path', 'url(#' + clip_id + ')');
			item_dom .querySelector ('img') .setAttribute ('src', item .image);
			var container_dom = dom .querySelector ('#templates');
			container_dom .insertBefore (clip_dom, container_dom .firstChild);
			container_dom .insertBefore (item_dom, container_dom .firstChild);
			return item_dom;
		});
		var item_timelines = items_doms .map (function (item_dom) {
			var clip_path_dom = path_ (clip_ (item_dom));

			var snap_forms = item_snapper (item_dom, clip_path_dom);
			
			var timeline_bits = n_times (effective_items .length) .map (function (v, n) {
				return [] .concat .apply ([], [
					n === 0 ? [snap_forms .pre] : [],
					n === 1 ? [snap_forms .major] : [],
					n > 1 ? [snap_forms .minor (n)] : []
				]);
			});
			
			var timeline = new TimelineMax ({paused: true, repeat: -1});
			timeline_bits .forEach (function (bit) {
				timeline .add (bit);
			});
			
			return timeline;
		});
		
		var scroll_timeline = new TimelineMax ();
		//scroll_timeline .time (effective_items .length + 1);
		item_timelines .forEach (function (timeline, n) {
			scroll_timeline .add (timeline .play (), n);
		});
		scroll_timeline .add (function () {
			if (scroll_timeline .reversed ())
				scroll_timeline .time (reverse_release);
		}, reverse_capture);
		scroll_timeline .pause ();
		
		return {
			items_doms: items_doms,
			item_timelines: item_timelines,
			scroll_timeline: scroll_timeline
		}
	};
	var gestures = function (dom, extension) {
		var _ = extension;
			
		['touchstart', 'touchmove', 'touchend'] .forEach (function (event) {
			dom .addEventListener (event, function (_e) {
				_ .intent ([event, _e]);
			});
		})
	};
	
	window .uis = R .assoc (
		'recipes', function (components, unions) {
			var nav = unions .nav;
	
			//TODO: adjust for svg scaling
			var visible_minors = Math .ceil ((viewport_dimensions () [1] - ui_info .major .height) / ui_info .minor .height) ;
			var effective_items =	items .length - 1 > visible_minors + 2?
										items
									:
										items .concat (n_times (Math .ceil (((visible_minors + 2) - (items .length - 1)) / items .length) * items .length) .map (function (v, k) {
											return items [k % items .length];
										}));

			var reversals = {
				capture: effective_items .length + 1,
				release: 60 * effective_items .length + 1
			};

			var _ = interaction (transition (function (intent, license) {
				if (intent [0] === 'back') {
		            return function (tenure) {
		                tenure .end (true);
		                nav .state (['back']);
		            }
		        }
		        else if (intent [0] === 'touchstart') {
					return function (tenure) {
						snaps .scroll_timeline .pause ();
						var initial_time = snaps .scroll_timeline .time ();
						var initial_y = intent [1] .touches [0] .pageY;
						var dt_from_ys = function (y0, y1) {
							if (y0 < ui_info .major .height) {
								var threshold = ui_info .major .height + y0 / ui_info .major .height * ui_info .minor .height;
								if (y1 < y0) {
									return (y1 - y0) * (1 / ui_info .major .height)
								}
								else if (y1 < threshold) {
									return (y1 - y0) / (threshold - y0)
								}
								else {
									return 1 + (y1 - threshold) * (1 / ui_info .minor .height)
								}
							}
							else {
								var closest_minor = Math .floor ((y0 - ui_info .major .height) / ui_info .minor .height) * ui_info .minor .height + ui_info .major .height;
								//var start_threshold = ui_info .major .height + ((y1 - closest_minor) / ui_info .minor .height) * ui_info .minor .height;
								var start_threshold = ui_info .major .height + (y0 - closest_minor);
								var end_threshold = ((y0 - closest_minor) / ui_info .minor .height) * ui_info .major .height;
								if (y1 > start_threshold) {
									return (y1 - y0) * (1 / ui_info .minor .height)
								}
								else if (y1 > end_threshold) {
									return (y1 - start_threshold) * (1 / (start_threshold - end_threshold)) + (start_threshold - y0) * (1 / ui_info .minor .height);
								}
								else {
									return (y1 - end_threshold) * (1 / ui_info .major .height) + -1 + (start_threshold - y0) * (1 / ui_info .minor .height);
								}
							}
						};
						var time_from_y = function (y) {
							var t = dt_from_ys (initial_y, y) + initial_time;
							while (t < reversals .capture)
								t += reversals .release - reversals .capture;
							return t;
						};
						//TODO: dont just use center.y, but calculat new_y manually
						//		as to smoothen fast dy
						var busy = false;
						var listen = license .thru (map, R .identity);
						listen .thru (tap, function (intent) {
							if (intent [0] === 'touchmove') {
								//log (intent [1]);
								if (! busy) {
									var new_y = intent [1] .touches [0] .pageY;
									snaps .scroll_timeline .time (time_from_y (new_y));
									busy = true;
									requestAnimationFrame (function () {
										busy = false;
									})
								}
							}
							if (intent [0] === 'touchend') {
								listen .end (true);
								license .thru (tap, function (intent) {
									if (intent [0] === 'touchstart') {
										tenure .end (true);
										turn .pause ();
										_ .intent (intent);
									}
									else if (intent [0] === 'back') {
										tenure .end (true);
										_ .intent (intent);
									}
								})
								var turn = snaps .scroll_timeline .tweenTo (Math .round (snaps .scroll_timeline .time ()), {
									onComplete: function () {
										tenure .end (true);
									}
								})
								if (turn .duration () < 0.07)
									turn .duration (0.07);
							}
						})
					}
				}
				else
					return decline_ (intent)
			}));

			var dom = ui_info .dom .cloneNode (true);

			var default_height = dom .getAttribute ('height');
			var default_viewbox = dom .getAttribute ('viewBox');
			var default_clip_path = dom .querySelector ('[clip-path="url(#clip-0)"]') && dom .querySelector ('[clip-path="url(#clip-0)"]') .getAttribute ('clip-path');
			viewport_dimensions .thru (tap, function (dimensions) {
			    var width = dimensions [0];
			    var height = dimensions [1];
			    
				if (height / width > squeeze_ratio) {
					dom .setAttribute ('height', 320 * height / width);
					dom .setAttribute ('viewBox', '0 0 320 ' + 320 * height / width);
					if (dom .querySelector ('[clip-path="url(#clip-0)"]'))
					    dom .querySelector ('[clip-path="url(#clip-0)"]') .removeAttribute ('clip-path');
				}
				else {
					dom .setAttribute ('height', default_height);
					dom .setAttribute ('viewBox', default_viewbox);
					if (dom .querySelector ('[clip-path="url(#clip-0)"]'))
					    dom .querySelector ('[clip-path="url(#clip-0)"]') .setAttribute ('clip-path', default_clip_path);
				}
			})
			
            var back_dom = dom .querySelector ('#back[action=nav]');
            var back_stream = stream_from_click_on (back_dom);
            
            back_stream .thru (tap, function () {
	            _ .intent (['back']);
	        });

			
			var snaps = scrolls_ (dom, effective_items, _, reversals);
			//HACK
			//todo: file issue to gsap, saying time/seek and transformOrigin don't play well.
			requestAnimationFrame (function () {snaps .scroll_timeline .play () .time (2 * effective_items .length + 1) .pause ();});

			gestures (dom, _);
	
			return R .merge (snaps) ({
				dom: dom,
				_: _
			});
		}
	) (window .uis);
} ();