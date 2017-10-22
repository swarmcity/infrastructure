const logs = require('../logs.js')();
const minimeContract = require('../contracts/miniMeToken.json');

module.exports = function(web3) {
	return ({
		_estimateGas: function(data) {
			return new Promise((resolve, reject) => {

				console.log(data);

				var simpleDealContract = new dragon.Contract(abis.hashtag.abi, "0x9a166b528a59A993Fd9dce2035f912F9EB2783c6");

				var encodedSimpleDealTx = simpleDealContract.methods.makeDealForTwo("0x4e03657aea45a94fc7d47ba826c8d667c0d1e6e33a64a036ec44f58fa12d6c45", 600000000000000000, "ipfshash").encodeABI();

				const rawTx = {
					to: "0x9a166b528a59A993Fd9dce2035f912F9EB2783c6",
					value: "600000000000000000",
					data: encodedSimpleDealTx,
					chainId: 1
				};

				var tx = new dragon.Transaction(rawTx);
				var serializedtx = dragon.addHexPrefix(tx.serialize().toString('hex'));

				// Call the api for estimateGas
				// data.publicKey
				// data.extradata
				const getGasPriceData = {
					hashtagAddress: "0x9a166b528a59A993Fd9dce2035f912F9EB2783c6",
					extraData: serializedtx,
					publicKey: window.kf[3].publicKey,
					dealValue: 600000000000000000
				}

				var contractInstance = new web3.eth.Contract(minimeContract.abi, "0xb9e7f8568e08d5659f5d29c4997173d84cdf2607");
// [ KF ] these values need to be encoded diff / i think we even have to call a diff function // see ApproveAndCallFallBack // asked jordi for help / aragon too. 
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
