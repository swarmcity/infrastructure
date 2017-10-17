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
    var promisesList = [];
    var minimeContract = require('../contracts/MiniMeToken.json');
    var tokens = ["SWT", "ARC"];
    var tokenIndex = require('../contracts/index.json');

    tokens.forEach((token) => {
      var tokenContract = new web3.eth.Contract(minimeContract.abi, tokenIndex[token]);
      promisesList.push(tokenContract.methods.balanceOf(address).call().then((res) => {
        return {  token: token,
                  balance: res
              };
      }));
    });

    resolve(Promise.all(promisesList));
  });
},

/**
* Returns the abi for the requests contract
* @param {string} contractName is the name of the contract
* @return {abi} abi repreents the contract's abi
*/

_loadAbi: function(contractName) {
    return new Promise((resolve, reject) => {
        fs.readFile('../base/src/contracts/' + contractName + '.json', (err, data) => {
          if (err) throw err;
          console.log(data);
          const json = JSON.parse(data);
          resolve(json);
        });
    });
},

/**
* Returns the contract address
* @param {string} contractName is the name of the contract
* @return {string} contractAddress repreents the
* contracts address on main-net
*/
_loadAddress: function(contractName) {
    return new Promise((resolve, reject) => {
        const xobj = new XMLHttpRequest();
        const path = '../base/src/contracts/index.json';
        xobj.overrideMimeType('application/json');
        xobj.open('GET', path, true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState == 4 && xobj.status == '200') {
                const json = JSON.parse(xobj.responseText);
                resolve(json);
            }
        };
        // Request the json
        xobj.send(null);
    });
}

});

}
