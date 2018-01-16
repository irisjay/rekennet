#!/usr/bin/env bash
[[ `uname` == 'Darwin' ]] && { [ -d "/usr/local/opt/coreutils/libexec/gnubin" ] || { echo "gnu tools not found"; exit 1; } && PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"; }
cd "$(dirname "$0")"

. ~/.nvm/nvm.sh 
package_root="$(npm root | xargs dirname)"

nvm use 7.1.0 > /dev/null
[ "$(node --version)" = "v7.1.0" ] || {
	echo "couldn't change to node v7.1.0"
	exit 1
} && [ -d "${package_root}/dist/cordova/$" ] || {
	echo "dist/cordova/$ doesn't exist"
	exit 1
} && . ./_$.sh || {
	echo "cordova/ios failed"
	exit 1
}
