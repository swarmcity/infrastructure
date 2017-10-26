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

	/**
	 * print status of this module ( subscription list etc. ) to the logger
	 *
	 * @return     {Promise}  Resolves when done. No return value.
	 */
	function status() {
		let statusId = uuidv4();
		logger.info('---subscriptions status [', statusId, ']---');
		if (subscriptions === {}) {
			logger.info('No subscriptions');
		} else {
			logger.info('subscriptions:');
			let count = 1;
			for (let subscription in subscriptions) {
				if (Object.prototype.hasOwnProperty.call(subscriptions, subscription)) {
					logger.info(count++, ':', subscription, '->', subscriptions[subscription]);
				}
			}
		}
		logger.info('---/subscriptions status [', statusId, ']---');
		return Promise.resolve();
	}

	/**
	 * subscribe to a channel
	 *
	 * @param      {Object}    socket    The socket requesting the subscribe
	 * @param      {Object}    data      The data the socket sent along
	 * @param      {Function}  callback  Callback for sending the reply to socket 
	 * @return     {Object} null
	 */
	function subscribe(socket, data, callback) {
		let subscriptionId = uuidv4();
		logger.info('socket', socket.id, 'subscribes to', data.channel,
			'subscriptionId=', subscriptionId);

		if (channels[data.channel]) {
			subscriptions[subscriptionId] = {
				socketId: socket.id,
			};
			let reply = {
				response: 200,
				subscriptionId: subscriptionId,
				data: [],
			};
			return callback(reply);
		} else {
			let reply = {
				response: 400,
				message: 'No such channel',
			};
			return callback(reply);
		}
	}

	/**
	 * unsubscribe from a channel
	 *
	 * @param      {Object}    socket    The socket requesting the unsubscribe
	 * @param      {type}    data      The data provided by the socket
	 * @param      {Function}  callback  The callback for sending data back over the socket
	 */
	function unsubscribe(socket, data, callback) {
		logger.info('unsubscribe from ID', data.subscriptionId);

		_removeSubscription(data.subscriptionId).then((success) => {
			let responseCode = success ? 200 : 401;
			if (!callback) {
				return;
			}
			let reply = {
				response: responseCode,
			};
			return callback(reply);
		});
	}

	/**
	 * manage removal of subscription
	 *
	 * @param      {String}  subscriptionId  The subscription identifier
	 * @return     {Promise}  Promise resolving to true or false = success of removal
	 */
	function _removeSubscription(subscriptionId) {
		logger.info('_removeSubscription ID', subscriptionId);
		if (subscriptions[subscriptionId]) {
			delete subscriptions[subscriptionId];
			return Promise.resolve(true);
		} else {
			return Promise.resolve(false);
		}
	}

	/**
	 * subscribe a socket from all subscriptions
	 *
	 * @param      {String}  socketId  The socket identifier
	 */
	function unsubscribeAll(socketId) {
		logger.info('socket', socketId, 'unsubscribeAll called');
		for (let subscription in subscriptions) {
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
		unsubscribeAll: unsubscribeAll,
		status: status,
	});
};
