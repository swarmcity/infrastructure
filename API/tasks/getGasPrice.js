module.exports = function(web3) {

return ({

_getGasPrice: function(address) {

  return new Promise((resolve, reject) => {
    var gasPrice = web3.eth.getGasPrice().then((gasPrice) => {
      console.log('GasPrice: ', gasPrice.toString(10)); // "10000000000000"
      resolve(gasPrice.toString(10));
    });
  });
}


});

}
