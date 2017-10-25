'use strict';
require('dotenv').config({
	path: '../.env',
});

const logger = require('../logs')();

const workerQueue = require('../scheduler/workerqueue')();

describe('Swarm City scheduler', function() {
	it('should add & unroll blockheaderTask task', function(done) {
		workerQueue.blockheaderTask.addTask({
			func: (task) => {
				return new Promise((resolve, reject) => {
					logger.info('Hello', task.data);
					task.data = task.data + '+';
					resolve(task.data);
				});
			},
			responsehandler: (res, task) => {
				return new Promise((resolve, reject) => {
					logger.info('Hello Finished... RES=', res, 'task=', task);
					resolve();
				});
			},
			data: 'a',
		});
	});
});
