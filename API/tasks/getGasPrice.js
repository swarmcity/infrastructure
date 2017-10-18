module.exports = function(web3) {

	return ({

		_getGasPrice: function(address) {

			return new Promise((resolve, reject) => {
				web3.eth.getGasPrice().then((gasPrice) => {
					console.log('GasPrice: ', gasPrice.toString(10));
					resolve(gasPrice.toString(10));
				});
			});

		}

	});

}