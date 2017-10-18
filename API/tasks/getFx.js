module.exports = function(web3) {

	const cache = require('memory-cache');
	const request = require('request');

	return ({

		_getFx: function(address) {

			return new Promise((resolve, reject) => {

				const r = cache.get('swtprice');
				if (r) {
					resolve(r.data);
				} else {

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

            // we should cache the response, to avoid our IP
            // being banned from the coinmarketcap API
            // see https://coinmarketcap.com/api/
            // prices are updated every 5 minutes
            // we cache 1 minute
						cache.put('swtprice', [Object.assign({}, r, {
							cached_at: new Date()
						})], 60 * 1000);

						resolve(r);

					});

				}

			});
		}
	});

}