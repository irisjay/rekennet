#!/bin/bash
./__clear.sh
for (( i=0; i<30; i++ )); do
    screen -dmS "s"$i"s" bash ./__req.sh
done
