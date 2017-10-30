#!/bin/bash

# https://stackoverflow.com/questions/4249488/find-region-from-within-an-ec2-instance
EC2_AVAIL_ZONE=`curl -s http://169.254.169.254/latest/meta-data/placement/availability-zone`
EC2_REGION="`echo \"$EC2_AVAIL_ZONE\" | sed -e 's:\([0-9][0-9]*\)[a-z]*\$:\\1:'`"

`aws ecr get-login --no-include-email --region $EC2_REGION`
docker build -t swarmcity_ipfs .
docker tag swarmcity_ipfs:latest 599399774093.dkr.ecr.us-west-1.amazonaws.com/swarmcity_ipfs:latest
docker push 599399774093.dkr.ecr.us-west-1.amazonaws.com/swarmcity_ipfs:latest

