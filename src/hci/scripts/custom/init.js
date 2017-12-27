/*
Errors
*/
var report = from (function (_) {
	riot .util .tmpl .errorHandler = 	function (err) {
	                                        err ._origin = 'riot-tmpl';
	                                        _ (err);
										}
	window .addEventListener ('unhandledrejection', function (e) {
		e .preventDefault ();
		
        e ._origin = 'promise';
        _ (e);
	});
	window .onerror = 	function (message, source, lineno, colno, error) {
	                        var err = arguments;
                            err ._origin = 'window';
                            _ (err);
						};
}) .thru (tap, function (e) {
    console .error (e);
});

//Promise .longStackTraces ();

/*
Use app
*/
( typeof (cordova) !== 'undefined' ?
	    promise_of (function (x) {
	        document .addEventListener ('deviceready', x);
	    })
	:
	    promise_of (function (x) {
	        document .addEventListener ('DOMContentLoaded', x);
	    })		
)
.then (function () {
	window .ui_ = master_ui ();
});
