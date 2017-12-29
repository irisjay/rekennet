//var frontend_path = window .location .protocol + '//briansark-mumenrider.c9users.io';
//var backend_path = window .location .protocol + '//briansark-mumenrider.c9users.io/api';	

var routes = {
    default: '#splash',
    splash: '#splash',
    dashboard: '#dashboard',
    po_leung_kuk: '#po_leung_kuk',
    center: '#center',
    herbal_life: '#herbal_life',
    pedometer: '#pedometer',
    bmi: '#bmi',
    recipes: '#recipes',
    exercise: '#exercise',
    dance: '#dance',
    breakfast: '#breakfast',
    nutrition: '#nutrition',
    
    warmup: '#warmup',
    lowers: '#lowers'
}
var _routing = {
    splash: {
        start: routes .dashboard
    },
    dashboard: {
        back: routes .splash,
        po_leung_kuk: routes .po_leung_kuk,
        herbal_life: routes .herbal_life,
        pedometer: routes .pedometer,
        bmi: routes .bmi,
        recipes: routes .recipes,
        exercise: routes .exercise,
        center: routes .center,
        dance: routes .dance,
        breakfast: routes .breakfast,
        nutrition: routes .nutrition
    },
    po_leung_kuk: {
        back: routes .dashboard
    },
    herbal_life: {
        back: routes .dashboard
    },
    center: {
        back: routes .dashboard
    },
    pedometer: {
        back: routes .dashboard
    },
    bmi: {
        back: routes .dashboard
    },
    recipes: {
        back: routes .dashboard
    },
    breakfast: {
        back: routes .dashboard
    },
    nutrition: {
        back: routes .dashboard
    },
    dance: {
        back: routes .dashboard
    },
    exercise: {
        back: routes .dashboard,
        warmup: routes .warmup,
        lowers: routes .lowers
    },
    warmup: {
        back: routes .exercise
    },
    lowers: {
        back: routes .exercise
    }
};

var config = {/*
    koder: {
        choices: [
            {
                name: 'Nyan Cat',
                src: 'http://vignette1.wikia.nocookie.net/doawk/images/5/53/Giant_nyan_cat_by_daieny-d4fc8u1.png'
            },
            {
                name: 'Doge',
                src: 'https://vignette2.wikia.nocookie.net/animal-jam-clans-1/images/9/94/Doge_bread_by_thepinknekos-d9nolpe.png/revision/latest?cb=20161002220924'
            }
        ]
    }
*/};

var api = stream ();	
var promised_api = promise (api);

var no_errors = R .cond ([
                    [ R .compose (R .not, R .is (Object)), 
                    	R .F 
                	],
                    [ R .T,
                    	R .compose (R .not, R .prop ('error'))
                	]
                ]);

var logs = stream ();
var __routing = [routes]
    .map (R .map (window .page_name))
    .map (R .invert)
    .map (R .map (
		R .map (R .prop (R .__, _routing))
    ))
    .map (R .map (R .mergeAll))
[0];
var routing = R .pipe (
	function (name_wherefrom, role) {
	    return __routing [name_wherefrom] [role];
	}, 
	R .tap (function (x) {
	    if (! x || ! window .page_exists (window .page_name (x)))
	        throw new Error ('route not found')
	})
);

api ({
    bmi: cycle_persisted ('bmi') (re_cycle ())
})
