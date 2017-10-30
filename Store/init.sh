#!/bin/bash

export IPFS_PATH=/ipfsrepo

RUN ipfs init
RUN ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001

RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
