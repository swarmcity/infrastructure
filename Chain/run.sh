#!/bin/bash
docker run                                                      \
  -v /tmp/parity/:/root/.local/share/io.parity.ethereum/        \
  -p 8080:8080 -p 8180:8180 -p 8545:8545 -p 8546:8546           \
    psdev/swarmcitychain:v1.7.2-0                               \
      --ws-interface all --ws-origins all --ws-hosts all        \
      --jsonrpc-hosts all                                       \
      --ui-interface 0.0.0.0 --ui-hosts all --ui-no-validation
