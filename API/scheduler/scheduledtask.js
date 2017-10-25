'use strict';

// Scheduled tasks are tasks that need to run any time in the future , or right now.

module.exports = function(workerqueue) {
	let tasks = [];
	let nextTaskTimer;
	let nextRun;

	return ({
		/**
		 * update schedule
		 * - sorts tasks on due date
		 * - shifts & pushes tasks that have to run into the worker queue
		 * - calculates & sets the interval when the updateschedule needs to run again ( if any )
		 * - sleep
		 */
		_updateSchedule: function() {
			tasks.sort((a, b) => {
				return a.nextRun - b.nextRun;
			});

			let now = (new Date).getTime();
			while (tasks[0] && tasks[0].nextRun <= now) {
				let task = tasks.shift();
				workerqueue.push(task, task.responsehandler || function() {});
			}

			clearTimeout(nextTaskTimer);
			this.nextRun = null;

			let due = 0;
			if (tasks[0]) {
				due = tasks[0].nextRun - now;
				if (due > 0) {
					nextTaskTimer = setTimeout(() => {
						this._updateSchedule();
					}, due);
					this.nextRun = tasks[0].nextRun;
				}
			} else {
				// there are no more tasks
			}
		},

		/**
		 * addTask
		 * @param {object} options - task description
		 * nextRun : unix timestamp ( milliseconds ) when task needs to run
		 * func : work function , runs with (task) - returns a Promise
		 * responsehandler : when func resolves, runs this function 
		 * with (res,task) - returns a Promise
		 * interval : when responsehandler is not available - auto-reschedule at this interval
		 * data: initial state data for func
		 * @return {object} - task that is scheduled.
		 */
		addTask: function(options) {
			let task = {
				nextRun: options.nextRun || 0,
				func: options.func,
				responsehandler: options.responsehandler,
				data: options.data,
			};

			if (!options.responsehandler && options.interval) {
				task.responsehandler = (res, task) => {
					this.addTask({
						nextRun: (new Date).getTime() + options.interval,
						func: task.func,
						data: task.data,
						responsehandler: task.responsehandler,
					});
				};
			}

			tasks.push(task);
			this._updateSchedule();
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
				this._updateSchedule();
			}
		},

		removeTasks: function(taskArray) {
			for (let i = 0; i < taskArray.length; i++) {
				this.removeTask(taskArray[i]);
			}
		},

		tasks: tasks,
		nextRun: nextRun,
	});
};
