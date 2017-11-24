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
	var riot_pages = [  ];
	
	
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
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [0], "range_width":260.008 };
    
    var _label_interaction = function (dom) {
        //todo: refactor this part away
        var hue = { hue: 0 };
        var hue_tween = function (from, to) {
            return TweenLite .fromTo (hue, 1, {hue: from}, {hue: to, ease: SlowMo .ease .config (0.7, 0.7, false), paused: true,
    			onUpdate: function () {
					dom .style .color = 'hsl(' + hue.hue + ', 100%, 42%)';
    			}
	        });
        };
        var anorexic_tween = hue_tween (200, 200) .duration (14 - 0);
        var underweight_tween = hue_tween (200, 133) .duration (18.5 - 14);
        var healthy_tween = hue_tween (133, 130) .duration (23 - 18.5);
        var overweight_tween = hue_tween (130, 52) .duration (27.5 - 23);
        var obese_tween = hue_tween (52, 0) .duration (40 - 27.5);
        
        var color_timeline = new TimelineMax ({paused: true});
        color_timeline .add (anorexic_tween .play (), 0);
        color_timeline .add (underweight_tween .play (), 14);
        color_timeline .add (healthy_tween .play (), 18.5);
        color_timeline .add (overweight_tween .play (), 23);
        color_timeline .add (obese_tween .play (), 27.5);

        
        return R .merge ({color_timeline: color_timeline}) (interaction (transition (function (intent, license) {
            if (intent [0] === 'label') {
                return function (tenure) {
                    dom .textContent = intent [1];
                    
                    color_timeline .time (intent [1]);
                    
                    tenure (intent [1]);
                    tenure .end (true);
                }
            }
            else
                return decline_ (intent)
        })))
    };
    var _slider_interaction = function (components) {
        var dragger_dom = components .dragger;
        var label_dom = components .label;
        var marked_dom = components .marked;
        var range = components .range;
        
        var marked_tween = TweenMax .fromTo (marked_dom, 1, { scaleX: 0, css: { transformOrigin: '0% 0%' } }, { scaleX: 1, css: { transformOrigin: '0% 0%' }, ease: Power0 .easeNone, paused: true });
        var dragger_tween = TweenMax .fromTo (dragger_dom, 1, { x: 0 }, { x: ui_info. range_width, ease: Power0 .easeNone, paused: true });
        var slider_timeline = new TimelineMax ({paused: true});
        slider_timeline .add (marked_tween .play (), 0);
        slider_timeline .add (dragger_tween .play (), 0);
        
        var viewport_width = window .innerWidth;
        
        var last_x = stream ();
        dragger_dom .setAttribute ('interactable', '');
        dragger_dom .addEventListener ('touchstart', function (e) {
            last_x (e .touches [0] .pageX);
        });
        dragger_dom .addEventListener ('touchmove', function (e) {
            var x = e .touches [0] .pageX;
            var dx = x - last_x ();
            last_x (x);
            _ .intent (['drag', _ .state () .scale + dx / ui_info .range_width]);
            
        });
        
        setTimeout (function () {slider_timeline .play () .pause ()}, 0)
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'drag') {
                return function (tenure) {
                    var x = intent [1]
                    if (x < 0) x = 0;
                    if (x > 1) x = 1;
                    slider_timeline .time (x);
                    var val = (components .range .min + (components .range .max - components .range .min) * x);
                    label_dom .textContent = val .toFixed (0);
                    tenure ({ scale: x, val: val });
                    tenure .end (true);
                }
            }
            else
                return decline_ (intent)
        })); 
        _ .intent (['drag', 0]);
        
        return R .merge (_) ({
            dragger_dom: dragger_dom,
            label_dom: label_dom,
            marked_dom: marked_dom,
            range: range,
            marked_tween: marked_tween,
            dragger_tween: dragger_tween,
            slider_timeline: slider_timeline
        });
    };
    
    var history_interaction = function (components) {
        var bmi = components .bmi;
        var diary = components .diary;
        var save = components .save;
        var show = components .show;
        var delta = components .delta;
        
        
        
        
        var weekly_doms = diary .querySelectorAll ('[text]');

        
        var flash = TweenMax .to (bmi, 0.15, {
            scale: 0.1,
			transformOrigin: '50% 50%',
            yoyo: true,
			repeat: -1,
            paused: true
        });
        var flasher = new TimelineMax ({paused:true});
        flasher .add (flash .play ());
        
        stream_from_click_on (save) .thru (tap, function () {
            api .bmi .to ((api .bmi .from () || []) .concat ([[+ new Date (), bmi .querySelector ('[text]') .textContent]]));
            flasher .tweenFromTo (0, 0.3);
        });
        var showing = interaction_case ({
            off: undefined,
            on: diary
        });
        stream_from_click_on (show) .thru (tap, function () {
            showing .intent (['off', 'on']);
            diary .setAttribute ('interactable', '');
        });
        stream_from_click_on (diary) .thru (tap, function () {
            showing .intent (['on', 'off']);
            diary .removeAttribute ('interactable');
        });
        
        showing .intent (['on', 'off']);

        var start_of_week = function () {
            var d = new Date ();
            var day = d .getDay (),
            diff = d .getDate () - day + (day == 0 ? -6 : 1); // adjust when day is sunda
            d .setDate (diff);
            d .setHours (0);
            d .setMinutes (0);
            d .setSeconds (0);
            return new Date (d);
        };

        mergeAll ([stream (api .bmi .from ()), api .bmi .from])
            .thru (map, R .cond ([
                [R .is (Array), R .pipe (
                    R .groupBy (function (record) {
                        var date = record [0];
                        var weeks_before = Math .ceil ((start_of_week () - date) / (1000 * 60 * 60 * 24 * 7));
                        return weeks_before;
                    }),
                    R. map (R .sortBy (R .prop (0))),
                    R. map (R .pipe (R .last, R .prop (1)))
                )],
                [R .T, R .always ({})]
            ])) .thru (tap, function (weekly_bmi) {
                [0, 1, 2, 3, 4, 5, 6, 7, 8] .forEach (function (week) {
                    weekly_doms [week] .textContent = weekly_bmi [week] || '-';
                });
                delta .textContent = weekly_bmi [1] && weekly_bmi [0] ? weekly_bmi [0] - weekly_bmi [1] : '-';
            })
    };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var bmi = components .bmi;
        var height = components .height;
        var weight = components .weight;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }));
        
        mechanism (function () {
            return (weight .state () .val / (height .state () .val * height .state () .val / 10000)) .toFixed (1)
        }, [height .state, weight .state])
        .thru (tap, function (x) {
            bmi .intent (['label', x])
        });

        return R .merge (_) (components);
    };
    
    window .uis = R .assoc (
        'bmi', function (components, unions) {
            var nav = unions .nav;
            
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

            var bmi_dom = dom .querySelector ('#bmi [text]');

            var height_dom = dom .querySelector ('#height');
            var height_label_dom = height_dom .querySelector ('#label');
            var height_marked_scale_dom = height_dom .querySelector ('#marked-scale');
            var height_text_dom = height_dom .querySelector ('[text]');

            var weight_dom = dom .querySelector ('#weight');
            var weight_label_dom = weight_dom .querySelector ('#label');
            var weight_marked_scale_dom = weight_dom .querySelector ('#marked-scale');
            var weight_text_dom = weight_dom .querySelector ('[text]');

            var diary_dom = dom .querySelector ('#diary');

            var diary_save_dom = dom .querySelector ('#record[action]');
            var diary_show_dom = dom .querySelector ('#history[action]');
            var diary_delta_dom = dom .querySelector ('#delta [text]');

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream,
                    bmi: _label_interaction (bmi_dom),
                    height: _slider_interaction ({
                        dragger: height_label_dom,
                        label: height_text_dom,
                        marked: height_marked_scale_dom,
                        range: {
                            min: 50,
                            max: 200
                        }
                    }),
                    weight: _slider_interaction ({
                        dragger: weight_label_dom,
                        label: weight_text_dom,
                        marked: weight_marked_scale_dom,
                        range: {
                            min: 10,
                            max: 150
                        }
                    }),
                    history: history_interaction ({
                        diary: diary_dom,
                        bmi: bmi_dom .closest ('g'),
                        save: diary_save_dom,
                        show: diary_show_dom,
                        delta: diary_delta_dom
                    })
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [1] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    
    window .uis = R .assoc (
        'breakfast', function (components, unions) {
            var nav = unions .nav;
            
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

            var scroll_info = {};

            setTimeout (function () {
                scroll_info ._ = scroll_interaction ('y') (dom .querySelector ('#info'))
            }, 0)

            return R .merge ({
                dom: dom,
                scroll: scroll_info
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var items = [
        { image: 'assets/center/1.jpg' },
        { image: 'assets/center/2.jpg' },
        { image: 'assets/center/3.jpg' },
        { image: 'assets/center/4.jpg' },
        { image: 'assets/center/5.jpg' },
        { image: 'assets/center/6.jpg' },
        { image: 'assets/center/7.jpg' },
        { image: 'assets/center/8.jpg' },
        { image: 'assets/center/9.jpg' },
        { image: 'assets/center/10.jpg' },
        { image: 'assets/center/11.jpg' },
        { image: 'assets/center/12.jpg' },
        { image: 'assets/center/13.jpg' },
        { image: 'assets/center/14.jpg' },
        { image: 'assets/center/15.jpg' },
        { image: 'assets/center/16.jpg' },
        { image: 'assets/center/17.jpg' },
        { image: 'assets/center/18.jpg' },
        { image: 'assets/center/19.jpg' },
        { image: 'assets/center/20.jpg' },
        { image: 'assets/center/21.jpg' },
        { image: 'assets/center/22.jpg' },
        { image: 'assets/center/23.jpg' },
        { image: 'assets/center/24.jpg' },
        { image: 'assets/center/25.jpg' },
        { image: 'assets/center/26.jpg' },
        { image: 'assets/center/27.jpg' }
    ];
    
    var ui_info = { "dom":__hydrators [2], "carousel_width":320 };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    
    
	var item_snap_ = function (dom) {
	    var x = ui_info .carousel_width;
	    var ease = Power3 .eastOut;
		return function (n) {
		    if (n === 0) {
				var un_hide = TweenMax .fromTo (dom .parentNode, 0, {
						css: {
							display: 'none'
						}
					}, {
						css: {
							display: ''
						}
					});
				var un_slide = TweenMax .fromTo (dom .parentNode, 0, {
						x: x
					}, {
						x: -x
					});
				var slide = TweenMax .fromTo (dom .parentNode, 1, {
						x: -x
					}, {
						x: 0,
						ease: ease
					});
		        
		        return [un_hide, un_slide, slide];
		    }
			else if (n === 1) {
				var slide = TweenMax .fromTo (dom .parentNode, 1, {
						x: 0
					}, 
					{
						x: x,
						ease: ease
					});

				return [slide];
			}
			else {
				var hide = TweenMax .fromTo (dom .parentNode, 1, {
						css: {
							display: ''
						}
					},
					{
						css: {
							display: 'none'
						}
					})
				return [hide]
			}
		}
	};
	
	var scrolls_ = function (dom, items) {
		var item_snapper = item_snap_;
		
		var items_doms = items .map (function (item, n) {
			var item_dom = dom .querySelector ('#hint[for=carousel]') .parentNode .cloneNode (true) .firstChild;
			item_dom .removeAttribute ('template');
			item_dom .querySelector ('img') .setAttribute ('src', item .image);
			var container_dom = dom .querySelector ('#images');
			container_dom .insertBefore (item_dom .parentNode, container_dom .firstChild);
			return item_dom;
		});
		var item_timelines = items_doms .map (function (item_dom) {
			var snap_forms = item_snapper (item_dom);
			
			var timeline_bits = items .map (function (v, n) {
				return snap_forms (n);
			});
			
			var timeline = new TimelineMax ({paused: true, repeat: -1});
			timeline_bits .forEach (function (bit) {
				timeline .add (bit);
			});
			
			return timeline;
		});
		
		var scroll_timeline = new TimelineMax ();
		item_timelines .forEach (function (timeline, n) {
			scroll_timeline .add (timeline .play (), n);
		});
		scroll_timeline .pause ();
		
		return {
			items_doms: items_doms,
			item_timelines: item_timelines,
			scroll_timeline: scroll_timeline
		}
	};
    
    window .uis = R .assoc (
        'center', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            
			var carousel = scrolls_ (dom, items);
			carousel .scroll_timeline .duration (carousel .scroll_timeline .duration () * 4);
			carousel .scroll_timeline .play ();
            
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

            var scroll_info = {};

            setTimeout (function () {
                scroll_info ._ = scroll_interaction ('y') (dom .querySelector ('#info'))
            }, 0)

            return R .merge ({
                dom: dom,
                scroll: scroll_info,
                carousel: carousel
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var dance_src = 'assets/dance/dance.gif';
    var backgrounds = [
        'assets/dance/backgrounds/1.jpg',
        'assets/dance/backgrounds/2.jpg',
        'assets/dance/backgrounds/3.png',
        'assets/dance/backgrounds/4.png',
        'assets/dance/backgrounds/5.jpg',
        'assets/dance/backgrounds/6.png',
        'assets/dance/backgrounds/7.jpg',
        'assets/dance/backgrounds/8.png'
    ];
    
    var ui_info = { "dom":__hydrators [3] };
    
    var shuffle = function (array) {
        array = array .slice (0);
        var currentIndex = array.length, temporaryValue, randomIndex;
        
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        
        return array;
    };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var dance = components .dance;
        var backdrop = components .backdrop;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                };
            }
            else
                return decline_ (intent)
        }));
        
        backgrounds = shuffle (backgrounds);
        var i = -1;
        nav .intent .thru (tap, function (intent) {
            if (intent [0] === 'prepare') {
                dance .src = '';
                dance .src = dance_src;
                i = (i + 1) % backgrounds .length;
                backdrop .setAttribute ('src', backgrounds [i]);
            }
        })
        
        return _;
    };
    
    window .uis = R .assoc (
        'dance', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            
			var default_style = dom .getAttribute ('style');
			viewport_dimensions .thru (tap, function (dimensions) {
			    var width = dimensions [0];
			    var height = dimensions [1];
			    
				if (height / width > squeeze_ratio) {
                    dom .setAttribute ('style', 'height: 100%; width: auto;');
				}
				else {
					dom .setAttribute ('style', default_style || '');
				}
			})

                
            var back_dom = dom .querySelector ('#back[action=nav]');
            var back_stream = stream_from_click_on (back_dom);

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream,
                    dance: dom .querySelector ('#dance #dance img'),
                    backdrop: dom .querySelector ('#background img')
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
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
	
	var ui_info = { "dom":__hydrators [4], "major":{ "height":320, "text":{ "height":38, "y_translation":-14, "font_size":30 }, "clip":{ "dom":__hydrators [5] }, "dom":__hydrators [6] }, "minor":{ "height":90, "text":{ "height":20, "y_translation":85, "font_size":16 } }, "close_menu":{ "height":230 } };
	
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
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [7] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                };
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    
    window .uis = R .assoc (
        'exercise', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            
			var default_style = dom .getAttribute ('style');
			viewport_dimensions .thru (tap, function (dimensions) {
			    var width = dimensions [0];
			    var height = dimensions [1];
			    
				if (height / width > squeeze_ratio) {
                    dom .setAttribute ('style', 'height: 100%; width: auto;');
				}
				else {
					dom .setAttribute ('style', default_style || '');
				}
			})
			
			
            var back_dom = dom .querySelector ('#back[action=nav]');
            var back_stream = stream_from_click_on (back_dom);
            
            stream_from_click_on (dom .querySelector ('#item[action][warmup]'))
                .thru (tap, function () {
                    nav .state (['warmup']);
                });
            stream_from_click_on (dom .querySelector ('#item[action][lowers]'))
                .thru (tap, function () {
                    nav .state (['lowers']);
                });

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [8] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var link = components .link;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        link .thru (tap, function () {
            _ .intent (['link'])
        })
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else if (intent [0] === 'link') {
                return function (tenure) {
                    tenure .end (true);
                    window .open ('https://www.herbalifefamilyfoundation.org/', '_system');
                }
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    
    window .uis = R .assoc (
        'herbal_life', function (components, unions) {
            var nav = unions .nav;
            
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

            var link_dom = dom .querySelector ('#link[action]');
            var link_stream = stream_from_click_on (link_dom);

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream,
                    link: link_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [9] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }));
        
        return _;
    };
    
    window .uis = R .assoc (
        'lowers', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            var back_dom = dom .querySelector ('#back[action=nav]');
            var back_stream = stream_from_click_on (back_dom);

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [10] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    
    window .uis = R .assoc (
        'nutrition', function (components, unions) {
            var nav = unions .nav;
            
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

            var scroll_info = {};

            setTimeout (function () {
                scroll_info ._ = scroll_interaction ('y') (dom .querySelector ('#info'))
            }, 0)

            return R .merge ({
                dom: dom,
                scroll: scroll_info
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [11] };
    
    var _interaction_steps = function (dom) {
        pedometer .isStepCountingAvailable (function () {
            pedometer .startPedometerUpdates (function (x) {
                _ .intent (['steps', x .numberOfSteps])
            }, function (e) {
                report (e);
            });
        }, function (e) {
            alert ('這部手機不支援計步器');
            report (e);
        });

        var _ = interaction (transition (function (intent ,license) {
            if (intent [0] === 'steps') {
                return function (tenure) {
                    dom .textContent = intent [1];
                    tenure (intent [1]);
                    tenure .end (true);
                }
            }
            else if (intent [0] === 'reset') {
                return function (tenure) {
                    dom .textContent = 0;
                    tenure (0)
                    tenure .end (true);
                }
            }
            else
                return decline_ (intent);
        }));
        return _;
    };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var cases = components .cases;
        var steps = components .steps;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }));
        
        steps .state .thru (tap, function (x) {
            if (x) {
                cases .intent ([cases .state (), 'started'])
            }
            else {
                cases .intent ([cases .state (), 'start'])
            }
        });

        steps .intent (['reset'])

        return {
            _: _,
            steps: steps,
            cases: cases
        };
    };
    
    window .uis = R .assoc (
        'pedometer', function (components, unions) {
            var nav = unions .nav;
            
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

            var start_dom = dom .querySelector ('#start');
            var started_dom = dom .querySelector ('#started');

            var steps_dom = dom .querySelector ('#count [text]');

            requestAnimationFrame (function () {
                setTimeout (function () {
                    start_dom .setAttribute ('style', 'transform: translate(0,50vh) translate(0,-370%);');
                }, 0)
            });

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream,
                    cases: interaction_case ({
                        start: start_dom,
                        started: started_dom
                    }),
                    steps: _interaction_steps (steps_dom)
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [12] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var link = components .link;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        link .thru (tap, function () {
            _ .intent (['link'])
        })
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else if (intent [0] === 'link') {
                return function (tenure) {
                    tenure .end (true);
                    window .open ('http://www.poleungkuk.org.hk', '_system');
                }
            }
            else
                return decline_ (intent)
        }))
        
        return _;
    };
    //http://www.poleungkuk.org.hk
    window .uis = R .assoc (
        'po_leung_kuk', function (components, unions) {
            var nav = unions .nav;
            
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

            var link_dom = dom .querySelector ('#link[action]');
            var link_stream = stream_from_click_on (link_dom);

            var scroll_info = {};

            setTimeout (function () {
                scroll_info ._ = scroll_interaction ('y') (dom .querySelector ('#info'))
            }, 0)

            return R .merge ({
                dom: dom,
                scroll: scroll_info
            }) (interaction_ (
                {
                    back: back_stream,
                    link: link_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
var preloading = Promise .all (
    [ "assets/center/1.jpg", "assets/center/10.jpg", "assets/center/11.jpg", "assets/center/12.jpg", "assets/center/13.jpg", "assets/center/14.jpg", "assets/center/15.jpg", "assets/center/16.jpg", "assets/center/17.jpg", "assets/center/18.jpg", "assets/center/19.jpg", "assets/center/2.jpg", "assets/center/20.jpg", "assets/center/21.jpg", "assets/center/22.jpg", "assets/center/23.jpg", "assets/center/24.jpg", "assets/center/25.jpg", "assets/center/26.jpg", "assets/center/27.jpg", "assets/center/3.jpg", "assets/center/4.jpg", "assets/center/5.jpg", "assets/center/6.jpg", "assets/center/7.jpg", "assets/center/8.jpg", "assets/center/9.jpg", "assets/dance/backgrounds/1.jpg", "assets/dance/backgrounds/2.jpg", "assets/dance/backgrounds/3.png", "assets/dance/backgrounds/4.png", "assets/dance/backgrounds/5.jpg", "assets/dance/backgrounds/6.png", "assets/dance/backgrounds/7.jpg", "assets/dance/backgrounds/8.png", "assets/dance/dance.gif", "assets/dashboard/bmi.jpg", "assets/dashboard/breakfast.jpg", "assets/dashboard/contact/facebook.png", "assets/dashboard/contact/instagram.png", "assets/dashboard/contact/mail.png", "assets/dashboard/dance.jpg", "assets/dashboard/exercise.jpg", "assets/dashboard/nutrition.jpg", "assets/dashboard/pedometer.jpg", "assets/dashboard/recipes.jpg", "assets/exercise/lowers.png", "assets/exercise/warmup.png", "assets/recipes/recipe-1", "assets/recipes/recipe-2", "assets/recipes/recipe-3", "assets/splash/back.png", "assets/splash/front.png", "assets/splash/start.png" ] .map (function (url) {
        return promise_of (function (resolve, reject) {
            var x = new Image ();
            x .src = url
            x .style .position = 'absolute';
            x .style .visibility = 'hidden';
            document .addEventListener ('DOMContentLoaded', function () {
                document .body .insertBefore (x, document .body .firstChild);
                if (x .complete) {
                    document .body .removeChild (x);
                    resolve ();
                }
                else {
                    x .addEventListener ('load', function () {
                        document .body .removeChild (x);
                        resolve ();
                    })
                    x .addEventListener ('error', function (e) {
                        report (e);
                        document .body .removeChild (x);
                        reject ();
                    })
                }
            })
        })
    })
);;
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
	
	var ui_info = { "dom":__hydrators [13], "major":{ "height":267, "clip":{ "dom":__hydrators [14] }, "dom":__hydrators [15] }, "minor":{ "height":267 } };
	
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
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [16], "pop_dom":__hydrators [17] };
    
    var interaction_ = function (components, unions) {
        var flipper_dom = components .flipper;
        
        var nav = unions .nav;
        
        var terminal_reached = stream (false);
        var flipping = dynamic_flip (flipper_dom, {
            size: {
                x: 150,
                y: 150,
            },
            half_cycle: function () {
                if (terminal_reached ()) {
                    flipping .flip .pause ();   
                    flipping .dynamics .pause ();
                }
            },
            terminal_speed: function () {
                terminal_reached (true);
                flipping .doms .front .style .backgroundImage = 'url("assets/splash/start.png")';
                flipping .doms .back .style .backgroundImage = 'url("assets/splash/start.png")';
                flipper_dom .parentNode .insertBefore (ui_info .pop_dom .cloneNode (true), null);
            }
        });

        nav .intent .thru (tap, function () {
            terminal_reached (false);
            flipping .doms .front .style .backgroundImage = 'url("assets/splash/front.png")';
            flipping .doms .back .style .backgroundImage = 'url("assets/splash/back.png")';
            flipping .flip .time (0);
            flipping .dynamics .time (0);
            flipping .flip .play ();
            flipping .dynamics .pause ();
            preloading .then (function () {
                flipping .dynamics .play ();
            });
        })
        stream_from_click_on (flipping .doms .front) .thru (tap, function () {
            if (terminal_reached ())
                nav .state (['start']);
        });
        stream_from_click_on (flipping .doms .back) .thru (tap, function () {
            if (terminal_reached ())
                nav .state (['start']);
        });
        
        return {
            flipping: R .merge ({
                dom: flipper_dom,
                terminal_reached: terminal_reached
            }) (flipping)
        }
    };
    
    window .uis = R .assoc (
        'splash', function (components, unions) {
            var nav = unions .nav;
            
            var flipper_dom = ui_info .dom .cloneNode (true);
            
            var dom = document .createElement ('splash');
            dom .setAttribute ('page', '');
            dom .insertBefore (flipper_dom, null);
            dom .setAttribute ('style', 'background-color: #A8D6F4; display: block; width: 100%; height: 100%;');

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    flipper: flipper_dom
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
+ function () {
    var ui_info = { "dom":__hydrators [18] };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        
        var nav = unions .nav;
        
        back .thru (tap, function () {
            _ .intent (['back']);
        });
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'back') {
                return function (tenure) {
                    tenure .end (true);
                    nav .state (['back']);
                }
            }
            else
                return decline_ (intent)
        }));
        
        return _;
    };
    
    window .uis = R .assoc (
        'warmup', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            var back_dom = dom .querySelector ('#back[action=nav]');
            var back_stream = stream_from_click_on (back_dom);

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();;
