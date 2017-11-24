#!/bin/bash    
rsync -avL --progress -e "ssh -i /home/ubuntu/workspace/deploy/PLK.pem" \
       /home/ubuntu/workspace/platforms/browser/www/* \
       ubuntu@ec2-52-15-185-191.us-east-2.compute.amazonaws.com:/var/www/html/o
