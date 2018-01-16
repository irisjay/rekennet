#!/usr/bin/env bash

if [[ `uname` == 'Darwin' ]]; then
	echo checking gnu tools...
	if [ -d "/usr/local/opt/coreutils/libexec/gnubin" ]; then
    		echo gnu tools already installed
		PATH="/usr/local/opt/coreutils/libexec/gnubin:$PATH"
	else
		command -v brew || { 
			echo please install homebrew; 
			echo see https://github.com/Homebrew/install;
			exit 1;
		}
		brew install coreutils
	fi
	echo
	echo
fi

echo checking nvm version...
[ -e ~/.nvm/nvm.sh ] || {
	echo please install nvm;
	echo see https://github.com/creationix/nvm#installation;
	exit 1;
} && . ~/.nvm/nvm.sh 
nvm install 7.1.0 && \
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
echo
echo

cd "$(sudo dirname "$(readlink -f "$0")")"
cd "$(npm root | xargs dirname)"

echo installing npm packages...
npm install
echo
echo

echo refreshing amas...
./quick/refresh
echo
echo
