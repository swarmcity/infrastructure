"use strict";

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Web3 = require('web3');

// connect

const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8546'))
//setTimeout(()=>web3.eth.getBlockNumber().then(console.log),500)

// var web3 = new Web3(new Web3.providers.WebsocketProvider("ws://localhost:8546"));
console.log(Web3.version);

// var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result){
//     if (!error){console.log(error)}
// })
//     .on("data", function(blockHeader){
// })

// install fs and save logs to txt file

let queue = [];
let connected = [];

// Implemented from...  https://github.com/swarmcity/sc-protocol-docs/issues/20

/**
 * Start
 */
(function(){
    // get time in miliseconds
    const timeNow = (new Date).getTime();
    //push get FX to the queue
    const getFx = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getFx',
        publicKey: 0,
    }
    _queue(getFx, 'add');
    //push get Hashtags to the queue
    const getHashtags = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getHashtags',
        publicKey: 0,
    }
    _queue(getHashtags, 'add');
    //push get Gas Price to the queue
    const getGasPrice = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getGasPrice',
        publicKey: 0,
    }
    _queue(getGasPrice, 'add');
    //push get Health to the queue
    const getHealth = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getHealth',
        publicKey: 0,
    }
    _queue(getHealth, 'add');
    // start the queue manager
    _queueManager();
})();

/**
 * Connect
 */
io.on('connect', (socket) => {
    socket.emit('connected');
    console.log('connected')
    /**
     * Disconnect
     */
    socket.on('disconnect', (socket) => {
        // Remove all the items from the queue for this socket
        console.log('disconnected')
    });
    /**
     * One Time Requests
     */
    socket.on('requests', (data, response) => {
        console.log('requests');
        response({
            status: 200,
        });
    });
    socket.on('broadcastTransaction', (data, response) => {
        console.log('broadcastTransaction');
        response({
            status: 200,
        });
    });
    socket.on('saveAvatar', (data, response) => {
        console.log('saveAvatar');
        response({
            status: 200,
        });
    });
    socket.on('getNoonce', (data, response) => {
        console.log('getNoonce');
        response({
            status: 200,
        });
    });
    socket.on('saveError', (data, response) => {
        console.log('saveError');
        response({
            status: 200,
        });
    });
});

/** 
* the queue will need add, remove and return, not update!
* direction is 'add' or 'remove'
* if the direction is remove then a public key and toDo must be provided
*/
function _queue(task, direction) {
    if(task && direction == 'add'){
        queue.push(task);
        _eventLog(task, 'add to queue');
    } else if (task && direction == 'remove'){
        queue = queue.filter(function(obj) {
            return (obj.publicKey != task.publicKey || obj.toDo != task.toDo); // Double santiy check this the "||"" feels wrong, but works!!
        });
        _eventLog(task, 'remove from queue');
    } else {
        _errorLog(task, 'unhandled queue error')
    }
}

/** 
* Each second filter the queue for tasks that need tobe done and pass them to the task schedulree
*/
function _queueManager() {
    console.log('queueManager')
    setInterval(() => { 
        const timeNow = (new Date).getTime();
        let tasksToDo = queue.filter(function(obj) {
            return (obj.nextRun <= timeNow);
        });
        _taskSheduler(tasksToDo);
    }, 1000);
}

/** 
* Watch the blockchain for a new block
*/
function _blockWatcher() {
    setInterval(() => { 
        // ask parity if a new block has been born
        // if one was found set block found to true
        let blockFound = false;
        let getBalanceFor = [];
        if(blockFound == true){
            // loop over all connected users
            // for each user push the below into an array
            // make log

            // const getBalance = {
            //     lastRun: 0,
            //     nextRun: 0,
            //     interval: 0,
            //     toDo: '_getBalance',
            //     publicKey: 0,
            // }

            // When done send the array to the task scheduler
            _taskSheduler(getBalanceFor);
        }
    }, 3000);
    // if you find a new block get the balance for each connected user
}


/** 
* Inserts jobs into the job schedular array as they arrive
* he scheduled jobs are processed as fast as possible, one after another
* Once a job has been completed its removed from the queue or rescheduled
*/
function _taskSheduler(tasksToDo) {
// define an array outside this function
// only push in items that are not a duplicate from whats already in 
// make a promise loop
// one after another call the function in the task, passing the task itself into the function
}

/**
* Tasks
*/
function _getFx(task){
    return new Promise((resolve, reject) => {
        console.log('getFx', task);
    })
};
function _getHashtags(task){
    return new Promise((resolve, reject) => {
        console.log('getHashtags', task);
    })
};
function _getGasPrice(task){
    return new Promise((resolve, reject) => {
        console.log('getGasPrice', task);
    })
};
function _getHealth(task){
    return new Promise((resolve, reject) => {
        console.log('getHealth', task);
    })
};
function _getBalance(task){
    return new Promise((resolve, reject) => {
        console.log('getBalance', task);
    })
};

/**
* Logs
*/
function _eventLog(item, type) {
    console.log(item, type)
    // start checking for a new block
    // if you find a new block get the balance for each connected user
}
function _errorLog(item, type) {
    console.log(item, type)
    // start checking for a new block
    // if you find a new block get the balance for each connected user
}


const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);
