#!/bin/bash
export IPFS_PATH=/ipfsrepo
ipfs daemon &
node server.js 
