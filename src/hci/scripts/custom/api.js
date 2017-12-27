/*
	global stateful,
	global stringify,
	global R
*/

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

var config = {};

var api = stream ();	

var no_errors = R .cond ([
                    [ R .compose (R .not, R .is (Object)), R .F ],
                    [ R .T, R .pipe (R .prop ('error'), R .not) ]
                ]);

var logs = stream ();

var __routing = R .pipe (
    R .map (function (x) {
        return x .slice (1)
    }),
    R .invert,
    R .map (
        R .pipe (
            R .map (R .flip (R .prop) (_routing)),
            R .mergeAll)
    )
) (routes);
var routing = R .pipe (function (name_wherefrom, role) {
    return __routing [name_wherefrom] [role];
}, R .tap (function (x) {
    if (! x || ! page_exists (page_name (x)))
        throw new Error ('route not found')
}))

var api = {
    bmi: cycle_persisted ('bmi') (re_cycle ())
}