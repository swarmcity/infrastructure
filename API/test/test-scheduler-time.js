'use strict';

require('dotenv').config({path: '../../.env'});
const workerQueue = require('../scheduler/workerQueue')();

describe('Swarm City scheduler', function() {

	it('should receive all related events right after socket connects', function(done) {
		let myTask = workerQueue.scheduledTask.addTask({
			nextRun: (new Date).getTime() + 1000,
			func: hello,
			//responsehandler: responseHandler,
			interval : 1000,
			data: 'a'
		});


		console.log('there are ', workerQueue.scheduledTask.tasks.length, 'tasks in the scheduledTask queue');
		console.log('scheduler will wake up at ', workerQueue.scheduledTask.nextRun);


		//workerQueue.scheduledTask.removeTask(myTask);


		console.log('there are ', workerQueue.scheduledTask.tasks.length, 'tasks in the scheduledTask queue');
		console.log('scheduler will wake up at ', workerQueue.scheduledTask.nextRun);

		workerQueue.scheduledTask.addTask({
			nextRun: (new Date).getTime() + 2000,
			func: hello,
			responsehandler: responseHandler,
			data: 'b'
		});

		workerQueue.scheduledTask.addTask({
			nextRun: (new Date).getTime() + 3000,
			func: hello,
			responsehandler: responseHandler,
			data: 'c'
		});


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
		// workerQueue.scheduledTask.addTask({
		// 	nextRun: task.nextRun + 1000,
		// 	func: task.func,
		// 	responsehandler: responseHandler,
		// 	data: task.data
		// });
		resolve();
	});
}

function responseHandler2(res, task) {
	return new Promise((resolve, reject) => {
		console.log('Hello 2 Finished... RES=', res, 'task=', task);
		// scheduler.addTask(scheduler.makeScheduledTask({
		// 	nextRun: (new Date).getTime() + 1000,
		// 	func: hello,
		// 	responsehandler: responseHandler2,
		// 	data: '-' //task.data
		// }));
		//resolve(task.data);
	});
}