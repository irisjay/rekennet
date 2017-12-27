#!/usr/bin/env bash
cd "$(dirname "$(readlink -f "$0")")"

package_root="$(npm root | xargs dirname)"

if [ -d "${package_root}/dist/cordova/android" ]; then
	rm -r "${package_root}/dist/cordova/android"
fi;

mkdir "${package_root}/dist/cordova/android"
cd "${package_root}/dist/cordova/android"

find "${package_root}/dist/cordova/$" -mindepth 1 -maxdepth 1 -print0 \
	| xargs -0 ln -s --target-directory=.

cp --remove-destination "$(readlink -f config.xml)" config.xml
echo "$(cat config.xml | grep -Ev "$(cat config.xml \
                | grep "engine\ name=\"" \
                | sed "s/^.\+name=\"\([^\"]\+\)\".\+/\1/" \
                | grep -v android \
                | sed "s/\(.\+\)/engine\ name=\"\1\"/" \
		| paste -sd "|" -
        )"
)" > config.xml

cordova prepare
cordova-splash
cordova-icon
#maybe no need www?
#zip -r cordova-android.zip config.xml www/ platforms/ plugins/
