const logs = require('../logs.js')();
module.exports = function(web3) {
	return ({
		_processTx: function(signedtx) {
			return new Promise((resolve, reject) => {
				web3.eth.sendSignedTransaction(signedtx).then((txhash) => {
					logs._eventLog('txHash: ', txhash);
					resolve(txhash);
				});
			});
		},
	});
};
