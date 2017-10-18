"use strict";

const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Web3 = require('web3');

//connect
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://139.59.240.233:8546'))

const logs = require('./logs.js')();
const tasks = require('./tasks.js')(web3);
const newItem = require('./tasks/newItem.js')(web3);
const getHashtagItems = require('./tasks/getHashtagItems.js')(web3);


// install fs and save logs to txt file
let connected = [];
let queue = [];
let processing = [];
let taskInProgress = false;

// Implemented from...  https://github.com/swarmcity/sc-protocol-docs/issues/20

/**
 * Start
 */
(function() {
	// get time in miliseconds
	const timeNow = (new Date).getTime();

	//push update FX to the queue
	const updateFx = {
		nextRun: timeNow,
		interval: 10000,
		toDo: tasks._updateFx,
		publicKey: 0,
	}
	_queue(updateFx, 'add');

	// start the queue manager
	_queueManager();
	_blockWatcher();
})();

/**
 * Connect
 */
io.on('connection', function(socket) {

	// the client should provide a publicKey argument
	// if not - just diconnect
	if (!socket.handshake.query.publicKey) {
		logs._errorLog('no pubkey given.');
		return socket.disconnect(true);
	}

	const user = {
		socketId: socket.id,
		publicKey: socket.handshake.query.publicKey,
		socket: socket
	};
	connected.push(user);
	const getBalance = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getBalance,
		publicKey: user.publicKey,
		socket: socket
	}
	const getPendingTransactions = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getPendingTransaction,
		publicKey: user.publicKey,
	};

	//push get Gas Price to the queue
	const getGasPrice = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getGasPrice,
		publicKey: 0,
		socket: socket
	};

	const getHashtags = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getHashtags,
		publicKey: 0,
		socket: socket
	};

	//push update FX to the queue
	const getFx = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getFx,
		publicKey: 0,
    socket: socket
	};

	_queue(getHashtags, 'add');
	_queue(getGasPrice, 'add');
	_queue(getBalance, 'add');
	_queue(getFx, 'add');

	/**
	 * Disconnect
	 */
	socket.on('disconnect', () => {
		connected = connected.filter(function(obj) {
			return (obj.socketId != user.socketId);
		});
		queue = queue.filter(function(obj) {
			return (obj.publicKey != user.publicKey);
		});
	});
	/**
	 * One Time Requests
	 */
	socket.on('requests', (data, response) => {
		response({
			status: 200
		});
	});
	socket.on('createItem', (data, response) => {
		// Make promise, store deal and return txhash
		return newItem._newItem(data).then((res) => {
			socket.emit('newItemChanged', res);
			response({
				status: 200,
				res
			});
		}).catch((err) => {
			logs._errorLog('newItem ERR! ', err);
		});
	});

	socket.on('hashtagItems', (data, response) => {
		// Make promise, store deal and return txhash
		return getHashtagItems._getHashtagItems(data).then((res) => {
			socket.emit('hashtagItemsChanged', res);
			response({
				status: 200,
				res
			});
		}).catch((err) => {
			logs._errorLog('hashtagItems ERR! ', err);
		});
	});

	socket.on('broadcastTransaction', (data, response) => {
		response({
			status: 200
		});
	});
	socket.on('saveAvatar', (data, response) => {
		response({
			status: 200
		});
	});
	socket.on('getNoonce', (data, response) => {
		response({
			status: 200
		});
	});
	socket.on('saveError', (data, response) => {
		response({
			status: 200
		});
	});
});

/**
 * the queue will need add, remove and return, not update!
 * direction is 'add' or 'remove'
 * if the direction is remove then a public key and toDo must be provided
 * ensure the queue does not have duplicates
 */
function _queue(task, direction) {
	if (task && direction == 'add') {
		var isDuplicate = queue.filter(function(obj) {
			return (obj.publicKey == task.publicKey && obj.toDo == task.toDo);
		});
		if (isDuplicate.length == 0) {
			queue.push(task);
		}
		logs._eventLog(task, 'add to queue');
	} else if (task && direction == 'remove') {
		queue = queue.filter(function(obj) {
			return (obj.publicKey != task.publicKey || obj.toDo != task.toDo); // Double santiy check this the "||"" feels wrong, but works!!
		});
		logs._eventLog(task, 'remove from queue');
	} else {
		logs._errorLog(task, 'unhandled queue error')
	}
}

/**
 * Each second filter the queue for tasks that need tobe done and pass them to the task schedule
 */
function _queueManager() {
	setInterval(() => {
		const timeNow = (new Date).getTime();
		let tasksToDo = queue.filter(function(obj) {
			return (obj.nextRun <= timeNow);
		});
		_taskScheduler(tasksToDo);
	}, 1000);
}

/**
 * Watch the blockchain for a new block
 */
function _blockWatcher() {
	var subscription = web3.eth.subscribe('newBlockHeaders', function(error, result) {
		if (!error) {
			connected.forEach(function(data) {
				const getBalance = {
					nextRun: 0,
					interval: 0,
					toDo: tasks._getBalance,
					publicKey: data.publicKey,
					socket: data.socket
				};
				//_queue(getBalance, 'add');

				const getFx = {
					nextRun: 0,
					interval: 0,
					toDo: tasks._getFx,
					publicKey: data.publicKey,
					socket: data.socket
				};
				//_queue(getFx, 'add');
			});
		} else {
			logs._errorLog('_blockWatcher', 'unhandled subscription error')
		}
	})
}

/**
 * Inserts jobs into the job scheduler array as they arrive
 * he scheduled jobs are processed as fast as possible, one after another
 * Once a job has been completed its removed from the queue or rescheduled
 */

function _taskScheduler(taskList) {
	if (taskInProgress == false) {
		taskInProgress = true;
		return taskList.reduce((chain, task) => {
			return chain.then(() => task.toDo(_queue, task));
		}, Promise.resolve()).then(() => {
			taskInProgress = false
		}).catch(() => {
			taskInProgress = false;
      logs._errorLog('_taskScheduler', 'unhandled error')
		});
	}
}

const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);
