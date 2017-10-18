module.exports = function(web3) {

	const request = require('request');

	var result;

	return ({

		_updateFx: function() {

			return new Promise((resolve, reject) => {
				request('https://api.coinmarketcap.com/v1/ticker/swarm-city/?convert=EUR', (error, response, body) => {

					if (error && (response || response.statusCode !== 200)) {
						reject(error);
					}

					let p = JSON.parse(body);

					let r = {
						price_btc: p[0].price_btc,
						price_eur: p[0].price_eur,
						price_usd: p[0].price_usd,
						symbol: p[0].symbol
					};
					resolve(r);
				});
			});
		},

		_getFx: function() {
			return new Promise((resolve, reject) => {
				resolve(result || this._updateFx());
			});
		}
	});

}