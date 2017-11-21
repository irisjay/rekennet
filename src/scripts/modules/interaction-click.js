var click = function (dom, handler) {
    dom ._click_stream .thru (on, handler);
};
/*var unclick = function (dom, handler) {
};*/

var stream_from_click_on = function (dom) {
    if (! dom ._click_stream) {
        dom ._click_stream = stream ();
        
        var listener = R .cond ([
            [function () {return window .dragging}, noop],
            [R .T, dom ._click_stream]
        ]);
        
        dom .setAttribute ('interactable', '');
        [document .ontouchend ? 'touchend' : 'click'] .forEach (function (click) {
            dom .addEventListener (click, listener)
        });
        dom ._click_stream .end .thru (tap, function () {
            [document .ontouchend ? 'touchend' : 'click'] .forEach (function (click) {
                dom .removeEventListener (click, listener)
            });
            dom .removeAttribute ('interactable');
        });
    }
    return dom ._click_stream;
}