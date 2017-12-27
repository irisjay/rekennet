var path = require ('path');

var package_root = require ('get-root-path') .rootPath;

var src_hci_path = path .join (package_root, '/src/hci');
var dist_path = path .join (package_root, '/dist/build/hci');

module .exports = {
	paths: {
		src: src_hci_path,
		dist: dist_path,
		primary: {
			src: path .join (src_hci_path, '/$.html'),
			dist: path .join (dist_path, '/index.html')
		},
		assets: {
			src: path .join (src_hci_path, '/assets'),
			dist: path .join (dist_path, '/assets')
		},
		frames: {
			src: path .join (src_hci_path, '/frames')
		},
		uis: {
			src: path .join (src_hci_path, '/ui/page'),
			dist: path .join (dist_path, '/scripts/ui.js'),
			hydrators_dist: path .join (dist_path, '/scripts/ui-hydrators.js')
		},
		scripts: {
			src: path .join (src_hci_path, '/scripts'),
			dist: path .join (dist_path, '/scripts')
		},
		pages: {
			src: path .join (src_hci_path, '/ui/page')
		},
		tags: {
			src: path .join (src_hci_path, '/ui'),
			dist: path .join (dist_path, '/scripts/tags.js'),
			strs_dist: path .join (dist_path, '/scripts/tags-strs.js')
		},
		styles: {
			src: path .join (src_hci_path, '/styles'),
			dist: path .join (dist_path, '/styles/styles.css'),
			
			cache: path .join (package_root, '/temp/styles/cache'),
			copy: path .join (package_root, '/temp/styles/copy')
		},
		ama: {
			cache: path .join (package_root, '/temp/ama/cache')
		}
	}
}
