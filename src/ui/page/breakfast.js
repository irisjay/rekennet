+ function () {
    var ui_info = pre (function () {
        var dom = frame ('breakfast');
        
        var scroll_hints = dom .querySelectorAll ('#hint[for=scroll]');
		[] .forEach .call (scroll_hints, fulfill_scroll);
        
        return {
            dom: serve (dom)
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
    
    window .uis = R .assoc (
        'breakfast', function (components, unions) {
            var nav = unions .nav;
            
            var dom = ui_info .dom .cloneNode (true);
            
			var viewport_height = window .innerHeight;
			var viewport_weight = window .innerWidth;
			if (viewport_height / viewport_weight > 1.775) {
				dom .setAttribute ('height', 320 * viewport_height / viewport_weight);
				dom .setAttribute ('viewBox', '0 0 320 ' + 320 * viewport_height / viewport_weight);
				if (dom .querySelector ('[clip-path="url(#clip-0)"]'))
				    dom .querySelector ('[clip-path="url(#clip-0)"]') .removeAttribute ('clip-path');
			}
            
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
} ();