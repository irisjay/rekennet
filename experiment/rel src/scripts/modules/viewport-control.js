var squeeze_ratio = 568 / 320;

var squeeze_css = document .createElement ("style");
squeeze_css .type = "text/css";
//squeeze_css .innerHTML = "strong { color: red }";
document .addEventListener ('DOMContentLoaded', function () {
    document .body .appendChild (squeeze_css);
});

var viewport_dimensions = stream ([window .innerWidth, window .innerHeight]);
window .addEventListener ('resize', function () {
	viewport_dimensions ([window .innerWidth, window .innerHeight]);
});

viewport_dimensions .thru (tap, function (dimensions) {
    var width = dimensions [0];
    var height = dimensions [1];
    
    if (height / width < squeeze_ratio) {
        squeeze_css .innerHTML =
            'body {' +
                'background: black;' + 
                'padding: 0 ' + (50 * (1 - height / (width * squeeze_ratio))) + '%;' + 
                'min-height: 100%;' +
                'min-width: 100%;' +
            '}' + 
            'body > [page]:not(splash) {' +
                'width: ' + (100 * height / (width * squeeze_ratio)) + '% !important;' +
            '}' +
            'body > splash {' +
                'margin-left: -' + (50 * (1 - height / (width * squeeze_ratio))) + '%;' +
            '}'
    }
    else {
        squeeze_css .innerHTML = '';
    }
})