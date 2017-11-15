const logs = require('../logs.js')();

module.exports = function(web3) {
	return ({
		_estimateGas: function(data) {
			return new Promise((resolve, reject) => {

				console.log(data);

				web3.eth.estimateGas({to: data.to, data: data.data})
				.then(function(gasAmount){
						resolve(gasAmount);
				 }).catch(function(error){
						console.log('error in estimateGas');
				 });
			});
		},
	});
};
