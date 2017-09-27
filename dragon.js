#!/usr/bin/env node

var cmd = require('commander');
var figlet = require('figlet');
var chalk = require('chalk');
var inquirer = require('inquirer');
var shell = require('shelljs');
var validator = require('validator');
var path = require('path');
var os = require('os');
var sleep = require('system-sleep');
var ProgressBar = require('progress');
var logger = require('winston');
var properties = require ("properties");

shell.config.silent = true;
var homeDir = path.join(os.homedir(), ".dragon");
var debug = "Enable";
var site = "www.example.com";
var api = "api.example.com";
var apiKey = "12345678901234567890";
var siteImage = "latest"
var apiImage = "latest"
var storeImage = "latest"
var certsImage = "latest"
var proxyImage = "latest"
var logfile = path.join(homeDir, "dragon.log");
var confFile = path.join(homeDir, ".env");
var platformFile = path.join(homeDir, "platform.env");

shell.mkdir('-p', homeDir);

logger.add(logger.transports.File, {filename: logfile});
logger.remove(logger.transports.Console);

cmd.option('ps', 'Show running status')
  .option('init', 'initialize configurations')
  .option('get [name]', 'fetch code from git to current directory',/^(Site|Api|Store|Proxy|Certs|Chain)$/)
  .option('start', 'Start dragon system. (For servers use server option)')
  .option('server', 'Run dragon system in a server')
  .option('build', 'Build custom docker images')
  .option('logs [name]', 'Get docker logs',  /^(site|api|store|proxy|certs|parity)$/i)
  .option('stop', 'Stop all running dockers')
  .option('kill', 'Forcefully stop all running dockers')
  .option('rm', 'Clear all stopped docker containers')
  .option('push', 'Push build docker images to a docker registry')
  .option('pull', 'Pull all docker images from a docker registries')
  .version('0.1.0', '-v, --version', 'Output the version number')
  .parse(process.argv);

var getInterface = function() {
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      figlet.text('    dragon system    ', {
        font: 'Ogre',
        horizontalLayout: 'default',
        verticalLayout: 'default'
      }, function(err, data) {
        if(err){
          console.log('Error', err);
          logger.log('Error', err);
          return;
        }
        console.log(chalk.bold.hex('#FF0033')(data));
        console.log(chalk.hex('#C8C420')('                                                                   v0.01'));
      });
    resolve({data:'200'});
    }, 200);
  });
  return promise;
}

var validateDocker= function() {
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      shell.exec('docker -v', function(code, stdout, stderr) {
        if (code !== 0) {
          logger.log('Error', "docker command not found,\nmsg: " + code + ", " + stderr);
          console.log('Error', "docker command not found,\nmsg: " + code + ", " + stderr);
          console.log("Use this guide to " + chalk.bold("install docker") +
            " in the system:\n\t" + chalk.italic("https://docs.docker.com/engine/installation/"));
          console.log("And this guide to install " + chalk.bold("docker-compose") +
            " in the system:\n\t" + chalk.italic("https://docs.docker.com/compose/install/"));
          process.exit(0);
        } else {
          shell.exec('docker-compose -v', function(code, stdout, stderr) {
            if (code !== 0) {
              logger.log('Error', "docker-compose command not found,\nmsg: " + code + ", " + stderr);
              console.log('Error', "docker-compose command not found,\nmsg: " + code + ", " + stderr);
              console.log("Use this guide to install " + chalk.bold("docker-compose") +
                " in the system:\n\t" + chalk.italic("https://docs.docker.com/compose/install/"));
              process.exit(0);
            } else {
              shell.exec('git --version', function(code, stdout, stderr) {
                if (code !== 0) {
                  logger.log('Error', "git command not found,\nmsg: " + code + ", " + stderr);
                  console.log('Error', "git command not found,\nmsg: " + code + ", " + stderr);
                  console.log("Use this guide to install " + chalk.bold("git") +
                    " in the system:\n\t" + chalk.italic("https://git-scm.com/book/en/v2/Getting-Started-Installing-Git"));
                  process.exit(0);
                }
              });
            }
          });
        }
      });
    resolve({data:'200'});
    }, 200);
  });
  return promise;
}

var loadEnv = function() {
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      if (shell.test('-f', confFile)) {
        properties.parse(confFile, {path: true}, function (error, data){
          siteImage = data.SITE_IMAGE;
          storeImage = data.STORE_IMAGE;
          certsImage = data.CERTS_IMAGE;
          proxyImage = data.PROXY_IMAGE;
          apiImage = data.API_IMAGE;
        });
      }
    resolve({data:'200'});
    }, 200);
  });
  return promise;
}

var loadPlatform = function() {
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      if (shell.test('-f', platformFile)) {
        properties.parse(platformFile, {path: true}, function (error, data){
          debug = data.DEBUG;
          apiKey = data.SSL_API_KEY;
          site = data.SITE_HOSTNAME;
          api = data.API_HOSTNAME;
        });
      }
    resolve({data:'200'});
    }, 200);
  });
  return promise;
}

var getUserInputs = function() {
  var promise = new Promise(function(resolve, reject){
    setTimeout(function(){
      inquirer.prompt([
      {
        type: 'input',
        name: 'siteHostname',
        message: 'Site domain name:',
        default: site,
        validate: function(str) {
          if (validator.isFQDN(str)) {
            return true;
          }
          return "Please enter a fully qualified domain name."
        }
      },
      {
        type: 'input',
        name: 'apiHostname',
        message: 'API domain name:',
        default: api,
        validate: function(str) {
          if (validator.isFQDN(str)) {
            return true;
          }
          return "Please enter a fully qualified domain name."
        }
      },
      {
        type: 'input',
        name: 'apiKey',
        message: 'NS1 API key:',
        default: apiKey,
        validate: function(str) {
          if (validator.isByteLength(str, 20, 20)) {
            return true;
          }
          return "Please check the API key again ... "
        }
      },
      {
        type: 'input',
        name: 'siteImage',
        message: 'dragon-site image tag: ',
        default: siteImage
      },
      {
        type: 'input',
        name: 'apiImage',
        message: 'dragon-api image tag: ',
        default: apiImage
      },
      {
        type: 'input',
        name: 'storeImage',
        message: 'dragon-store image tag: ',
        default: storeImage
      },
      {
        type: 'input',
        name: 'certsImage',
        message: 'dragon-certs image tag: ',
        default: certsImage
      },
      {
        type: 'input',
        name: 'proxyImage',
        message: 'dragon-proxy image tag: ',
        default: proxyImage
      },
      {
        type: 'list',
        message: 'Debug mode enabled or disabled?',
        name: 'debug',
        default: debug,
        choices: [
          {
              name: 'Enable'
          },
          {
              name: 'Disable'
          }
        ]
      }
      ]).then(function (answers) {
        validateUserInputs(answers);
      });
      //
    resolve({data:'200'});
    }, 200);
  });
  return promise;
}

function validateUserInputs(answers) {

  site = answers.siteHostname;
  api = answers.apiHostname;
  apiKey = answers.apiKey;
  debug = answers.debug;

  siteImage = answers.siteImage;
  storeImage = answers.storeImage;
  certsImage = answers.certsImage;
  proxyImage = answers.proxyImage;
  apiImage = answers.apiImage;

  inquirer.prompt([
  {
    type: 'list',
    message: 'Continue on installation?',
    name: 'install',
    choices: [
      {
          name: 'No'
      },
      {
          name: 'Yes'
      }
    ]
  }
  ]).then(function (answers) {
    if(answers.install == 'Yes'){
      //console.log("Starting install ...");
      logger.log("info", "Starting install");
      updateConfigFiles();
    } else {
      process.exit(0);
    }
  });
}

function updateConfigFiles(){
  //console.log("Updating configurations ... ");
  logger.log("info", "Updating configurations");
  shell.cd(homeDir);
  shell.cp(path.join(__dirname, "platform.env.example"), platformFile);
  shell.cp(path.join(__dirname, ".env"), confFile);
  shell.cp(path.join(__dirname, "docker-compose.yaml"), path.join(homeDir, "docker-compose.yaml"));
  shell.sed('-i', 'DEBUG=.*', "DEBUG=" + debug, platformFile);
  shell.sed('-i', 'SITE_HOSTNAME=.*', "SITE_HOSTNAME=" + site, platformFile);
  shell.sed('-i', 'API_HOSTNAME=.*', "API_HOSTNAME=" + api, platformFile);
  shell.sed('-i', 'SSL_API_KEY=.*', "SSL_API_KEY=" + apiKey, platformFile);
  shell.sed('-i', 'SITE_IMAGE=.*', "SITE_IMAGE=" + siteImage, confFile);
  shell.sed('-i', 'STORE_IMAGE=.*', "STORE_IMAGE=" + storeImage, confFile);
  shell.sed('-i', 'CERTS_IMAGE=.*', "CERTS_IMAGE=" + certsImage, confFile);
  shell.sed('-i', 'PROXY_IMAGE=.*', "PROXY_IMAGE=" + proxyImage, confFile);
  shell.sed('-i', 'API_IMAGE=.*', "API_IMAGE=" + apiImage, confFile);
}

function composeBuild(){

  shell.config.silent = false;
  imageTag = "";
  inquirer.prompt([
  {
    type: 'list',
    message: 'Build component',
    name: 'component',
    choices: [
      {
          name: 'Site'
      }
     // },
     // {
     //     name: 'API'
     // }
    ]
  },
  {
    type: 'input',
    name: 'tagName',
    message: 'Image tag name: ',
    default: "docker.io/dragonsystem/customname:0.0.1-rc1"
  }
  ]).then(function (answers) {
    imageTag = answers.tagName;
    component = answers.component;
    // run a sed and update .env file.
    shell.sed('-i', 'SITE_IMAGE=.*', "SITE_IMAGE=" + imageTag, confFile);
    shell.config.silent = false;
    console.log("Building code for " + component  + " ... ");
    shell.exec("npm install --verbose && bower install --verbose && polymer build", function(code, stdout, stderr) {
      console.log(stdout);
      logger.log("info", "Building source.\n" + stdout);
      if (code !== 0) {
        logger.log('Error', "Code: " + code + ", msg: " + stderr);
        console.log('Error', "Code: " + code + ", msg: " + stderr);
      } else {
        console.log("Building docker image for " + imageTag + " ... ");
        logger.log("info", "Bilding docker images");
        shell.exec("docker build -t " + imageTag + " .", function(code, stdout, stderr) {
          console.log(stdout);
          logger.log("info", "docker build -t " + imageTag + " .\n" + stdout);
          if (code !== 0) {
            logger.log('Error', "Code: " + code + ", msg: " + stderr);
            console.log('Error', "Code: " + code + ", msg: " + stderr);
          }
        });
      }
    });
  });
}

function composeUp(){
  console.log("Starting up docker containers ... ");
  logger.log("info", "Starting up docker containers");
  shell.exec('docker-compose up -d', function(code, stdout, stderr) {
    console.log(stdout);
    logger.log("info", "docker-compose up -d\n" + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    } else {
      console.log(chalk.blue("Update /etc/hosts entries to verify the setup."));
      console.log(chalk.underline.bgMagenta(chalk.white("$ sudo vim /etc/hosts")));
      console.log(chalk.blue("Add following lines to the file"));
      console.log(chalk.underline.bgBlue(chalk.white("127.0.0.1 " + site)));
      console.log(chalk.underline.bgBlue(chalk.white("127.0.0.1 " + api)));
      console.log(chalk.blue("Save and exit using \'<Esc> :wq\'"));
    }
  });
}

function composePull(){
  shell.config.silent = false;
  console.log("Pulling docker images ... ");
  logger.log("info", "Pulling docker images");
  shell.exec('docker-compose pull', function(code, stdout, stderr) {
    console.log(stdout);
    logger.log("info", "docker-compose pull\n" + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    }
  });
}

//function composePullAndRun(){
//  console.log("Pulling docker images ... ");
//  logger.log("info", "Pulling docker images");
//  //getUserInputs().then(
//  // Get user inputs. pull and start
//  //);
//  shell.exec('docker-compose pull', function(code, stdout, stderr) {
//    console.log(stdout);
//    logger.log("info", "docker-compose pull\n" + stdout);
//    if (code !== 0) {
//      logger.log('Error', "Code: " + code + ", msg: " + stderr);
//      console.log('Error', "Code: " + code + ", msg: " + stderr);
//    } else {
//      console.log("Starting up docker containers ... ");
//      logger.log("info", "Starting up docker containers");
//      shell.exec('docker-compose up -d', function(code, stdout, stderr) {
//        console.log(stdout);
//        logger.log("info", "docker-compose up -d\n" + stdout);
//        if (code !== 0) {
//          logger.log('Error', "Code: " + code + ", msg: " + stderr);
//          console.log('Error', "Code: " + code + ", msg: " + stderr);
//        } else {
//          console.log(chalk.blue("Update DNS to point " + site + " and " + api + " to this server."));
//        }
//      });
//    }
//  });
//}

function composePush(){
  console.log("Pushing images to docker registry ... ");
  logger.log("info", "Pushing images to docker registry");
  shell.exec("docker-compose push", function(code, stdout, stderr) {
    console.log(stdout);
    logger.log("info", "docker-compose push\n" + stdout);
    if (code !== 0) {
          logger.log('Error', "Code: " + code + ", msg: " + stderr);
          console.log('Error', "Code: " + code + ", msg: " + stderr);
      }
  });
}

function composePs(){
  shell.exec('docker-compose ps', function(code, stdout, stderr) {
    console.log(stdout);
    logger.log("info", "docker-compose ps\n " + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    }
  });
}

function composeStop(){
  shell.exec('docker-compose stop', function(code, stdout, stderr) {
    console.log(stdout);
    logger.log("info", "docker-compose stop\n" + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    }
  });
}

function composeKill(){
  shell.exec('docker-compose kill', function(code, stdout, stderr) {
    logger.log("info", "docker-compose kill\n" + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    }
  });
}

function composeRm(){
  shell.exec('docker-compose kill', function(code, stdout, stderr) {
    logger.log("info", "docker-compose kill\n" + stdout);
    if (code !== 0) {
      logger.log('Error', "Code: " + code + ", msg: " + stderr);
      console.log('Error', "Code: " + code + ", msg: " + stderr);
    } else {
      shell.exec('docker-compose rm -f', function(code, stdout, stderr) {
        logger.log("info", "docker-compose rm -f\n" + stdout);
        if (code !== 0) {
          logger.log('Error', "Code: " + code + ", msg: " + stderr);
          console.log('Error', "Code: " + code + ", msg: " + stderr);
        }
      })
    }
  });
}

function composeLogs(log){
  shell.config.silent = false;
  if (log == true){
  shell.exec('docker-compose logs -f --tail=500', function(code, stdout, stderr) {
    console.log(stdout);
    if (code !== 0) {
          logger.log('Error', "Code: " + code + ", msg: " + stderr);
          console.log('Error', "Code: " + code + ", msg: " + stderr);
      }
  });
  } else {
  shell.exec("docker-compose logs -f --tail=500 " + log, function(code, stdout, stderr) {
    console.log(stdout);
    if (code !== 0) {
          logger.log('Error', "Code: " + code + ", msg: " + stderr);
          console.log('Error', "Code: " + code + ", msg: " + stderr);
      }
  });
  }
}

function composeGet(repo){
  if (repo == true){
    console.log("Usage: dragon get <Site|Api|Store|Proxy|Certs|Chain>\n" +
      "Example: dragon get Site");
  } else {
  shell.exec("git clone https://github.com/DragonSystems/Dragon" + repo + ".git ", function(code, stdout, stderr) {
    console.log(stdout);
    if (code !== 0) {
          logger.log('Error', "Code: " + code + ", msg: " + stderr);
          console.log('Error', "Code: " + code + ", msg: " + stderr);
      }
  });
  }
}

function dragonInit(){
  shell.cd(homeDir);
  shell.cp(path.join(__dirname, "platform.env.example"), platformFile);
  shell.cp(path.join(__dirname, ".env"), confFile);
  shell.cp(path.join(__dirname, "docker-compose.yaml"), path.join(homeDir, "docker-compose.yaml"));
  getInterface()
    .then(validateDocker)
    .then(loadEnv)
    .then(loadPlatform)
    .then(getUserInputs);
}

function validateConfigs(){
  if (shell.test('-f', confFile)) {
    return true;
  }
  console.log("Run " + chalk.red("dragon init") + " to initialize the system");
  return false;
}

if (process.argv.length == 2) {
  getInterface().then(function() {
    var promise = new Promise(function(resolve, reject){
      setTimeout(function(){
        console.log("Usage: " + chalk.red("dragon [option]"));
        console.log("       " + chalk.red("dragon --help") + "\t to view available options\n");
      resolve({data:'200'});
      }, 200);
    });
    return promise;
  });
} else {
  loadEnv()
    .then(loadPlatform);
}

if (cmd.start) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composeUp();
  }
}

if (cmd.init) {
  shell.cd(homeDir);
  dragonInit();
}

if (cmd.server) {
  if (validateConfigs()){
    shell.cd(homeDir);
    //composePullAndRun();
    getInterface()
      .then(validateDocker)
      .then(loadEnv)
      .then(loadPlatform)
      .then(getUserInputs);
  }
}

if (cmd.ps) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composePs();
  }
}

if (cmd.build) {
  if (validateConfigs()){
    composeBuild();
  }
}

if (cmd.stop) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composeStop();
  }
}

if (cmd.kill) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composeKill();
  }
}

if (cmd.rm) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composeRm();
  }
}

if (cmd.logs) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composeLogs(cmd.logs);
  }
}

if (cmd.get) {
  if (validateConfigs()){
    composeGet(cmd.get);
  }
}

if (cmd.push) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composePush();
  }
}

if (cmd.pull) {
  if (validateConfigs()){
    shell.cd(homeDir);
    composePull();
  }
}
