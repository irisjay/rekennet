var drags = function (dom) {
    if (! dom .__drags) {
        dom .style .touchAction = 'none';
        dom .__drags = from (function (drag) {
            var _;
            
            dom .addEventListener ('touchstart', function (e) {
                _ = stream (e);
                drag (_);
            });
            dom .addEventListener ('touchmove', function (e) {
                window .dragging = true;

                _ (e)
            });
            dom .addEventListener ('touchend', function (e) {
                _ (e)
                _ .end (true);
                window .dragging = false;
            });
        })
    }
    return dom .__drags;
}


		
var scroll_interaction = function (direction) {
    var direction = direction === 'x' ? 'x' : 'y';
    return function (dom) {
        var svg = dom .ownerSVGElement;
        
    	var ugly_max = function () {
    	    var p = svg .createSVGPoint ();
		    p .x = dom .getBoundingClientRect () .right;
		    p .y = dom .getBoundingClientRect () .bottom;
    	    p = p .matrixTransform (dom .getScreenCTM () .inverse ())
	        return p;
		};
    	var scroll_max = function () {
    	    var p = svg .createSVGPoint ();
    	    if (direction === 'x') {
    		    p .x = dom .getBoundingClientRect () .right;
    		    p .y = 0;
		    }
    	    else if (direction === 'y') {
    		    p .x = 0;
    		    p .y = dom .getBoundingClientRect () .bottom;
    	    }
    	    p = p .matrixTransform (dom .getScreenCTM () .inverse ())
		    if (p [direction] > max [direction])
		        return p [direction];
		    else
		        return max [direction];
		};
	
	    var min = svg .createSVGPoint ();
	    var max = svg .createSVGPoint ();
	    /*if (!dom .hasAttribute ('scroll-x-min')) {
	        throw ('fuk')
	    }//*/
	    min .x = + dom .getAttribute ('scroll-x-min');
	    min .y = + dom .getAttribute ('scroll-y-min');
	    max .x = + dom .getAttribute ('scroll-x-max');
	    max .y = + dom .getAttribute ('scroll-y-max');

        //var scrolled = false;
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'drag') {
                var d = intent [1];
                var scroll = intent [2]
                var scroll_ = scroll - d [direction];
                //console .log (dom, scroll_, max [direction], scroll_max ());
                if (scroll_ < max [direction])
                    scroll_ = max [direction];
                if (scroll_ > scroll_max ())
                    scroll_ = scroll_max ();
                
                if (scroll_ !== scroll) {
                    if (direction === 'x') {
                        dom .setAttribute ('transform', 'translate(-' + (scroll_ - max [direction]) + ' 0)');
                    }
                    else if (direction === 'y') {
                        dom .setAttribute ('transform', 'translate(0 -' + (scroll_ - max [direction]) + ')');
                    }
                }
                
                return only_ (scroll_);
            }
            else {
                //fuked
            }
        }));
        
        _ .state (max [direction]);

        var last_x, last_y;
		drags (svg) .thru (filter, function (drag) {
		    var drag_start = svg .createSVGPoint ();
		    drag_start .x = drag () .touches [0] .pageX;
		    drag_start .y = drag () .touches [0] .pageY;
		    drag_start = drag_start .matrixTransform (dom .getScreenCTM () .inverse ())
		    
		    var _max = ugly_max ();
		    return min .x <= drag_start .x && drag_start .x <= _max .x &&
                min .y <= drag_start .y && drag_start .y <= _max .y
	    }) .thru (switchLatest) .thru (tap, function (e) {
		    if (e .type === 'touchstart') {
		        last_x = e .touches [0] .pageX
		        last_y = e .touches [0] .pageY
		    }
		}) .thru (filter, function (e) {
		    return e .type === 'touchmove'
		}) .thru (map, function (e) {
		    var d = {
		        x: e .touches [0] .pageX - last_x,
		        y: e .touches [0] .pageY - last_y
		    }
	        last_x = e .touches [0] .pageX
	        last_y = e .touches [0] .pageY
		    return d;
		}) .thru (tap, function (x) {
		    _ .intent (['drag', x, _ .state ()]);
		})
        
        return interaction_product ({
            _: _,
            dom: {
                intent: stream (),
                state: stream (dom)
            }
        });
	}
}