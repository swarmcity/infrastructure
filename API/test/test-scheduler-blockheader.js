'use strict';
require('dotenv').config({path: '../../.env'});
const workerQueue = require('../scheduler/workerqueue')();

describe('Swarm City scheduler', function() {

	it('should receive all related events right after socket connects', function(done) {
		let myTask = workerQueue.blockheadertask.addTask({
			func: hello,
			responsehandler: responseHandler,
			data: 'a'
		});


		console.log('there are ', workerQueue.scheduledTask.tasks.length, 'tasks in the scheduledTask queue');
		

	});

});

function hello(task) {
	return new Promise((resolve, reject) => {
		console.log('Hello', task.data);
		task.data = task.data + '+';
		resolve(task.data);
	});
}

function responseHandler(res, task) {
	return new Promise((resolve, reject) => {
		console.log('Hello Finished... RES=', res, 'task=', task);
		workerQueue.blockheadertask.addTask({
			func: hello,
			responsehandler: responseHandler,
			data: task.data
		});
		resolve();
	});
}
