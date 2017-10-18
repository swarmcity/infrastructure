module.exports = function(web3) {

	return ({
		/**
		 * Get Balance
		 * @param {String} address - The user's pub key
		 * @param {Array} tokens - The tokens to be fetched
		 * @return {Array} - Balances of that user
		 */

		/**
		 * Represents a users balance
		 * @response
		 * @param {number} response - The HTTP response code
		 * @param {array} balances - An array of tokens and their balance
		 * @param {string} pubkey - A public key (0x...)
		 * @param {array} data - an array of balance objects
		 * @param {string} tokenSymbol - The token's short name
		 * @param {string} tokenName - The token's long name ('Swarm City Token', 'NeedARide', 'Ether')
		 * @param {string} tokenContractAddress - A token address (0x...)
		 * @param {string} balance - in wei or smallest erc20
		 * @param {string} subscription - the socket connection id
		 * @param {number} nonce - nonce
		 */

		_getBalance: function(address) {

			return new Promise((resolve, reject) => {
				// Iterate over the tokens
				let promisesList = [];
				const minimeContract = require('../contracts/MiniMeToken.json');
				const tokens = ["SWT", "ARC"];
				const tokenIndex = require('../contracts/index.json');

				tokens.forEach((token) => {
					let tokenContract = new web3.eth.Contract(minimeContract.abi, tokenIndex[token]);
					promisesList.push(tokenContract.methods.balanceOf(address).call().then((res) => {
						return {
							balance: res,
							publicKey: address,
							tokenSymbol: token,
							tokenContractAddress: tokenIndex[token],

						};
					}));
				});

				promisesList.push(web3.eth.getBalance(address).then((res) => {
					return {
						balance: res,
						publicKey: address,
						tokenSymbol: 'ETH',
						tokenContractAddress: '0x0',
					};
				}));

				resolve(Promise.all(promisesList));
			});
		}

	});

}