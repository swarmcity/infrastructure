const logs = require('../logs.js')();
const minimeContract = require('../contracts/miniMeToken.json');

module.exports = function(web3) {
	return ({
		_estimateGas: function(data) {
			return new Promise((resolve, reject) => {

				console.log(data);

				var contractInstance = new web3.eth.Contract(minimeContract.abi, "0xb9e7f8568e08d5659f5d29c4997173d84cdf2607");

				contractInstance.methods.approveAndCall(data.hashtagAddress, data.dealValue, data.extraData).estimateGas({from: data.publicKey})
				.then(function(gasAmount){
						resolve(gasAmount);
				 }).catch(function(error){
						console.log('error in estimateGas');
				 });
			});
		},
	});
};
