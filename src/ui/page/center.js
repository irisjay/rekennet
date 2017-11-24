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
    
    var ui_info = pre (function () {
        var dom = frame ('center');
        
        var scroll_hints = dom .querySelectorAll ('#hint[for=scroll]');
		[] .forEach .call (scroll_hints, fulfill_scroll);
        
        var carousel_hint = dom .querySelector ('#hint[for=carousel]');
        var carousel_bounds = bound_rectangle (hint_path (carousel_hint));
        var carousel_width = carousel_bounds .x_max - carousel_bounds .x_min;
        carousel_hint .setAttribute ('template', '');
        carousel_hint .outerHTML = '<g>' + image_ify (carousel_hint) + '</g>';
        
        return {
            dom: serve (dom),
            carousel_width: carousel_width
        }
    });
    
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
} ();