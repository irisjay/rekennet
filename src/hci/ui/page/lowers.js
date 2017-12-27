+ function () {
    var ui_info = pre (function () {
        var dom = frame ('lowers');

        var playground = document .createElement ('page');
        var video = document .createElement ('video');
            video .setAttribute ('autoplay', '');
            video .setAttribute ('controls', '');
        
        playground .insertBefore (video, null);
        playground .insertBefore (dom, null);

        var video_ify = function (hint, src) {
            video .innerHTML =  '<source src="' + src + '" type="video/mp4">';

        	return '';
        };
        playground .setAttribute ('style', 'width: 100%; height: 100%; background: #222222; display: block;');
        video .setAttribute ('style', 'z-index: 1; width: 100%; height: 100%; position: absolute;');
        dom .setAttribute ('style', 'z-index: 2; width: 100%; height: auto; position: absolute; pointer-events: none;');
        dom .querySelector ('#Canvas > rect') .outerHTML = '';
        dom .querySelector ('[clip-path="url(#clip-0)"] > path') .outerHTML = '';

		[] .forEach .call (dom .querySelectorAll ('#hint[for=video]'), function (_) {
			_ .outerHTML = video_ify (_, 'assets/lowers/lite.mp4');
		});

        return {
            dom: serve (playground)
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
} ();