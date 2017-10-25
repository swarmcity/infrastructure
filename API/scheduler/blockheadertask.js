'use strict';

// Scheduled tasks are tasks that need to run when the next ETH block arrives.

const logger = require('../logs')();
const Web3 = require('web3');

module.exports = function(workerqueue) {
	let tasks = [];
	let blockNumber = 0;

	let web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETHWS));

	let newBlockHeadersSubscription;

	function manageSubscription() {
		if (tasks.length === 0 && newBlockHeadersSubscription) {
			newBlockHeadersSubscription.unsubscribe((error, success) => {
				if (success) {
					logger.info('unsubscribed from newBlockHeaders');
				}
			});
		}
		if (tasks.length > 0 && !newBlockHeadersSubscription) {
			newBlockHeadersSubscription = web3.eth.subscribe('newBlockHeaders', (error, result) => {
				if (result && result.number > blockNumber) {
					blockNumber = result.number;
					logger.info('newBlockHeaders event occured. Block height=', blockNumber);
					let task;
					while (task = tasks.shift()) {
						workerqueue.push(task, task.responsehandler);
					}
				}
			});
		}
	}

	return ({
		/**
		 * addTask
		 * @param {object} options - task description
		 * func : work function , runs with (task) - returns a Promise
		 * responsehandler : when func resolves, runs this function 
		 * with (res,task) - returns a Promise
		 * data: initial state data for func
		 * @return {object} - task that is waiting for the next block.
		 */
		addTask: function(options) {
			let task = {
				func: options.func,
				responsehandler: options.responsehandler,
				data: options.data,
			};
			tasks.push(task);
			this.manageSubscription();
			return (task);
		},

		/**
		 * addTask
		 * cancels further scheduling of task ( running tasks keep running until complete )
		 * @param {object} task - the task to remove
		 */
		removeTask: function(task) {
			let index = tasks.indexOf(task);
			if (index !== -1) {
				tasks.splice(index, 1);
				this.manageSubscription();
			}
		},

		removeTasks: function(taskArray) {
			for (let i = 0; i < taskArray.length; i++) {
				this.removeTask(taskArray[i]);
			}
		},
		tasks: tasks,
	});
};