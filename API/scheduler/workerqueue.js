'use strict';

const queue = require('async/queue');
const logger = require('../logs')();

// worker queue is the worker queue for tasks that need to run NOW

module.exports = (config) => {
	if (!config) {
		config = {};
	}

	// create a queue object with default concurrency 2
	let q = queue((task, callback) => {
		task.isRunning = true;
		task.startDate = (new Date).getTime();
		task.func(task).then((res) => {
			task.isRunning = false;
			task.endDate = (new Date).getTime();
			task.success = true;
			logger.info('task success. Duration',task.endDate - task.startDate,'ms');
			callback(res, task);
		}).catch((err) => {
			logger.error('task error', err);
			task.isRunning = false;
			task.endDate = (new Date).getTime();
			task.success = false;
			callback(null, task);
		});
	}, config.concurrency || 2);

	q.drain = () => {
		logger.info('The task queue is drained');
	};

	return ({
		scheduledTask: require('./scheduledtask')(q),
		blockheaderTask: require('./blockheadertask')(q),
	});
};
