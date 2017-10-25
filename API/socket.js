'use strict';
require('dotenv').config({
	path: '../.env',
});
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETHWS));
const logs = require('./logs.js')();

const workerQueue = require('./scheduler/workerqueue')();

// scheduled task handlers
const getFx = require('./tasks/getFx')(web3);
const getGasPrice = require('./tasks/getGasPrice')(web3);
const getHashtags = require('./tasks/getHashtags')(web3);

// socket task handlers
const getBalance = require('./tasks/getBalance')(web3);

let connectedSockets = {};

(() => {
	// schedule getFx task every minute
	workerQueue.scheduledTask.addTask({
		func: getFx.updateFx,
		interval: 60 * 1000,
	});
})();

io.on('connection', (socket) => {
	if (!socket.handshake.query.publicKey) {
		logs._errorLog('no pubkey given.');
		return socket.disconnect(true);
	}

	logs.info('socket', socket.id, 'connected');

	let client = {
		publicKey: socket.handshake.query.publicKey,
		socket: socket,
		scheduledTasks: [],
	};

	connectedSockets[socket.id] = client;

	client.scheduledTasks.push(
		workerQueue.scheduledTask.addTask({
			func: (task) => {
				return getBalance.getBalance(task.data);
			},
			responsehandler: (res, task) => {
				logs.info('received getBalance RES=', JSON.stringify(res, null, 4));
				task.data.socket.emit('balanceChanged', res);
			},
			data: {
				socket: socket,
				address: socket.handshake.query.publicKey,
			},
		})
	);

	client.scheduledTasks.push(
		workerQueue.scheduledTask.addTask({
			func: (task) => {
				return getFx.getFx();
			},
			responsehandler: (res, task) => {
				logs.info('received getFx RES=', JSON.stringify(res, null, 4));
				task.data.socket.emit('fxChanged', res);
			},
			data: {
				socket: socket,
				address: socket.handshake.query.publicKey,
			},
		})
	);

	client.scheduledTasks.push(
		workerQueue.scheduledTask.addTask({
			func: (task) => {
				return getGasPrice.getGasPrice();
			},
			responsehandler: (res, task) => {
				logs.info('received getGasPrice RES=', JSON.stringify(res, null, 4));
				task.data.socket.emit('gasPriceChanged', res);
			},
			data: {
				socket: socket,
				address: socket.handshake.query.publicKey,
			},
		})
	);

	client.scheduledTasks.push(
		workerQueue.scheduledTask.addTask({
			func: (task) => {
				return getHashtags.getHashtags();
			},
			responsehandler: (res, task) => {
				logs.info('received getHashtags RES=', JSON.stringify(res, null, 4));
				task.data.socket.emit('hashtagsChanged', res);
			},
			data: {
				socket: socket,
				address: socket.handshake.query.publicKey,
			},
		})
	);

	socket.on('disconnect', () => {
		logs.info('socket', socket.id, 'disconnected');
		workerQueue.scheduledTask.removeTasks(connectedSockets[socket.id].scheduledTasks);
		delete connectedSockets[socket.id];
	});
});

const PORT = process.env.APISOCKETPORT;
const HOST = '0.0.0.0';

logs.info('server listening on host ', HOST, 'port', PORT);

server.listen(PORT, HOST);
