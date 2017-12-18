+ function () {
    var ui_info = pre (function () {
        var dom = piece ('splash.html');
        var pop_dom = piece ('splash-pop.html');
        
        return {
            dom: dom,
            pop_dom: pop_dom
        }
    });
    
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
} ();