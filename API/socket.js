'use strict';
const app = require('express')();
const server = require('http').Server(app); // eslint-disable-line
const io = require('socket.io')(server);
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://139.59.240.233:8546'));
const logs = require('./logs.js')();
const tasks = require('./tasks.js')(web3);
const newItem = require('./tasks/newItem.js')(web3);
const getHashtagItems = require('./tasks/getHashtagItems.js')(web3);

let connected = [];
let queue = [];
let taskInProgress = false;

(function() {
	const timeNow = (new Date).getTime();
	const updateFx = {
		nextRun: timeNow,
		interval: 10000,
		toDo: tasks._updateFx,
		publicKey: 0,
	};
	_queue(updateFx, 'add');
	_queueManager();
	_blockWatcher();
})();

io.on('connection', function(socket) {
	if (!socket.handshake.query.publicKey) {
		logs._errorLog('no pubkey given.');
		return socket.disconnect(true);
	}

	const user = {
		socketId: socket.id,
		publicKey: socket.handshake.query.publicKey,
		socket: socket,
	};
	connected.push(user);
	const getBalance = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getBalance,
		publicKey: user.publicKey,
		socket: socket,
	};
	// const getPendingTransactions = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getPendingTransaction,
	// 	publicKey: user.publicKey,
	// };
	const getGasPrice = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getGasPrice,
		publicKey: 0,
		socket: socket,
	};
	const getHashtags = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getHashtags,
		publicKey: 0,
		socket: socket,
	};
	const getFx = {
		nextRun: 0,
		interval: 0,
		toDo: tasks._getFx,
		publicKey: 0,
		socket: socket,
	};
	_queue(getHashtags, 'add');
	_queue(getGasPrice, 'add');
	_queue(getBalance, 'add');
	_queue(getFx, 'add');

	socket.on('disconnect', () => {
		connected = connected.filter(function(obj) {
			return (obj.socketId != user.socketId);
		});
		queue = queue.filter(function(obj) {
			return (obj.publicKey != user.publicKey);
		});
	});

	socket.on('requests', (data, response) => {
		response({
			status: 200,
		});
	});

	socket.on('createItem', (data, response) => {
		return newItem._newItem(data).then((res) => {
			socket.emit('newItemChanged', res);
			response({
				status: 200,
				res,
			});
		}).catch((err) => {
			logs._errorLog('newItem ERR! ', err);
		});
	});

	socket.on('hashtagItems', (data, response) => {
		return getHashtagItems._getHashtagItems(data).then((res) => {
			socket.emit('hashtagItemsChanged', res);
			response({
				status: 200,
				res,
			});
		}).catch((err) => {
			logs._errorLog('hashtagItems ERR! ', err);
		});
	});

	socket.on('broadcastTransaction', (data, response) => {
		response({
			status: 200,
		});
	});
	socket.on('saveAvatar', (data, response) => {
		response({
			status: 200,
		});
	});
	socket.on('getNoonce', (data, response) => {
		response({
			status: 200,
		});
	});
	socket.on('saveError', (data, response) => {
		response({
			status: 200,
		});
	});
});


/**
 * Queue
 * @param {Object} task 
 * @param {String} direction 
 */
function _queue(task, direction) {
	if (task && direction == 'add') {
		let isDuplicate = queue.filter(function(obj) {
			return (obj.publicKey == task.publicKey && obj.toDo == task.toDo);
		});
		if (isDuplicate.length == 0) {
			queue.push(task);
		}
		logs._eventLog(task, 'add to queue');
	} else if (task && direction == 'remove') {
		queue = queue.filter(function(obj) {
			return (obj.publicKey != task.publicKey || obj.toDo != task.toDo);
		});
		logs._eventLog(task, 'remove from queue');
	} else {
		logs._errorLog(task, 'unhandled queue error');
	}
}

/**
 * Queue
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
 * Block Watcher
 */
function _blockWatcher() {
	web3.eth.subscribe('newBlockHeaders', function(error, result) {
		if (!error) {
			connected.forEach(function(data) {
				// const getBalance = {
				// 	nextRun: 0,
				// 	interval: 0,
				// 	toDo: tasks._getBalance,
				// 	publicKey: data.publicKey,
				// 	socket: data.socket,
				// };

				// _queue(getBalance, 'add');

				// const getFx = {
				// 	nextRun: 0,
				// 	interval: 0,
				// 	toDo: tasks._getFx,
				// 	publicKey: data.publicKey,
				// 	socket: data.socket,
				// };
				// _queue(getFx, 'add');
			});
		} else {
			logs._errorLog('_blockWatcher', 'unhandled subscription error');
		}
	});
}

/**
 * Task Scheduler
 * @param {Array} taskList 
 * @return {Array} 
 */
function _taskScheduler(taskList) {
	if (taskInProgress == false) {
		taskInProgress = true;
		return taskList.reduce((chain, task) => {
// TODO: Stop passing in _queue, get the value back here then deal with the queue ot other global
// task.toDo needs to return a promise and resolve the data
// maybe pass the data to a response manager that ensures the respinse is not a duplicate?
// we would also be able to stop passing around web3
			return chain.then(() => task.toDo(_queue, task));
		}, Promise.resolve()).then(() => {
			taskInProgress = false;
		}).catch(() => {
			taskInProgress = false;
			logs._errorLog('_taskScheduler', 'unhandled error');
		});
	}
}

const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);
