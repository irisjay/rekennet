#!/bin/bash

function killtree {
    local _pid=$1
    echo "$pid"
    for _child in $(ps -o pid --no-headers --ppid ${_pid}); do
        killtree ${_child}
    done
    sudo kill -TERM ${_pid}
}

screen -wipe

for (( i=0; i<30; i++ )); do
    if screen -list | grep -q "s"$i"s"; then
        pid="$(screen -ls | grep "s"$i"s" | grep -o [0-9]* | head -1)"
        killtree $pid
    fi
done
