#!/usr/bin/env bash
cordova platform add android@latest
cordova-splash
cordova-icon
zip -r app.zip config.xml www/ platforms/ plugins/ merges/
cordova platform rm android