'use strict';

const logger = require('../logs')();
const uuidv4 = require('uuid/v4');

// subscriptions manager - keeps track of subscriptions per socket.

module.exports = (config) => {
	if (!config) {
		config = {};
	}

	// available channels
	let channels = {};

	let subscriptions = {};

	function status() {
		let statusId = uuidv4();
		logger.info('---subscriptions status [', statusId, ']---');
		if (subscription === {}) {
			logger.info('No subscriptions');
		} else {
			logger.info('subscriptions:');
			let count = 1;
			for (var subscription in subscriptions) {
				if (Object.prototype.hasOwnProperty.call(subscriptions, subscription)) {
					logger.info(count++, ':', subscription, '->', subscriptions[subscription]);
				}
			}
		}
		logger.info('---/subscriptions status [', statusId, ']---');
		return Promise.resolve();
	}

	function unsubscribe(socket, data, callback) {
		logger.info('unsubscribe from ID', data.subscriptionId);

		_removeSubscription(data.subscriptionId).then((success) => {
			let responseCode = success ? 200 : 401;
			if (!callback) {
					return;
				}
				let reply = {
					response: 200,
				};
				return callback(reply);
		});
	}

	function _removeSubscription(subscriptionId) {
		logger.info('_removeSubscription ID', subscriptionId);
		if (subscriptions[subscriptionId]) {
			delete subscriptions[subscriptionId];
			return Promise.resolve(true);
		} else {
			return Promise.resolve(false);
		}
	}

	function subscribe(socket, data, callback) {
		let subscriptionId = uuidv4();
		logger.info('socket', socket.id, 'subscribes to', data.channel,'subscriptionId=',subscriptionId);
		subscriptions[subscriptionId] = {
			socketId: socket.id
		};
		let reply = {
			response: 200,
			subscriptionId: subscriptionId,
			data: []
		};
		callback(reply);
	}

	function unsubscribeAll(socketId) {
		logger.info('socket', socketId, 'unsubscribeAll called');
		for (var subscription in subscriptions) {
			if (Object.prototype.hasOwnProperty.call(subscriptions, subscription)) {
				if (subscriptions[subscription].socketId === socketId) {
					_removeSubscription(subscription);
				}
			}
		}
	}

	return ({
		subscribe: subscribe,
		unsubscribe: unsubscribe,
		unsubscribeAll: unsubscribeAll
	});
};