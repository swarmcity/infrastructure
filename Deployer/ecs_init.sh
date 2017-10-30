#!/bin/bash

yum -y update
#yum -y install python-pip
yum -y install python
curl "https://bootstrap.pypa.io/get-pip.py" -o "get-pip.py"
sudo python get-pip.py
pip install awscli --upgrade --user