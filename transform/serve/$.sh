#!/usr/bin/env bash
cd "$(dirname "$(readlink -f "$0")")"

package_root="$(npm root | xargs dirname)"

. ~/.nvm/nvm.sh
nvm use 7.1.0 > /dev/null
[ "$(node --version)" = "v7.1.0" ] || {
	echo "couldn't change to node v7.1.0"
	exit 1
}

[ -d "${package_root}/dist/webapp" ] || {
	echo "dist/webapp doesn't exist"
	exit 1
}

node "$.js"
