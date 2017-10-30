FROM node:8

RUN wget https://dist.ipfs.io/go-ipfs/v0.4.4/go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN tar xvfz go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN mv go-ipfs/ipfs /usr/local/bin/ipfs

RUN ipfs init
RUN ipfs config Addresses.API /ip4/127.0.0.1/tcp/5001

RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
RUN ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"

WORKDIR /
COPY server.sh /server.sh

COPY package.json package.json
COPY server.js server.js
RUN npm install

EXPOSE 5001
EXPOSE 4001
EXPOSE 9000

ENTRYPOINT /server.sh
