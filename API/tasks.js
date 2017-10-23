const logs = require('./logs.js')();
module.exports = function(web3) {
	const getBalance = require('./tasks/getBalance.js')(web3);
	const getFx = require('./tasks/getFx.js')(web3);
	const getGasPrice = require('./tasks/getGasPrice.js')(web3);
	const getHashtags = require('./tasks/getHashtags.js')(web3);
	const Avatar = require('./tasks/Avatar.js')(web3);

	return {
		/**
		 * Update FX
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_updateFx: function(queue, task) {
			// return getFx._updateFx().then((res) => {
			// 	queue(task, 'remove');
			// 	task.nextRun = (new Date).getTime() + task.interval;
			// 	queue(task, 'add');
			// 	return res;
			// }).catch((err) => {
			// 	logs._errorLog('update fx ERR! ', err);
			// });
		},
		/**
		 * Get FX
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getFx: function(queue, task) {
			return getFx._getFx().then((res) => {
        task.socket.emit('fxChanged', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('get fx ERR! ', err);
			});
		},
		/**
		 * Get Balance
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getBalance: function(queue, task) {
			return getBalance._getBalance(task.publicKey).then((res) => {
				task.socket.emit('balanceChanged', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('get balance ERR! ', err);
			});
		},
		/**
		 * Get Gas Price
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getGasPrice: function(queue, task) {
			return getGasPrice._getGasPrice().then((res) => {
				task.socket.emit('gasPriceChanged', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('get gasprice ERR! ', err);
			});
		},
		/**
		 * Get Hash Tag
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getHashtags: function(queue, task) {
			return getHashtags._getHashtags(task.publicKey).then((res) => {
				task.socket.emit('hashtagsChanged', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('get hashtags ERR! ', err);
			});
		},
		/**
		 * Get Avatar
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getAvatar: function(queue, task) {
			return Avatar._getAvatar(task.hash).then((res) => {
				task.socket.emit('getAvatar', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('get avatar ERR! ', err);
			});
		},
		/**
		 * Set Avatar
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_setAvatar: function(queue, task) {
			return Avatar._setAvatar(task.base64).then((res) => {
				task.socket.emit('setAvatar', res);
				queue(task, 'remove');
				return res;
			}).catch((err) => {
				logs._errorLog('set avatar ERR! ', err);
			});
		},
		/**
		 * Get Heath
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getHealth: function(queue, task) {
			return new Promise((resolve, reject) => {
				logs._eventLog('=========== GET HEALTH ============');
				resolve('getHealth');
			});
		},
		/**
		 * Get Pending transactions
		 * @param {Array} queue
		 * @param {Object} task
		 * @return {Array}
		 */
		_getPendingTransactions: function(queue, task) {
			return new Promise((resolve, reject) => {
				resolve('getPendingTransactions');
			});
		},
	};
};
