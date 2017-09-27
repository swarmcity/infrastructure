![](http://i.imgur.com/NjzAc7S.png)

The dragon system serves to bring together best of breed distributed crypto technologies to deliver the fastest most streamlined user experience.

 [![NSP Status](https://nodesecurity.io/orgs/kiyotocrypto/projects/4b05306b-a168-4e69-8744-1c4b69439ce5/badge)](https://nodesecurity.io/orgs/kiyotocrypto/projects/4b05306b-a168-4e69-8744-1c4b69439ce5/badge)
![](https://travis-ci.org/kiyokocrypto/DragonSystem.svg?branch=master)

* Polymer
* PRPL Server
* Socket.io
* Keythereum 
* JSON Web Signatures
* Express with pm2 and Keymetrics
* GunDB
* Nginx
* go-etheruem

### Build site

`git clone https://github.com/DragonSystems/DragonSite.git`

`npm install`

`bower install`

`polymer build`

### Build custom docker image

`docker build -t docker.io/username/site:0.0.1-rc1 .`

### Run the docker image

`docker run -d -p 8080:8080  site:0.0.2`

On browser [http://localhost:8080](http://localhost:8080)

