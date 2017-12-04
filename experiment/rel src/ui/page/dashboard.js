+ function () {
	var items = [
		{
			title: 'BMI計算器',
			image: 'assets/dashboard/bmi.jpg',
			nav: 'bmi'
		},
		{
			title: '健身操',
			image: 'assets/dashboard/dance.jpg',
			nav: 'dance'
		},
		/*{
			title: '計步器',
			image: 'assets/dashboard/pedometer.jpg',
			nav: 'pedometer'
		},*/
		{
			title: '各昔食譜',
			image: 'assets/dashboard/recipes.jpg',
			nav: 'recipes'
		},
		{
			title: 'Samantha Clayton 運動教學',
			image: 'assets/dashboard/exercise.jpg',
			nav: 'exercise'
		},
		{
			title: '營養理念',
			image: 'assets/dashboard/nutrition.jpg',
			nav: 'nutrition'
		},
		{
			title: '有營早餐',
			image: 'assets/dashboard/breakfast.jpg',
			nav: 'breakfast'
		}
	];
	
	var ui_info = pre (function () {
		var ui = frame ('dashboard');

		var major_item_dom = ui .querySelector ('#item[major][template]');
			major_item_dom .removeAttribute ('template');
		var major_item_clip_dom = clip_ (major_item_dom);
			major_item_dom .removeAttribute ('clip-path');
			major_item_clip_dom .removeAttribute ('id');
			var major_bounding_box = bound_rectangle (path_ (major_item_clip_dom));
			var major_title_dom = major_item_dom .querySelector ('#title');
			var major_title_bounding_box = hint_bounds (hint_ (major_title_dom));
			var major_title_y_translation = y_translation (hint_ (major_title_dom));
			[] .forEach .call (major_item_dom .querySelectorAll ('[example]'), function (_) {
				_ .outerHTML = '';
			});
			[] .forEach .call (major_item_dom .querySelectorAll ('#hint[for=text]'), function (_) {
				_ .outerHTML = text_ify (_);
			});
			[] .forEach .call (major_item_dom .querySelectorAll ('#hint[for=image]'), function (_) {
				_ .outerHTML = image_ify (_);
			});
			//console .log (major_item_dom .querySelector ('#hint[for=text]') .getAttribute ('style'));
			var major_item = {
				height: major_bounding_box .y_max - major_bounding_box .y_min,
				text: {
					height: major_title_bounding_box .y_max - major_title_bounding_box .y_min,
					y_translation: major_title_y_translation,
					font_size: 30
				},
				clip: {
					dom: major_item_clip_dom
				},
				dom: major_item_dom
			};
			
		var minor_item_dom = ui .querySelector ('#item[minor][template]');
			minor_item_dom .removeAttribute ('template');
			var minor_bounding_box = bound_rectangle (path_ (clip_ (minor_item_dom)));
			var minor_title_dom = minor_item_dom .querySelector ('#title');
			var minor_title_bounding_box = hint_bounds (hint_ (minor_title_dom));
			var minor_title_y_translation = y_translation (hint_ (minor_title_dom));
			[] .forEach .call (minor_item_dom .querySelectorAll ('#hint[for=text]'), function (_) {
				_ .outerHTML = text_ify (_);
			});
			//console .log (minor_item_dom .querySelector ('#hint[for=text]') .getAttribute ('style'));
			var minor_item = {
				height: minor_bounding_box .y_max - minor_bounding_box .y_min,
				text: {
					height: minor_title_bounding_box .y_max - minor_title_bounding_box .y_min,
					y_translation: minor_title_y_translation,
					font_size: 16
				},
			};
			
		//[] .forEach .call (ui .querySelectorAll ('#item, #template clipPath'), function (_) {
		[] .forEach .call (ui .querySelectorAll ('#item, #template [clip-rule]'), function (_) {
			_ .outerHTML = '';
		});
			
		return {
			dom: serve (ui),
			major: major_item,
			minor: minor_item,
			close_menu: {
				height: function () {
					var bounding_box = hint_bounds (hint_ (ui .querySelector ('[action=close-menu]')))
					return bounding_box .y_max - bounding_box .y_min;
				} ()
			}
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
			
		var window_ = [0, window .innerHeight * 320 / window .innerWidth];
			
		return function (dom, text_dom, text_node_dom, clip_path_dom) {
			return {
				pre: function () {
					var un_hide = TweenMax .fromTo (dom, 0, {
							css: {
								visibility: 'hidden'
							}
						}, {
							css: {
								visibility: ''
							}
						});
					var un_slide = TweenMax .fromTo (dom, 0, {
							transform: 'translate3d(0,' + y_s [y_s .length - 1] + 'px,0)'
						}, {
							transform: 'translate3d(0,' + y_s [0] + 'px,0)'
						});
					var unroll = TweenMax .fromTo (clip_path_dom, 0, {
							scaleY: height_ratio (ui_info .minor, ui_info .major)
						}, {
							scaleY: 1
						});
					var un_text_float = TweenMax .fromTo (text_dom, 0, {
							transform: 'translate3d(0,' + ((ui_info .major .text .y_translation - (ui_info .major .height / 2 - ui_info .minor .height / 2)) - ui_info .major .text .y_translation) + 'px,0)'
						}, {
							transform: 'translate3d(0,' + 0 + 'px,0)'
						});
					var un_text_resize = TweenMax .fromTo (text_node_dom, 0, {
							fontSize: ui_info .minor .text .font_size
						}, {
							fontSize: ui_info .major .text .font_size
						});
					
					
					var slide_down = TweenMax .fromTo (dom, 1, {
							transform: 'translate3d(0,' + y_s [0] + 'px,0)'
						},
						{
							transform: 'translate3d(0,' + y_s [1] + 'px,0)',
							onUpdate: function () {
								requestAnimationFrame (function () {
									clip_path_dom .style .willChange = 
										clip_path_dom .style .willChange === '' ?
											'transform'
										:
											''
								});
							}
						});
					var roll_lock = TweenMax .fromTo (clip_path_dom, 0, {scaleY: 1}, {scaleY: 1});
					var text_float_lock = TweenMax .fromTo (text_dom, 0, {y: 0},{y: 0});
					var text_resize_lock = TweenMax .fromTo (text_node_dom, 0, {fontSize: ui_info .major .text .font_size}, {fontSize: ui_info .major .text .font_size});
					
					return [un_slide, unroll, un_text_float, un_text_resize, slide_down];
				} (),
				major: function () {
					var slide_down = TweenMax .fromTo (dom, 1, {
							y: y_s [1]
						}, 
						{
							y: y_s [2],
							onUpdate: function () {
								requestAnimationFrame (function () {
									clip_path_dom .style .willChange = 
										clip_path_dom .style .willChange === '' ?
											'transform'
										:
											''
								});
							}
						});
					var roll = TweenMax .fromTo (clip_path_dom, 1, {
							scaleY: 1,
							transformOrigin: '50% 50%'
						},
						{
							scaleY: height_ratio (ui_info .minor, ui_info .major),
							transformOrigin: '50% 50%'
						});
					var text_float = TweenMax .fromTo (text_dom, 1, {
							transform: 'translate3d(0,' + 0 + 'px,0)'
						},
						{
							transform: 'translate3d(0,' + ((ui_info .major .text .y_translation - (ui_info .major .height / 2 - ui_info .minor .height / 2)) - ui_info .major .text .y_translation) + 'px,0)'
						});//(d+(H/2-h/2))-D
					var text_resize = TweenMax .fromTo (text_node_dom, 1, {
							fontSize: ui_info .major .text .font_size
						}, 
						{
							fontSize: ui_info .minor .text .font_size
						});
					
					return [slide_down, roll, text_float, text_resize];
				} (),
				minor: function (n) {
					return function () {
						if (window_ [1] <= y_s [n]) {
							var hide = TweenMax .fromTo (dom, 1, {
									css: {
										visibility: ''
									}
								},
								{
									css: {
										visibility: 'hidden'
									}
								});
							var inert = TweenMax .fromTo (dom, 1, {
									css: {
										visibility: 'hidden'
									}
								},
								{
									css: {
										visibility: 'hidden'
									}
								})
							return [hide, inert]
						}
						else {
							var slide_down = TweenMax .fromTo (dom, 1, {
									transform: 'translate3d(0,' + y_s [n] + 'px,0)'
								}, 
								{
									transform: 'translate3d(0,' + y_s [n + 1] + 'px,0)'
								});
							var roll_lock = TweenMax .fromTo (clip_path_dom, 0, {scaleY: height_ratio (ui_info .minor, ui_info .major)}, {scaleY: height_ratio (ui_info .minor, ui_info .major), ease: Linear .easeNone});
							var text_float_lock = TweenMax .fromTo (text_dom, 0, {y: (ui_info .major .text .y_translation - (ui_info .major .height / 2 - ui_info .minor .height / 2)) - ui_info .major .text .y_translation},{y: (ui_info .major .text .y_translation - (ui_info .major .height / 2 - ui_info .minor .height / 2)) - ui_info .major .text .y_translation, ease: Linear .easeNone});
							var text_resize_lock = TweenMax .fromTo (text_node_dom, 0, {fontSize: ui_info .minor .text .font_size}, {fontSize: ui_info .minor .text .font_size, ease: Linear .easeNone});
						
							return [slide_down, roll_lock, text_float_lock, text_resize_lock];
						}
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
			item_dom .querySelector ('[text]') .textContent = item .title;
			item_dom .querySelector ('img') .src = item .image;
			stream_from_click_on (item_dom) .thru (tap, function () {
				_ .intent (['select', item .nav]);
			});
			var container_dom = dom .querySelector ('#template');
			container_dom .insertBefore (clip_dom, container_dom .firstChild);
			container_dom .insertBefore (item_dom, container_dom .firstChild);
			return item_dom;
		});
		var item_timelines = items_doms .map (function (item_dom) {
			var text_dom = item_dom .querySelector ('#title');
			var text_node_dom = text_dom .querySelector ('[text]');
			var clip_path_dom = path_ (clip_ (item_dom));

			var snap_forms = item_snapper (item_dom, text_dom, text_node_dom, clip_path_dom);
			
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
		'dashboard', function (components, unions) {
			var nav = unions .nav;
	
			//TODO: adjust for svg scaling
			var visible_minors = Math .ceil ((viewport_dimensions () [1] * 320 / viewport_dimensions () [0] - ui_info .major .height) / ui_info .minor .height) ;
			var effective_items =	items .length - 1 >= visible_minors + 1?
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
						nav .state (['back']);
						tenure .end (true);
					}
				}
				else if (intent [0] === 'select') {
					return function (tenure) {
						nav .state ([intent [1]]);
						tenure .end (true);
					}
				}
				else if (intent [0] === 'menu') {
					return function (tenure) {
						menu_timeline .tweenTo (0.5);
						
						levels (1);
						
						license .thru (tap, function (intent) {
							if (intent [0] === 'menu-select') {
								nav .state ([intent [1]]);
							}
						});
						
						license .thru (tap, function (intent) {
							if (intent [0] === 'submenu')
								levels (levels () + 1);
						});

						license .thru (tap, function (intent) {
							if (intent [0] === 'menu' || intent [0] === 'menu-select')
								levels (0);
						});
						
						license .thru (tap, function (intent) {
							if (intent [0] === 'close-menu')
								levels (levels () - 1)
						});
						
						promise (levels .thru (filter, function (x) {
							return x === 0
						})) .then (function () {
							menu_timeline .tweenTo (0, {
								onComplete: function () {
									tenure .end (true);
								}});
						})
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
										nav .state (['back']);
									}
									else if (intent [0] === 'select') {
										nav .state ([intent [1]]);
									}
									else if (intent [0] === 'menu') {
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
							if (intent [0] === 'select') {
								nav .state ([intent [1]]);
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
			
			
			var snaps = scrolls_ (dom, effective_items, _, reversals);
			//HACK
			//todo: file issue to gsap, saying time/seek and transformOrigin don't play well.
			requestAnimationFrame (function () {snaps .scroll_timeline .play () .time (2 * effective_items .length + 1) .pause ();});

			gestures (dom, _);


			var levels = stream (0);
			
			var menu_dom = dom .querySelector ('#menu');
			var close_menu_dom = dom .querySelector ('[action=close-menu]');
			var menu_tween = TweenMax .fromTo (menu_dom, 0.5, {y: (568 - ui_info .close_menu .height) + Math .max ((viewport_dimensions () [1] / viewport_dimensions () [0] - squeeze_ratio) * 320, 0)}, {y: 0, paused: true});
			var menu_timeline = new TimelineMax ({paused: true});
			menu_timeline .add (menu_tween .play (), 0);
			menu_timeline .add (function () {
				menu_dom .style .visibility = 'hidden';
				close_menu_dom .style .visibility = 'hidden';
			}, 0);
			menu_timeline .add (function () {
				menu_dom .style .visibility = '';
				close_menu_dom .style .visibility = '';
			}, 0.01);
			menu_dom .style .visibility = 'hidden';
			close_menu_dom .style .visibility = 'hidden';

			var menus_ = {
				menu_levels: levels,
				menu_dom: menu_dom,
				close_menu_dom: close_menu_dom,
				menu_tween: menu_tween,
				menu_timeline: menu_timeline
			};
			
			
			var back_dom = dom .querySelector ('#back[action=nav]');

			stream_from_click_on (back_dom) .thru (tap, function () {
				_ .intent (['back']);
			});
			stream_from_click_on (close_menu_dom) .thru (tap, function () {
				_ .intent (['close-menu']);
			});
			stream_from_click_on (dom .querySelector ('#menu-trigger')) .thru (tap, function () {
				_ .intent (['menu']);
			});
			stream_from_click_on (menu_dom .querySelector ('#herbal-life')) .thru (tap, function () {
				_ .intent (['menu-select', 'herbal_life']);
			});
			stream_from_click_on (menu_dom .querySelector ('#po-leung-kuk')) .thru (tap, function () {
				_ .intent (['menu-select', 'po_leung_kuk']);
			});
			stream_from_click_on (menu_dom .querySelector ('#center')) .thru (tap, function () {
				_ .intent (['menu-select', 'center']);
			});
			stream_from_click_on (menu_dom .querySelector ('#contact')) .thru (tap, function () {
				sheet .type === 'cordova' ?
					sheet ([
						'保良局長康青少年發展中心 Email',
						'保良局長康青少年發展中心 Instagram',
						'保良局長康青少年發展中心 Facebook',
						'Herbalife Nutrition Email',
						'Herbalife Nutrition Facebook'
					])
				:
					sheet ([
						{
							header: '保良局長康青少年發展中心',
							items: [
								{
									title: 'Email',
									subtext: '保良局長康青少年發展中心 Email',
									image: 'assets/dashboard/contact/mail.png'
								},
								{
									title: 'Instagram',
									subtext: '保良局長康青少年發展中心 Instagram',
									image: 'assets/dashboard/contact/instagram.png'
								},
								{
									title: 'Facebook',
									subtext: '保良局長康青少年發展中心 Facebook',
									image: 'assets/dashboard/contact/facebook.png'
								}
							]
						},
						{
							header: 'Herbalife Nutrition',
							items: [
								{
									title: 'Email',
									subtext: 'Herbalife Nutrition Email',
									image: 'assets/dashboard/contact/mail.png'
								},
								{
									title: 'Facebook',
									subtext: 'Herbalife Nutrition Facebook',
									image: 'assets/dashboard/contact/facebook.png'
								}
							]
						}
					])
				.then (function (x) {
					if (x === '保良局長康青少年發展中心 Email') {
						window .location .href = 'mailto:chydc@poleungkuk.org.hk'
					}
					else if (x === '保良局長康青少年發展中心 Instagram') {
						window .location .href = 'instagram://user?username=plkchydc'
					}
					else if (x === '保良局長康青少年發展中心 Facebook') {
						window .location .href = 'fb://page/234989793503278'
					}
					else if (x === 'Herbalife Nutrition Email') {
						window .location .href = 'mailto:memberservices_hk@herbalife.com'
					}
					else if (x === 'Herbalife Nutrition Facebook') {
						window .location .href = 'fb://page/1499801383681105'
					}
				})
			});
	
			return R .mergeAll ([snaps, menus_, {
				items: items,
				effective_items: effective_items,
				dom: dom,
				_: _
			}]);
		}
	) (window .uis);
} ();