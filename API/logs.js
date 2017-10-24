const winston = require('winston');

module.exports = function() {
	return Object.assign(winston, {
		/**
		 * Significant events get logged as an audit trail
		 * @param {Object} item 
		 * @param {Strring} type 
		 */
		_eventLog: function(item, type) {
			winston.info(item);
		},
		/**
		 * Errors get logged 
		 * @param {Object} item 
		 * @param {Strring} type 
		 */
		_errorLog: function(item, type) {
			winston.error(item);
		},
	});
};