'use strict';

// Scheduled tasks are tasks that need to run when the next ETH block arrives.
const logger = require('../logs')();
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider(process.env.ETHWS));

module.exports = function(workerqueue) {

	var tasks = [];

	web3.eth.subscribe('newBlockHeaders', (error, result) => {
		logger.info('newBlockHeaders event occured');
		var task;
		while (task = tasks.shift()) {
			workerqueue.push(task, task.responsehandler);
		}
	});

	return ({


		/**
		 * addTask
		 * @param {object} options - task description
		 * func : work function , runs with (task) - returns a Promise
		 * responsehandler : when func resolves, runs this function with (res,task) - returns a Promise
		 * data: initial state data for func
		 * @return {object} - task that is waiting for the next block.
		 */
		addTask: function(options) {

			let task = {
				func: options.func,
				responsehandler: options.responsehandler,
				data: options.data
			};

			tasks.push(task);
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