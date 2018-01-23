//var frontend_path = window .location .protocol + '//briansark-mumenrider.c9users.io';
//var backend_path = window .location .protocol + '//briansark-mumenrider.c9users.io/api';	

var routes = {
    default: '#dashboard'
}
var _routing = {
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

