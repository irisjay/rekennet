riot.tag2('modules-loader', '<modules-modal-holder> <modules-loading-item></modules-loading-item> <yield></yield> </modules-modal-holder>', '', '', function(opts) {
	(function (self, args) {

	 self ._loaded = true;
	 self ._scope = function () {};
	self ._yield_levels = 0;
	self ._yield_level = 0;
	self ._yield_on = function () {   self ._yielding = true; self ._yield_level++; if (self ._yield_level > self ._yield_levels) self ._yield_levels = self ._yield_level; return ""; };
	self ._yield_off = function () {   self ._yielding = false; self ._yield_level--; return ""; };
	var _refs = mergeAll ([ from (function (when) { self .on ("mount", function () { when (self .refs); }); }), from (function (when) { self .on ("updated", function () { when (self .refs); }); }) ]) .thru (map, consistentfy)  ;
	var yield_scope = self .parent;
	while (yield_scope && yield_scope ._yield_levels) yield_scope = climb (yield_scope ._yield_levels, yield_scope);
	if (yield_scope && yield_scope .yielded_diff) _refs .thru (map, yield_refs) .thru (diff_refs) .thru (tap, yield_scope .yielded_diff);
	var self_diff = stream ();
	var yielded_diff = stream ();
	self .yielded_diff = yielded_diff ;
	var diffs = mergeAll ([ self_diff, yielded_diff ]);
	var ref = function (name) { return ref_diff (name, diffs) };
	var ref_set = function (name) { return ref_set_diff (name, diffs) };
	_refs .thru (map, self_refs) .thru (diff_refs) .thru (tap, self_diff);
	if (! self .update_strategy || self .update_strategy === "push") self .shouldUpdate = R .T;
	if (typeof self .update_strategy === "function") self .shouldUpdate = self .update_strategy;
	}) (this, this .opts);
});
riot.tag2('modules-loading-item', '<div> <spinner></spinner> </div>', '', '', function(opts) {
});
riot.tag2('modules-modal-holder', '<item> <yield></yield> </item>', '', '', function(opts) {
	(function (self, args) {

	 self ._loaded = true;
	 self ._scope = function () {};
	self ._yield_levels = 0;
	self ._yield_level = 0;
	self ._yield_on = function () {   self ._yielding = true; self ._yield_level++; if (self ._yield_level > self ._yield_levels) self ._yield_levels = self ._yield_level; return ""; };
	self ._yield_off = function () {   self ._yielding = false; self ._yield_level--; return ""; };
	var _refs = mergeAll ([ from (function (when) { self .on ("mount", function () { when (self .refs); }); }), from (function (when) { self .on ("updated", function () { when (self .refs); }); }) ]) .thru (map, consistentfy)  ;
	var yield_scope = self .parent;
	while (yield_scope && yield_scope ._yield_levels) yield_scope = climb (yield_scope ._yield_levels, yield_scope);
	if (yield_scope && yield_scope .yielded_diff) _refs .thru (map, yield_refs) .thru (diff_refs) .thru (tap, yield_scope .yielded_diff);
	var self_diff = stream ();
	var yielded_diff = stream ();
	self .yielded_diff = yielded_diff ;
	var diffs = mergeAll ([ self_diff, yielded_diff ]);
	var ref = function (name) { return ref_diff (name, diffs) };
	var ref_set = function (name) { return ref_set_diff (name, diffs) };
	_refs .thru (map, self_refs) .thru (diff_refs) .thru (tap, self_diff);
	var known_as = function (what) { return function (how) { log (self .root .localName, what, how);} };
	self .on ("update", function () {args = self .opts});

		    if (args .action__from)
		        args .action__from
		            .thru (tap, function (ref) {
		                ref .addEventListener ('click', function () {
		                    args .action__to (args .value__by ())
		                })
		            })

	if (! self .update_strategy || self .update_strategy === "push") self .shouldUpdate = R .T;
	if (typeof self .update_strategy === "function") self .shouldUpdate = self .update_strategy;
	}) (this, this .opts);
});
riot.tag2('modules-share-sheet', '<div class="Sheet unselected"> <div class="SheetContent"> <ul class="itemset"> <section each="{expression:modules-share-sheet:1}"> <div class="itemheader" if="{expression:modules-share-sheet:2}">{expression:modules-share-sheet:3}</div> <div class="stepstones" if="{expression:modules-share-sheet:4}"></div> <div class="itemcontainer" each="{expression:modules-share-sheet:5}"> <li><a title="{expression:modules-share-sheet:6}" subtext="{expression:modules-share-sheet:7}"> <img class="appicon" riot-src="{expression:modules-share-sheet:8}"> {expression:modules-share-sheet:9} </a></li> </div> </section> </ul> <h2 class="cancel">Cancel</h2> </div> </div>', '', '', function(opts) {
	(function (self, args) {

	 self ._loaded = true;
	 self ._scope = function () {};
	var known_as = function (what) { return function (how) { log (self .root .localName, what, how);} };
	self .on ("update", function () {args = self .opts});

		    self .on ('mount', function () {
		        self .root .toggle = function () {
		            toggleSheet (self .root .querySelector ('.Sheet'));
		        };
		        self .root .selected = stream ();

		        [] .forEach .call (self .root .querySelectorAll ('.itemcontainer a[title]'), function (a) {
		            a .addEventListener ('click', function () {
		        		offSelectedSheet();
		                self .root .selected (a .getAttribute ('subtext'));
		            })
		        });

		        [] .forEach .call (self .root .querySelectorAll('.cancel'), function (element) {
		        	element.addEventListener('touchstart', function() {
		        		element.classList.add('touched');
		        	});

		        	element.addEventListener('touchend', function() {
		        		element.classList.remove('touched');
		        	});

		        	element.addEventListener('click', function() {
		        		offSelectedSheet();
		        		self .root .selected (undefined);
		        	});
		        })
		    });

		    function toggleSheet (sheet) {
		    	if (sheet.classList.contains('selected') ) {
		    		sheet.classList.remove('selected');
		    		sheet.classList.add('unselected');
		    		sheet.classList.remove('loaded');
		    		sheet.blur();

		    		layer_off();
		    	}
		    	else {
		    		sheet.classList.add('selected');
		    		sheet.classList.remove('unselected');
		    		sheet.classList.add('loaded');
		    		sheet.focus();

		    		layer_on();
		    	}
		    }

		    var layer_on = function () {
		        if (! document.querySelector('body > .darklayer')) addDarklayer ();
		        onDarkLayer ();
		    };
		    var layer_off = function () {
		        if (document.querySelector('body > .darklayer')) {
		            offDarkLayer ();
		            setTimeout (removeDarkLayer, 250);
		        }
		    };

		    function addDarklayer() {
		    	var element = document.createElement("div");
		    	element.setAttribute('class', 'darklayer off');
		    	element.addEventListener('click', function() {
		        	offSelectedSheet();
		        });
		    	document.body.appendChild(element);
		    }

		    function onDarkLayer() {
		    	var darkLayer = document.querySelector('body > .darklayer');
		    	darkLayer.classList.add('loaded');
		    	darkLayer.classList.remove('off');
		    	darkLayer.classList.add('on');
		    }

		    function offDarkLayer() {
		    	var darkLayer = document.querySelector('body > .darklayer');
		    	darkLayer.classList.remove('on');
		    	darkLayer.classList.add('off');
		    }

		    function removeDarkLayer() {
		    	var darkLayer = document.querySelector('body > .darklayer');
		    	darkLayer .parentNode .removeChild (darkLayer);
		    }

		    function offSelectedSheet() {
		    	selectedSheet = document.querySelector('.Sheet.selected');
		    	selectedSheet.blur();
		    	selectedSheet.classList.remove('selected');
		    	selectedSheet.classList.add('unselected');

		    	offDarkLayer();
		    }

	self .expressions = {};

	self .expressions [0] = function (_item) { return  args .items  };
	self .expressions [1] = function (_item) { return  _item .header  };
	self .expressions [2] = function (_item) { return  _item .header  };
	self .expressions [3] = function (_item) { return  _item .header  };
	self .expressions [4] = function (_item) { return  _item .items  };
	self .expressions [5] = function (_item) { return  _item .title  };
	self .expressions [6] = function (_item) { return  _item .subtext  };
	self .expressions [7] = function (_item) { return  _item .image  };
	self .expressions [8] = function (_item) { return  _item .title  };
	if (typeof self .update_strategy === "function") self .shouldUpdate = self .update_strategy;
	}) (this, this .opts);
});
riot.tag2('modules-snackbar', '<snackbar> <item> <yield></yield> </item> </snackbar>', '', '', function(opts) {
	(function (self, args) {

	 self ._loaded = true;
	 self ._scope = function () {};
	self ._yield_levels = 0;
	self ._yield_level = 0;
	self ._yield_on = function () {   self ._yielding = true; self ._yield_level++; if (self ._yield_level > self ._yield_levels) self ._yield_levels = self ._yield_level; return ""; };
	self ._yield_off = function () {   self ._yielding = false; self ._yield_level--; return ""; };
	var _refs = mergeAll ([ from (function (when) { self .on ("mount", function () { when (self .refs); }); }), from (function (when) { self .on ("updated", function () { when (self .refs); }); }) ]) .thru (map, consistentfy)  ;
	var yield_scope = self .parent;
	while (yield_scope && yield_scope ._yield_levels) yield_scope = climb (yield_scope ._yield_levels, yield_scope);
	if (yield_scope && yield_scope .yielded_diff) _refs .thru (map, yield_refs) .thru (diff_refs) .thru (tap, yield_scope .yielded_diff);
	var self_diff = stream ();
	var yielded_diff = stream ();
	self .yielded_diff = yielded_diff ;
	var diffs = mergeAll ([ self_diff, yielded_diff ]);
	var ref = function (name) { return ref_diff (name, diffs) };
	var ref_set = function (name) { return ref_set_diff (name, diffs) };
	_refs .thru (map, self_refs) .thru (diff_refs) .thru (tap, self_diff);
	if (! self .update_strategy || self .update_strategy === "push") self .shouldUpdate = R .T;
	if (typeof self .update_strategy === "function") self .shouldUpdate = self .update_strategy;
	}) (this, this .opts);
});
