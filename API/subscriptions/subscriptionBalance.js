/**
 * Subscription manager for 'balance'
 */
'use strict';
const logs = require('../logs.js')();

const getBalance = require('../tasks/getBalance')();
const blockHeaderTask = require('../scheduler/blockHeaderTask')();

/**
 * clean up a task from the scheduler when socket wants to unsubscribe
 *
 * @param      {Object}   task    The task
 * @return     {Promise}  result of removing the task (no return value)
 */
function cancelSubscription(task) {
	return Promise.resolve(
		blockHeaderTask.removeTask(task)
	);
}

/**
 * Creates a subscription.
 *
 * @param      {Object}  socket  The socket to send data to
 * @param      {Object}  args    The parameters sent with the subscription
 * @return     {Promise}  resolves with the subscription object
 */
function createSubscription(socket, args) {
	logs.info('subscribe to balance please....');
	// create task
	let _task = {
		func: (task) => {
			return Promise.resolve(getBalance.getBalance(task.data).then((res) => {
				task.data.lastReply = res;
				return (res);
			}));
		},
		responsehandler: (res, task) => {
			JSON.stringify
			logs.debug('received getBalance RES=', JSON.stringify(res, null, 4));
			task.data.socket.emit('balanceChanged', res);
			return blockHeaderTask.addTask(task);
		},
		data: {
			socket: socket,
			address: args.address,
		},
	};
	blockHeaderTask.addTask(_task);
	// run it a first time return subscription
	return _task.func(_task).then((reply) => {
		return Promise.resolve({
			task: _task,
			initialResponse: reply,
			cancelSubscription: cancelSubscription,
		});
	});
}

module.exports = function() {
	return ({
		name: 'balance',
		createSubscription: createSubscription,
	});
};
