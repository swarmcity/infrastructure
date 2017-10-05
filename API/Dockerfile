FROM node:6
WORKDIR /root
ENV HOME /root
COPY package.json ./
RUN npm install

COPY handlers ./handlers
COPY socket.js ./


EXPOSE 8011
CMD [ "node", "socket.js" ]