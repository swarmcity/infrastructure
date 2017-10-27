'use strict';
require('dotenv').config({
	path: '../../.env',
});
const should = require('should');
const logger = require('../logs')();

const io = require('socket.io-client');
// const socketWildcard = require('socketio-wildcard')();
// var patch = require('socketio-wildcard')(io.Manager);

const socketURL = 'http://localhost:8011?publicKey=0x7018d8f698bfa076e1bdc916e2c64caddc750944';
const options = {
	'transports': ['websocket'],
	'force new connection': true,
};

describe('Swarm City API socket client > test pubsub on \'balance\'', function() {
	let client;
	let subscriptions = [];

	it('should subscribe / receive a subscription ID', function(done) {
		logger.info('connecting to ', socketURL);
		client = io.connect(socketURL, options);

		let promises = [];
		for (let i = 0; i < 1; i++) {
			promises.push(new Promise((resolve, reject) => {
				client.emit('subscribe', {
					channel: 'balance',
					args: {
						address: '0x7018d8f698bfa076e1bdc916e2c64caddc750944',
					},
				}, (data) => {
					should(data).have.property('response', 200);
					should(data).have.property('subscriptionId');

					subscriptions.push(data.subscriptionId);

					logger.info('subscribe>>>balance', data);
					resolve();
				});
			}));
		}

		Promise.all(promises).then(() => {
			done();
		}).catch((err) => {
			logger.info(err);
			done();
		});
	});

	it('should wait a while for a block', (done) => {
		// listen to updates....
		client.on('balanceChanged', (data) => {
			logger.info('balanceChanged');
			logger.info('received balance update...', data);
		});

		setTimeout(() => {
			done();
		}, 50 * 1000);
	});

	it('should unsubscribe / receive a confirmation', (done) => {
		let promises = [];
		subscriptions.forEach((subscription) => {
			logger.info('unsubscribe from', subscription);
			promises.push(new Promise((resolve, reject) => {
				client.emit('unsubscribe', {
					subscriptionId: subscription,
				}, (data) => {
					should(data).have.property('response', 200);
					logger.info('unsubscribe>>>', data);
					resolve();
				});
			}));
		});

		Promise.all(promises).then(() => {
			done();
		}).catch((err) => {
			logger.info(err);
			done();
		});
	});


	after((done) => {
		client.close();
		done();
	});
});
