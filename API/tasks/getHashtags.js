module.exports = function(web3) {

return ({

_getHashtags: function(address) {

  var hashtags = [{
    contractAddress: "0x000",
		hashtagName: "FaffyDeeRides",
		hashtagBalance: "233",
		hashtagItems: 31
  },{
    contractAddress: "0x000",
		hashtagName: "SponnetShop",
		hashtagBalance: "102",
		hashtagItems: 11
    }];

  return new Promise((resolve, reject) => {
    console.log('Hashtags: ', hashtags);
    resolve(hashtags);
  });
}


});

}
