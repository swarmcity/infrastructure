FROM node:8
LABEL maintainer="admin@swarmcity.io"
WORKDIR /root
COPY package.json package.json
RUN npm install
COPY app.js app.js
COPY startup.sh startup.sh
CMD ./startup.sh
