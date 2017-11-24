#!/usr/bin/env bash
cordova platform add ios@4.5.2
cordova-splash
cordova-icon; 
zip -r app.zip config.xml www/ platforms/ plugins/ merges/
cordova platform rm ios