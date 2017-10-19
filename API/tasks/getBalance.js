module.exports = function(web3) {
	return ({
		/**
		 * Get Balance
		 * @param {String} address - The user's pub key
		 * @return {Array} - Balances of that user
		 */
		_getBalance: function(address) {
			return new Promise((resolve, reject) => {
				let promisesList = [];
				const minimeContract = require('../contracts/miniMeToken.json');
				const tokens = ['SWT', 'ARC'];
				const tokenIndex = require('../contracts/index.json');
				tokens.forEach((token) => {
					let tokenContract = new web3.eth.Contract(
						minimeContract.abi,
						tokenIndex[token]
					);
					promisesList.push(tokenContract.methods.balanceOf(address).call()
					.then((res) => {
						return {
							balance: res,
							publicKey: address,
							tokenSymbol: token,
							tokenContractAddress: tokenIndex[token],

						};
					}));
				});
				promisesList.push(web3.eth.getBalance(address)
				.then((res) => {
					return {
						balance: res,
						publicKey: address,
						tokenSymbol: 'ETH',
						tokenContractAddress: '0x0',
					};
				}));
				resolve(Promise.all(promisesList));
			});
		},
	});
};
