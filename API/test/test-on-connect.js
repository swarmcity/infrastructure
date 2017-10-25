'use strict';
require('dotenv').config({
	path: '../../.env',
});

const logger = require('../logs')();

const io = require('socket.io-client');
// const socketWildcard = require('socketio-wildcard')();
// var patch = require('socketio-wildcard')(io.Manager);

const socketURL = 'http://localhost:8011?publicKey=0x7018d8f698bfa076e1bdc916e2c64caddc750944';
const options = {
	'transports': ['websocket'],
	'force new connection': true,
};


describe('Swarm City API socket client', function() {
	let client;
	it('should receive all related events right after socket connects', function(done) {
		logger.info('connecting to ', socketURL);
		client = io.connect(socketURL, options);

		let promises = [];
		promises.push(new Promise((resolve, reject) => {
			client.on('balanceChanged', (data) => {
				logger.info('balanceChanged', data);
				resolve();
			});
		}));
		promises.push(new Promise((resolve, reject) => {
			client.on('fxChanged', (data) => {
				logger.info('fxChanged', data);
				resolve();
			});
		}));
		promises.push(new Promise((resolve, reject) => {
			client.on('gasPriceChanged', (data) => {
				logger.info('gasPriceChanged', data);
				resolve();
			});
		}));
		promises.push(new Promise((resolve, reject) => {
			client.on('hashtagsChanged', (data) => {
				logger.info('hashtagsChanged');
				resolve();
			});
		}));
		Promise.all(promises).then(() => {
			done();
		}).catch((err) => {
			logger.info(err);
		});
	});

	after(function(done) {
		client.close();
		done();
	});
});
