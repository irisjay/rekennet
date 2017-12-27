+ function () {
    var ui_info = pre (function () {
        var dom = frame ('pedometer');
        
		[] .forEach .call (dom .querySelectorAll ('[example]'), function (_) {
			_ .outerHTML = '';
		});
		[] .forEach .call (dom .querySelectorAll ('#hint[for=text]'), function (_) {
			_ .outerHTML = text_ify (_);
		});
        
        return {
            dom: serve (dom)
        }
    });
    
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
} ();