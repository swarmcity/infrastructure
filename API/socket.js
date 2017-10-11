"use strict";
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Web3 = require('web3');
let queue = [];
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
        error: '_errorFx',
        publicKey: 0,
    }
    _queue(getFx, 'add');
    //push get Hashtags to the queue
    const getHashtags = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getHashtags',
        error: '_errorHashtags',
        publicKey: 0,
    }
    _queue(getHashtags, 'add');
    //push get Gas Price to the queue
    const getGasPrice = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getGasPrice',
        error: '_errorGasPrice',
        publicKey: 0,
    }
    _queue(getGasPrice, 'add');
    //push get Health to the queue
    const getHealth = {
        lastRun: timeNow,
        nextRun: timeNow,
        interval: 300000,
        toDo: '_getHealth',
        error: '_errorHealth',
        publicKey: 0,
    }
    _queue(getHealth, 'add');
    // start the queue manager
    setTimeout(function(){ 
        _queue(getHealth, 'remove');
     }, 3000);
    _queueManager();
})();

/**
 * Connect
 */
io.on('connect', (socket) => {
    //push get balance to the queue
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
    socket.on('requests', (socket) => {
        console.log('requests')
    });
    socket.on('broadcastTransaction', (socket) => {
        console.log('broadcastTransaction')
    });
    socket.on('saveAvatar', (socket) => {
        console.log('saveAvatar')
    });
    socket.on('getNoonce', (socket) => {
        console.log('getNoonce')
    });
    socket.on('saveError', (socket) => {
        console.log('saveError')
    });
});

// the queue will need add, remove and return, not update!
// direction is 'add' or 'remove'
// if the direction is remove then a public key and toDo must be provided

function _queue(task, direction) {
    if(task && direction == 'add'){
        queue.push(task);
        // make a log
    } else if (task && direction == 'remove'){
        queue = queue.filter(function(obj) {
            return (obj.publicKey !== task.publicKey || obj.toDo !== task.toDo); // Double santiy check this the || feels wrong!!
        });
        // make a log
    } else {
        return queue;
    }
    console.log(queue)
}

function _queueManager() {
    console.log('queueManager')
    // start checking the queue every second for items with a next_run time less than or equal to the time now
    const queue = _queue();
    const timeNow = (new Date).getTime();
}

function _blockWatcher() {
    console.log('blockWatcher')
    // start checking for a new block
    // if you find a new block get the balance for each connected user
}
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
