![](http://i.imgur.com/NjzAc7S.png)

The Dragon System is a production class development framework and API for Ethereum web apps.

At the moment dragon-system will only work on Mac OSX and Linux. 

### Install dependencies

- nodejs

   Install [nodejs](https://nodejs.org/en/download/package-manager/) v6.X.X LTS version.

- npm

   Make sure you have installed latest npm. You can run `sudo npm install -g npm`.

- git

   Install [git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) commandline tool.

- docker

   Install [docker](https://docs.docker.com/engine/installation). The community edition (docker-ce) will work. In Linux make sure you grant permissions to the current user to use docker by adding current user to docker group, `sudo usermod -aG docker $USER`. Once you update the users group, exit from the current terminal and open a new one to make effect.

- docker-compose

   Install [docker-compose](https://docs.docker.com/compose/install)
   
**Note**:- Make sure you can run `git`, `docker ps`, `docker-compose` without any issue and without sudo command.

### Install dragon-system

`sudo npm install -g dragon-system`

### Run a test setup

Create a workplace (you can use any name for the directory) where you clone the DragonSite and DragonAPI.

`mkdir dragon-workspace`

Change the directory to that directory

`cd dragon-workspace`

**Whenever you run `dragon` commands, make sure you run it within this directory**.

#### Initialize the system

`dragon init`

```         _                                             _                     
      __| |_ __ __ _  __ _  ___  _ __    ___ _   _ ___| |_ ___ _ __ ___      
     / _` | '__/ _` |/ _` |/ _ \| '_ \  / __| | | / __| __/ _ \ '_ ` _ \     
    | (_| | | | (_| | (_| | (_) | | | | \__ \ |_| \__ \ ||  __/ | | | | |    
     \__,_|_|  \__,_|\__, |\___/|_| |_| |___/\__, |___/\__\___|_| |_| |_|    
                     |___/                   |___/                           
                                                                   v0.01
? Site domain name: www.drageth.com
? API domain name: sws.drageth.com
? NS1 API key: <20 character api key>
? Debug mode enabled or disabled? Enable
? Continue on installation? Yes
```

**Note**:-  You have to obtain an NS1 API key and two domain to proceed. 

After running the `dragon init` you can see the cloned site and api repos in the directory by running an `ls`

`ls`

```[localhost dragon-workplace]$ ls
DragonAPI  DragonSite
```

#### Build the cloned source of Site and API

`dragon build`

**Note**:- This will take sometime and you will feels like its hanged. But give some time since its building the source.


#### Pull docker images from docker hub

`dragon pull`

**Note**:- This will take some time in the initial run since it has to grab all images from the docker hub.

#### Start docker containers

`dragon start`

```Starting up docker containers ... 

Update /etc/hosts entries to verify the setup.
$ sudo vim /etc/hosts
Add following lines to the file
127.0.0.1 www.drageth.com
127.0.0.1 sws.drageth.com
Save and exit using '<Esc> :wq'
```

#### Verify docker are running properly

`dragon ps`

```     Name               Command         State            Ports                                  
----------------------------------------------------------------------
dragon_certs_1    /bin/sh -c /startup   Up      80/tcp                                                                 
dragon_chain_1    /parity/parity        Up      0.0.0.0:8080->8080/tcp
dragon_proxy_1    /bin/sh -c /startup   Up      0.0.0.0:443->443/tcp, 
dragon_site_1     node server.js        Up      8080/tcp                                                               
dragon_api_1      node socket.js        Up      8011/tcp                                                               
dragon_store_1    /bin/sh -c /startup   Up      4001/tcp, 5001/tcp, 90
```

**Note**:- Make sure all 6 services are `Up`. If not use the following `dragon logs <option>` to go through each failed components log and find the issue. In general if the *certs* failed it will result to fail proxy service. If an *site* or *API* service fail it will result to fail the proxy service again. First make sure *certs* is working and got proper certificates. Then *API* and *site* is up and running. *Proxy* service after that. And finally store and chain. 

#### Check logs of each system

`dragon logs <certs/site/api/>`

`dragon logs certs`

```Attaching to dragon_certs_1
certs_1   | Reading environment variables ...
certs_1   | SITE_HOSTNAME=www.drageth.com
certs_1   | API_HOSTNAME=sws.drageth.com
certs_1   | SSL_API_KEY=***********900
certs_1   | Certs already exist for domain : www.drageth.com
certs_1   | Certs already exist for domain : sws.drageth.com
certs_1   | Starting ... 
certs_1   | 172.18.0.7 - - [14/Sep/2017 14:42:33] "GET / HTTP/1.1" 200 -
certs_1   | Cron is running - Thu Sep 14 14:43:02 UTC 2017
certs_1   | Cron is running - Thu Sep 14 14:44:01 UTC 2017
certs_1   | Cron is running - Thu Sep 14 14:45:01 UTC 2017
certs_1   | Cron is running - Thu Sep 14 14:46:01 UTC 2017
```

#### Stop the setup 

`dragon stop`

#### Forcefully kill (optional)

`dragon kill`

#### Remove stopped/killed container volumes

`dragon rm`

### Build your own site

First of all run a test setup, it will validate the environment and install basic images for you.

#### Modify source code

Update the code in the `dragon-workplace`. If there is *a setup running make sure to stop/kill it and clean container volues*. That is because we are using caching in both browser and proxy level. Though you clean the browser cache sometimes you will get content from the proxy cache wich is out-dated with your change.

#### Stop existing running services.

`dragon kill`

#### Clear volumes to clear cache.

`dragon rm`

#### Build the modified code.

`dragon build`

```[localhost DragonSite]$ dragon build
? Build component Site
? Image tag name:  docker.io/username/customname:0.0.1-rc1
Building code for Site ... 
```

#### Start the service.


`dragon start`

```Starting up docker containers ... 

Update /etc/hosts entries to verify the setup.
$ sudo vim /etc/hosts
Add following lines to the file
127.0.0.1 www.drageth.com
127.0.0.1 sws.drageth.com
Save and exit using '<Esc> :wq'
```

TODO: Build docker images with new changes.

### Clean the environment

You can follow below steps to clean your environment.

- `sudo npm uninstall -g dragon-system`

- `sudo rm -rf $USER/.dragon`

   <sup>Use `sudo` since docker will create a directory called 'ssl' to mount in to the cert docker image as root user.</sup>

- `docker rm $(docker ps -aq)`

- `docker rmi $(docker images | awk '/dragon/{print $3}')`

