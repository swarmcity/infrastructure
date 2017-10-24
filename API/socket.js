'use strict';
require('dotenv').config({
	path: '../.env',
});
const app = require('express')();
const server = require('http').Server(app); // eslint-disable-line
const io = require('socket.io')(server);
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETHWS));
const logs = require('./logs.js')();

const workerQueue = require('./scheduler/workerqueue')();

// scheduled task handlers
const getFx = require('./tasks/getFx.js')(web3);

// socket task handlers
const getBalance = require('./tasks/getBalance.js')(web3);

let connectedSockets = {};

(function() {
	workerQueue.scheduledTask.addTask({
		func: getFx.updateFx,
		interval: 60 * 1000,
	});
})();

io.on('connection', function(socket) {
	if (!socket.handshake.query.publicKey) {
		logs._errorLog('no pubkey given.');
		return socket.disconnect(true);
	}

	logs.info('socket', socket.id, 'connected');

	socket.emit('QUAAK', null);

	let client = {
		publicKey: socket.handshake.query.publicKey,
		socket: socket,
		scheduledtasks: [],
	};

	connectedSockets[socket.id] = client;

	let task = workerQueue.scheduledTask.addTask({
		func: (task) => {
			return getBalance.getBalance(task.data);
		},
		responsehandler: (res, task) => {
			logs.info('received RES=', JSON.stringify(res, null, 4));
			task.data.socket.emit('balanceChanged', res);
		},
		data: {
			socket: socket,
			address: socket.handshake.query.publicKey,
		},
	});

	client.scheduledtasks.push(task);


	let task2 = workerQueue.scheduledTask.addTask({
		func: (task) => {
			return getFx.updateFx();
		},
		responsehandler: (res, task) => {
			logs.info('received getFx RES=', JSON.stringify(res, null, 4));
			task.data.socket.emit('fxChanged', res);
		},
		data: {
			socket: socket,
			address: socket.handshake.query.publicKey,
		},
	});

	client.scheduledtasks.push(task2);

	// const getBalance = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getBalance,
	// 	publicKey: user.publicKey,
	// 	socket: socket,
	// };
	// const getPendingTransactions = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getPendingTransaction,
	// 	publicKey: user.publicKey,
	// };
	// const getGasPrice = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getGasPrice,
	// 	publicKey: 0,
	// 	socket: socket,
	// };
	// const getHashtags = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getHashtags,
	// 	publicKey: 0,
	// 	socket: socket,
	// };
	// const getFx = {
	// 	nextRun: 0,
	// 	interval: 0,
	// 	toDo: tasks._getFx,
	// 	publicKey: 0,
	// 	socket: socket,
	// };
	// _queue(getHashtags, 'add');
	// _queue(getGasPrice, 'add');
	// _queue(getBalance, 'add');
	// _queue(getFx, 'add');

	socket.on('disconnect', () => {
		logs.info('socket', socket.id, 'disconnected');
		workerQueue.scheduledTask.removeTasks(connectedSockets[socket.id].scheduledtasks);
		delete connectedSockets[socket.id];
	});

	// socket.on('requests', (data, response) => {
	// 	response({
	// 		status: 200,
	// 	});
	// });

	// socket.on('createItem', (data, response) => {
	// 	return newItem._newItem(data).then((res) => {
	// 		socket.emit('newItemChanged', res);
	// 		response({
	// 			status: 200,
	// 			res,
	// 		});
	// 	}).catch((err) => {
	// 		logs._errorLog('newItem ERR! ', err);
	// 	});
	// });

	// socket.on('hashtagItems', (data, response) => {
	// 	return getHashtagItems._getHashtagItems(data).then((res) => {
	// 		socket.emit('hashtagItemsChanged', res);
	// 		response({
	// 			status: 200,
	// 			res,
	// 		});
	// 	}).catch((err) => {
	// 		logs._errorLog('hashtagItems ERR! ', err);
	// 	});
	// });

	// socket.on('broadcastTransaction', (data, response) => {
	// 	response({
	// 		status: 200,
	// 	});
	// });
	// socket.on('saveAvatar', (data, response) => {
	// 	response({
	// 		status: 200,
	// 	});
	// });
	// socket.on('getNoonce', (data, response) => {
	// 	response({
	// 		status: 200,
	// 	});
	// });
	// socket.on('saveError', (data, response) => {
	// 	response({
	// 		status: 200,
	// 	});
	// });
});

const PORT = process.env.APISOCKETPORT;
const HOST = '0.0.0.0';

logs.info('server listening on host ', HOST, 'port', PORT);

server.listen(PORT, HOST);
