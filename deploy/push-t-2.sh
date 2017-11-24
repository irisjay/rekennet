#!/bin/bash    
rsync -avL --progress -e "ssh -i /home/ubuntu/workspace/deploy/PLK-1.pem" \
       /home/ubuntu/workspace/platforms/browser/www/* \
       ubuntu@ec2-18-221-198-187.us-east-2.compute.amazonaws.com:/var/www/html/o
