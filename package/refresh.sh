#!/usr/bin/env bash
DIR="$(sudo dirname "$(readlink -f "$0")")"
cd "$DIR"
cd ..

. package/refresh/amas.sh

{
	amas_refresh package
	amas_refresh test
	amas_refresh deploy
}
