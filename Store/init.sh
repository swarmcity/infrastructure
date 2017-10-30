#!/bin/bash

export IPFS_PATH=/ipfsrepo

ipfs init
ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001

ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
