+ function () {
    var ui_info = pre (function () {
        var dom = frame ('bmi');
        
		[] .forEach .call (dom .querySelectorAll ('[example]'), function (_) {
			_ .outerHTML = '';
		});
		[] .forEach .call (dom .querySelectorAll ('#hint[for=text]'), function (_) {
			_ .outerHTML = text_ify (_);
		});


		var scale_bounds = use_bounds (hint_use (dom .querySelector ('#scale')));
        var range_width = scale_bounds .x_max - scale_bounds .x_min;
        
        return {
            dom: serve (dom),
            range_width: range_width
        }
    });
    
    var _label_interaction = function (dom) {
        //todo: refactor this part away
        var hue = { hue: 0 };
        var hue_tween = function (from, to) {
            return TweenLite .fromTo (hue, 1, {hue: from}, {hue: to, ease: SlowMo .ease .config (0.7, 0.7, false), paused: true,
    			onUpdate: function () {
					dom .style .color = 'hsl(' + hue.hue + ', 100%, 42%)';
    			}
	        });
        };
        var anorexic_tween = hue_tween (200, 200) .duration (14 - 0);
        var underweight_tween = hue_tween (200, 133) .duration (18.5 - 14);
        var healthy_tween = hue_tween (133, 130) .duration (23 - 18.5);
        var overweight_tween = hue_tween (130, 52) .duration (27.5 - 23);
        var obese_tween = hue_tween (52, 0) .duration (40 - 27.5);
        
        var color_timeline = new TimelineMax ({paused: true});
        color_timeline .add (anorexic_tween .play (), 0);
        color_timeline .add (underweight_tween .play (), 14);
        color_timeline .add (healthy_tween .play (), 18.5);
        color_timeline .add (overweight_tween .play (), 23);
        color_timeline .add (obese_tween .play (), 27.5);

        
        return R .merge ({color_timeline: color_timeline}) (interaction (transition (function (intent, license) {
            if (intent [0] === 'label') {
                return function (tenure) {
                    dom .textContent = intent [1];
                    
                    color_timeline .time (intent [1]);
                    
                    tenure (intent [1]);
                    tenure .end (true);
                }
            }
            else
                return decline_ (intent)
        })))
    };
    var _slider_interaction = function (components) {
        var dragger_dom = components .dragger;
        var label_dom = components .label;
        var marked_dom = components .marked;
        var range = components .range;
        
        var marked_tween = TweenMax .fromTo (marked_dom, 1, { scaleX: 0, css: { transformOrigin: '0% 0%' } }, { scaleX: 1, css: { transformOrigin: '0% 0%' }, ease: Power0 .easeNone, paused: true });
        var dragger_tween = TweenMax .fromTo (dragger_dom, 1, { x: 0 }, { x: ui_info. range_width, ease: Power0 .easeNone, paused: true });
        var slider_timeline = new TimelineMax ({paused: true});
        slider_timeline .add (marked_tween .play (), 0);
        slider_timeline .add (dragger_tween .play (), 0);
        
        var viewport_width = window .innerWidth;
        
        var last_x = stream ();
        dragger_dom .setAttribute ('interactable', '');
        dragger_dom .addEventListener ('touchstart', function (e) {
            last_x (e .touches [0] .pageX);
        });
        dragger_dom .addEventListener ('touchmove', function (e) {
            var x = e .touches [0] .pageX;
            var dx = x - last_x ();
            last_x (x);
            _ .intent (['drag', _ .state () .scale + dx / ui_info .range_width]);
            
        });
        
        setTimeout (function () {slider_timeline .play () .pause ()}, 0)
        
        var _ = interaction (transition (function (intent, license) {
            if (intent [0] === 'drag') {
                return function (tenure) {
                    var x = intent [1]
                    if (x < 0) x = 0;
                    if (x > 1) x = 1;
                    slider_timeline .time (x);
                    var val = (components .range .min + (components .range .max - components .range .min) * x);
                    label_dom .textContent = val .toFixed (0);
                    tenure ({ scale: x, val: val });
                    tenure .end (true);
                }
            }
            else
                return decline_ (intent)
        })); 
        _ .intent (['drag', 0]);
        
        return R .merge (_) ({
            dragger_dom: dragger_dom,
            label_dom: label_dom,
            marked_dom: marked_dom,
            range: range,
            marked_tween: marked_tween,
            dragger_tween: dragger_tween,
            slider_timeline: slider_timeline
        });
    };
    
    var history_interaction = function (components) {
        var bmi = components .bmi;
        var diary = components .diary;
        var save = components .save;
        var show = components .show;
        var delta = components .delta;
        
        
        
        
        var weekly_doms = diary .querySelectorAll ('[text]');

        
        var flash = TweenMax .to (bmi, 0.15, {
            scale: 0.1,
			transformOrigin: '50% 50%',
            yoyo: true,
			repeat: -1,
            paused: true
        });
        var flasher = new TimelineMax ({paused:true});
        flasher .add (flash .play ());
        
        stream_from_click_on (save) .thru (tap, function () {
            api () .bmi .to ((api () .bmi .from () || []) .concat ([[+ new Date (), bmi .querySelector ('[text]') .textContent]]));
            flasher .tweenFromTo (0, 0.3);
        });
        var showing = interaction_case ({
            off: undefined,
            on: diary
        });
        stream_from_click_on (show) .thru (tap, function () {
            showing .intent (['off', 'on']);
            diary .setAttribute ('interactable', '');
        });
        stream_from_click_on (diary) .thru (tap, function () {
            showing .intent (['on', 'off']);
            diary .removeAttribute ('interactable');
        });
        
        showing .intent (['on', 'off']);

        var start_of_week = function () {
            var d = new Date ();
            var day = d .getDay (),
            diff = d .getDate () - day + (day == 0 ? -6 : 1); // adjust when day is sunda
            d .setDate (diff);
            d .setHours (0);
            d .setMinutes (0);
            d .setSeconds (0);
            return new Date (d);
        };

        mergeAll ([stream (api () .bmi .from ()), api () .bmi .from])
            .thru (map, R .cond ([
                [R .is (Array), R .pipe (
                    R .groupBy (function (record) {
                        var date = record [0];
                        var weeks_before = Math .ceil ((start_of_week () - date) / (1000 * 60 * 60 * 24 * 7));
                        return weeks_before;
                    }),
                    R. map (R .sortBy (R .prop (0))),
                    R. map (R .pipe (R .last, R .prop (1)))
                )],
                [R .T, R .always ({})]
            ])) .thru (tap, function (weekly_bmi) {
                [0, 1, 2, 3, 4, 5, 6, 7, 8] .forEach (function (week) {
                    weekly_doms [week] .textContent = weekly_bmi [week] || '-';
                });
                delta .textContent = weekly_bmi [1] && weekly_bmi [0] ? weekly_bmi [0] - weekly_bmi [1] : '-';
            })
    };
    
    var interaction_ = function (components, unions) {
        var back = components .back;
        var bmi = components .bmi;
        var height = components .height;
        var weight = components .weight;
        
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
        
        mechanism (function () {
            return (weight .state () .val / (height .state () .val * height .state () .val / 10000)) .toFixed (1)
        }, [height .state, weight .state])
        .thru (tap, function (x) {
            bmi .intent (['label', x])
        });

        return R .merge (_) (components);
    };
    
    window .uis = R .assoc (
        'bmi', function (components, unions) {
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

            var bmi_dom = dom .querySelector ('#bmi [text]');

            var height_dom = dom .querySelector ('#height');
            var height_label_dom = height_dom .querySelector ('#label');
            var height_marked_scale_dom = height_dom .querySelector ('#marked-scale');
            var height_text_dom = height_dom .querySelector ('[text]');

            var weight_dom = dom .querySelector ('#weight');
            var weight_label_dom = weight_dom .querySelector ('#label');
            var weight_marked_scale_dom = weight_dom .querySelector ('#marked-scale');
            var weight_text_dom = weight_dom .querySelector ('[text]');

            var diary_dom = dom .querySelector ('#diary');

            var diary_save_dom = dom .querySelector ('#record[action]');
            var diary_show_dom = dom .querySelector ('#history[action]');
            var diary_delta_dom = dom .querySelector ('#delta [text]');

            return R .merge ({
                dom: dom
            }) (interaction_ (
                {
                    back: back_stream,
                    bmi: _label_interaction (bmi_dom),
                    height: _slider_interaction ({
                        dragger: height_label_dom,
                        label: height_text_dom,
                        marked: height_marked_scale_dom,
                        range: {
                            min: 50,
                            max: 200
                        }
                    }),
                    weight: _slider_interaction ({
                        dragger: weight_label_dom,
                        label: weight_text_dom,
                        marked: weight_marked_scale_dom,
                        range: {
                            min: 10,
                            max: 150
                        }
                    }),
                    history: history_interaction ({
                        diary: diary_dom,
                        bmi: bmi_dom .closest ('g'),
                        save: diary_save_dom,
                        show: diary_show_dom,
                        delta: diary_delta_dom
                    })
                },
                {
                    nav: nav
                }
            ));
        }) (window .uis);
} ();
