FROM node:8

RUN wget https://dist.ipfs.io/go-ipfs/v0.4.4/go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN tar xvfz go-ipfs_v0.4.4_linux-amd64.tar.gz
RUN mv go-ipfs/ipfs /usr/local/bin/ipfs

WORKDIR /
COPY init.sh /init.sh
RUN /init.sh
COPY server.sh /server.sh

COPY package.json package.json
COPY server.js server.js
RUN npm install

EXPOSE 5001
EXPOSE 4001
EXPOSE 9000

ENTRYPOINT /server.sh
