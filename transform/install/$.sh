#!/usr/bin/env bash

echo
echo
echo checking screen...
if dpkg-query -l screen; then
    echo screen already installed
else
    echo trying install screen...
    sudo apt-get update
    sudo apt-get install screen
fi

echo
echo
echo checking nvm version...
. ~/.nvm/nvm.sh
nvm install 7.1.0
nvm alias default node

echo
echo
echo checking npm version...
if ! npm outdated -g npm | grep -z npm; then
    echo npm is up to date
else
    echo trying to update npm...
    npm install -g npm
fi

echo
echo
echo checking cordova...
if npm list -g cordova@8.0.0; then
    echo cordova already installed
else
    echo trying install cordova...
    npm install -g cordova@8.0.0
fi

cd "$(sudo dirname "$(readlink -f "$0")")"
cd "$(npm root | xargs dirname)"

echo
echo
echo installing npm packages...
npm install

echo
echo
echo refreshing amas...
./quick/refresh
