'use strict';

const queue = require('async/queue');
const logger = require('../logs')();

// worker queue is the worker queue for tasks that need to run NOW

module.exports = function(config) {

	if (!config) {
		config = {};
	}

	// create a queue object with default concurrency 2
	var q = queue((task, callback) => {
		task.func(task).then((res) => {
			callback(res, task);
		}).catch((err) => {
			logger.error('workerqueue error',err);
			callback(null, task);			
		});
	}, config.concurrency || 2);

	const scheduledTask = require('./scheduledtask')(q);
	const blockheaderTask = require('./blockheadertask')(q);

	q.drain = () => {
		logger.debug('all items have been processed');
	};

	return ({
		scheduledTask: scheduledTask,
		blockheaderTask: blockheaderTask
	});
};