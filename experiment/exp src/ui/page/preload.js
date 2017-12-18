var preloading = Promise .all (
    pre (function () {
        var root_path = require ('./config') .paths .src;
        var files = require ('./util') .files ('');
        return files (require ('./config') .paths .assets .src)
            .filter (function (x) {
                return ! x .endsWith ('.mp4') && ! x .endsWith ('.ttf');
            })
            .map (function (x) {
                return x .slice (root_path .length + 1);
            })
    }) .map (function (url) {
        return promise_of (function (resolve, reject) {
            var x = new Image ();
            x .src = url
            x .style .position = 'absolute';
            x .style .visibility = 'hidden';
            document .addEventListener ('DOMContentLoaded', function () {
                document .body .insertBefore (x, document .body .firstChild);
                if (x .complete) {
                    document .body .removeChild (x);
                    resolve ();
                }
                else {
                    x .addEventListener ('load', function () {
                        document .body .removeChild (x);
                        resolve ();
                    })
                    x .addEventListener ('error', function (e) {
                        report (e);
                        document .body .removeChild (x);
                        reject ();
                    })
                }
            })
        })
    })
);