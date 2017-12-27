#!/bin/bash    
HOST="vps8275.youdomain.hk"
USER="kodingkingdom"
PASS="PL@bb5qZ3m"
FTPURL="ftp://$USER:$PASS@$HOST"
LCD="/home/ubuntu/workspace/platforms/browser/www"
RCD="/web/o"
#DELETE="--delete"
lftp -c "set ftp:list-options -a;
open '$FTPURL';
lcd $LCD;
set cmd:fail-exit yes
cd $RCD;
mirror --reverse \
       $DELETE \
       --verbose"