module.exports = function(web3) {

  const https = require('https');

	return ({

		_getFx: function(address) {
			return new Promise((resolve, reject) => {
				const url = 'https://api.swarm.city/swtprice';
				https.get(url, function(res) {
					let body = '';
					res.on('data', function(chunk) {
						body += chunk;
					});
					res.on('end', function() {
						const prices = JSON.parse(body);
						console.log("Got a response: ", prices);
						resolve(prices);
					});
				}).on('error', function(e) {
					console.log("Got an error: ", e);
				});
			});

		}

	});

}