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
		task.func(task).then((res) => {
			callback(res, task);
		}).catch((err) => {
			logger.error('workerqueue error', err);
			callback(null, task);
		});
	}, config.concurrency || 2);

	q.drain = () => {
		logger.info('Task queue is drained');
	};

	return ({
		scheduledTask: require('./scheduledtask')(q),
		blockheaderTask: require('./blockheadertask')(q),
	});
};
