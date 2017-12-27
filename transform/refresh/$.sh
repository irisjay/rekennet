#!/usr/bin/env bash
cd "$(sudo dirname "$(readlink -f "$0")")"

if [ -f ./amas.sh ]; then
	. ./amas.sh
elif [ -f ./.amas.sh ]; then
	. ./.amas.sh
else
	>&2 echo "amas refresher not found"
	exit 1
fi

cd "$(npm root | xargs dirname)"

{
	amas_refresh src/hci/assets
	amas_refresh transform/build
	amas_refresh transform/deploy
	amas_refresh transform/refresh
	amas_refresh transform/install

	{
		cd transform/refresh
		if [ -f ./amas.sh ] && [ -f ./.amas.sh ]; then
			rm ./.amas.sh
		fi
		if [ -f ./.gitignore ]; then
			rm ./.gitignore
		fi
	}

	exit
}
