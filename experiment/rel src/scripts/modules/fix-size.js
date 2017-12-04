document .addEventListener ('DOMContentLoaded', function () {
	from (function (widths) {
		widths (window .innerWidth);
		window .addEventListener ('resize', function () {
			widths (window .innerWidth);
		});
	})
	.thru (dropRepeats)
	.thru (map, function (width) {
		return { width: width, height: window .innerHeight };
	})
	.thru (tap, function (size) {
		document .body .style .setProperty ('width', size .width + 'px', 'important');
		document .body .style .setProperty ('height', size .height + 'px', 'important');
	});	
})