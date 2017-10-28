#!/bin/bash
docker run -d                                                   \
  -v /tmp/geth/:/root                                           \
  -p 8545:8545 -p 8546:8546 -p 30303:30303                      \
    ethereum/client-go:release-1.7                              \
      --fast --cache=512                                        \
      --ws --wsaddr 0.0.0.0 --wsport 8546                       \
      --wsorigins '*' --wsapi 'eth,net,web3,shh'                \
      --shh
