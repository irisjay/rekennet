#!/usr/bin/env bash
cd "$(dirname "$(readlink -f "$0")")"

package_root="$(npm root | xargs dirname)"

. ~/.nvm/nvm.sh
nvm use 7.1.0
[ "$(node --version)" = "v7.1.0" ] || {
	echo "couldn't change to node v7.1.0"
	exit 1
}

[ -d "${package_root}/dist/build/hci" ] || {
	echo "dist/build/hci doesn't exist"
	exit 1
}

node "$.js" || {
	echo "webapp failed"
	exit 1
}
