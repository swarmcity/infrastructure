module.exports = function(web3) {

	return ({

		_getHashtagItems: function(hashtag) {


			/**
			 * Represents the hashtagsItems response
			 * @response
			 * @param {number} response - The HTTP response code
			 * @param {string} subscriptionId - String generated on server
			 * @param {array} itemsData - an array of OnHashtagItemsSubscribe objects
			 * @param {string} hashtagName - the name of the hashtag contract
			 * @param {object} hashtagData - the meta data of the hashtag contract
			 * @param {string} hashtagDescription - The description of the hashtag
			 * @param {number} hashtagItems - The number of hashtag items / deals on chain
			 * @param {string} hastagMaintainer - The public key of the hashtag maintainer
			 * @param {string} hastagContact - Array with contact information
			 * @param {string} contactName - The name of the contact ('Twitter')
			 * @param {string} contactLink - The link to the contact info ('https://twitter.com/NeedARideSupport')
			 */

			const returnObject = [{},
				{
					"response": 200,
					"hashtagData": [{
						"hashtagMaintainer": "0xA4E3e53e89e575b32249e6105dA159a4f48D34de",
						"hashtagName": "BoardwalkTest",
						"hashtagDescription": "This is the testing hashtag for Boardwalk v2",
						"hashtagItems": 4,
						"hashtagContact": [
							{
								"contactName": "Bernd Lapp",
								"contactLink": "https://twitter.com/BerndLapp"
							}
						]
					}],
					 "itemsData":
					{
					"itemId": "0x000",
					"name": "Faffy D",
					"avatar": "IPFS",
					"balance": 10,
					"description": "Need a ride from McDonalds Meir to CryptoSpot",
					"dateTime": 1508335855072,
					"location": "u1557fpvm1hb",
					"value": 12
},
"itemsData":
					{
					"itemId": "0x000",
					"name": "Faffy D",
					"avatar": "IPFS",
					"balance": 10,
					"description": "Need a ride from McDonalds Meir to CryptoSpot",
					"dateTime": 1508335855072,
					"location": "u1557fpvm1hb",
					"value": 12
},
"itemsData":
					{
					"itemId": "0x000",
					"name": "Faffy D",
					"avatar": "IPFS",
					"balance": 10,
					"description": "Need a ride from McDonalds Meir to CryptoSpot",
					"dateTime": 1508335855072,
					"location": "u1557fpvm1hb",
					"value": 12
}

				}]
		;

			return new Promise((resolve, reject) => {
				console.log('HashtagsItems: ', returnObject);
				resolve(returnObject);
			});
		}

	});

}
