'use strict';

const logger = require('../logs')();

module.exports = function(web3) {
	const request = require('request');
	let result;
	return ({
		updateFx: function() {
			return new Promise((resolve, reject) => {
				request('https://api.coinmarketcap.com/v1/ticker/swarm-city/?convert=EUR',
				(error, response, body) => {
					if (error || (response && response.statusCode !== 200)) {
						reject(error);
					}
					let parsedBody = JSON.parse(body);
					let result = {
						price_btc: parsedBody[0].price_btc,
						price_eur: parsedBody[0].price_eur,
						price_usd: parsedBody[0].price_usd,
						symbol: parsedBody[0].symbol,
					};
					logger.info('updateFx result=',result);
					resolve(result);
				});
			});
		},
		getFx: function() {
			return new Promise((resolve, reject) => {
				resolve(result || this._updateFx());
			});
		},
	});
};
