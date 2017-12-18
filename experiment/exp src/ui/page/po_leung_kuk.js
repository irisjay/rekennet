+ function () {
    var ui_info = pre (function () {
        var dom = frame ('po_leung_kuk');
        
        var scroll_hints = dom .querySelectorAll ('#hint[for=scroll]');
		[] .forEach .call (scroll_hints, fulfill_scroll);
        
        return {
            dom: serve (dom)
        }
    });
    
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
} ();