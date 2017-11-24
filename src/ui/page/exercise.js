+ function () {
    var ui_info = pre (function () {
        var dom = frame ('exercise');
        
        var warmup = dom .querySelector ('#item[warmup] #hint[for=image]');
		warmup .outerHTML = image_ify (warmup, 'assets/exercise/warmup.png');

        var lowers = dom .querySelector ('#item[lowers] #hint[for=image]');
		lowers .outerHTML = image_ify (lowers, 'assets/exercise/lowers.png');
        
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
} ();