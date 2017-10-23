const logs = require('../logs.js')();
const minimeContract = require('../contracts/miniMeToken.json');

module.exports = function(web3) {
	return ({
		_checkApprovalStatus: function(data) {
			return new Promise((resolve, reject) => {

				console.log(data);

				var contractInstance = new web3.eth.Contract(minimeContract.abi, "0xb9e7f8568e08d5659f5d29c4997173d84cdf2607");

				contractInstance.methods.allowance(data.publicKey, data.hashtagAddress).call()
				.then(function(approvalStatus){
					// if approval comes back with an existing allowance,
					// we need to check if the allowance is large enough to do the tx.
					// large enough means "bigger or equal than the dealvalue + hashtagfee"

						// if approval is 0
						if(approvalStatus==0) {
							resolve(0);
						} else if(approvalStatus >= data.allowanceNeeded) {
							resolve(2);
						} else if(approvalStatus < data.allowanceNeeded) {
							resolve(1);
						} else {
							//catch err
							resolve(3);
						};
							// resolve 0
						// if approval is not 0
							// Check if its enough for the deal. If yes,
								// resolve 2
							// if no,
							// resolve 1
						resolve(approvalStatus);
				 }).catch(function(err){
						console.log('error in approvalStatus');
				 });
			});
		},
	});
};
