+ function () {
    var ui_info = pre (function () {
        var dom = frame ('404');
        
        return {
            dom: serve (dom)
        }
    });
    
    window .uis = R .assoc (
        '404', function (_) {
            var dom = ui_info .dom .cloneNode (true);
            
            return {
                dom: dom
            };
        }) (window .uis);
} ();
