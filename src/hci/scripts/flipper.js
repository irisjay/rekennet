var dynamic_flip = function (dom, options) {
    var camera = dom;
    var scene = camera .querySelector ('scene');
    var front = scene .querySelector ('front');
    var back = scene .querySelector ('back');


    var size = options .size;

    var speed = {
        v: options .initial_speed || 10
    };
    var final_speed = options .final_speed || 0.14;
    var time = options .time || 4;

    var easing = options .easing || dynamic_flip .default_easing;

    var depth = options .depth || 0.3225;

    var half_cycle = options .half_cycle || function () {};
    var terminal_speed = options .terminal_speed || function () {};


    TweenMax .set ([camera, front, back], {
        css: {
            width: size .x,
            height: size .y
        }
    })
    TweenMax .set (camera, {
        css: {
            perspective: size .x / depth
        }
    })
    TweenMax .set (back, {
        css: {
            rotationY: -180
        }
    });



    var spin = new TimelineMax ({
        repeat: -1,
        paused: true
    });
    var dynamics = new TimelineMax ({
        paused: true
    });

    var adjust_speed = function (speed) {
        spin .timeScale (speed);
    };

    adjust_speed (speed .v);

    spin .add (TweenMax .to (scene, 0.5, {
        css: {
            rotationY: "+=180"
        },
        onComplete: half_cycle,
        ease: Power0 .easeInOut
    }), 0);
    //spin .add (TweenMax .to (scene, 0.25, {css:{z:"-=100"}, yoyo:true, repeat:1, ease:Power0 .easeIn}), 0);
    spin .add (TweenMax .to (scene, 0.5, {
        css: {
            rotationY: "+=180"
        },
        onComplete: half_cycle,
        ease: Power0 .easeInOut
    }), 0.5);
    //spin .add (TweenMax .to (scene, 0.25, {css:{z:"-=100"}, yoyo:true, repeat:1, ease:Power0 .easeIn}), 0.5);

    dynamics .add (TweenMax .to (speed, time, {
        v: final_speed,
        onUpdate: function () {
            adjust_speed (speed .v);
        },
        ease: easing,
        onComplete: terminal_speed
    })); //

    return {
        dynamics: dynamics,
        flip: spin,
        speed: speed,
        doms: {
            camera: camera,
            scene: scene,
            front: front,
            back: back
        }
    }
};

dynamic_flip .default_easing = CustomEase .create ("custom", "M0,0,C0,0.32,0.02,0.426,0.18,0.588,0.365,0.775,0.604,0.842,1,0.994");