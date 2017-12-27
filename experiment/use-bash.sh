#!/usr/bin/env bash
function lls { 
	ls -1 --group-directories-first "${@}"
}

function vvim {
	vim "+set shortmess=I" "+color murphy" "+set nowrap" "${@}"
}

__screen_config=$(mktemp)
(echo "layout save default"; echo "defutf8 on"; echo "utf8 on on";) > ${__screen_config}
function sscreen {
	screen -U -c "$__screen_config" "${@}"
}
