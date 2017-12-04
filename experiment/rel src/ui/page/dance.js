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
    
    var ui_info = pre (function () {
        var dom = frame ('dance');

		[] .forEach .call (dom .querySelectorAll ('#hint[for=image]'), function (_) {
			_ .outerHTML = image_ify (_);
		});
		
        return {
            dom: serve (dom)
        }
    });
    
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
} ();