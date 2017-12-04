var sheet = function (items) {
    if (sheet .type === 'cordova') {
        return promise_of (function (resolve, reject) {
            var options = {
                androidTheme: window .plugins .actionsheet .ANDROID_THEMES .THEME_DEVICE_DEFAULT_LIGHT, // default is THEME_TRADITIONAL
                title: '',
                subtitle: '', // supported on iOS only
                androidEnableCancelButton: true, // default false
                winphoneEnableCancelButton: true, // default false
                buttonLabels: items,
                position: [20, 40] // for iPad pass in the [x, y] position of the popover
            };
            window .plugins .actionsheet .show (options, function (i) {
                return items [i - 1];
            });
        })
    }
    else {
        if (sheet .on) sheet .off ();
		sheet .on = true;
		sheet ._ = riot .mount (document .createElement ('modules-share-sheet'), 'modules-share-sheet', {
		    items: [items]
		        /*.map (R .toPairs)
		        .map (R .map (function (pair) {
		            return {
		                title: pair [0],
		                image: pair [1]
		            }
		        }))*/
		    [0]
		}) [0];
		return promise_of (function (resolve) {
    		document .body .insertBefore (sheet ._ .root, null);
    		sheet ._ .root .toggle ();
    		promise (sheet ._ .root .selected) .then (R .tap (function () {
    		    sheet .on = false;
    		})) .then (resolve)
		})

    }
    return null;
};
sheet .off = function () {
    if (sheet .type === 'cordova')
        window .plugins .actionsheet .hide ();
    else if (sheet .on) {
		sheet .on = false;
		sheet ._ .root .toggle ();
		setTimeout (function () {
		    document .body .removeChild (sheet ._ .root);
		}, 250);
    }
};


sheet .type = 'browser';//(cordova .platformId === 'browser') ? 'browser' : 'cordova';
sheet .on = false;