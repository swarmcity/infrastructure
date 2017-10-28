#!/bin/bash
docker run -d                                                   \
  -p 4001:4001 -p 5001:5001 -p 9000:9000                        \
    swarmcity_ipfs
