getBalance(address, token) {
    return new Promise((resolve, reject) => {
        resolve(this._getBalance(address, token, 'main', 1));
    });
}

/**
 * Get Balance.
 * @param {String} address
 * @param {int} network index
 * @param {int} provider index
 * @return {BigNumber} swtBalance amount of tokens held at address
 */
_getBalance(address, contractName, network, provider) {
    return new Promise((resolve, reject) => {
        Promise.all(
            [this._loadAbi(contractName),
                this._loadAddress(contractName),
                this._loadProviders()]
        ).then((data) => {
            // constructing contract from abi/address should happen globally
            const abiArray = data[0].abi;
            const contractAddress = data[1][contractName];
            const providers = data[2]['ropsten'];
            let web3 = new dragon.Web3();
            web3.setProvider(
                new web3.providers.HttpProvider(providers[provider]));
            let contract = web3.eth.contract(abiArray)
                .at(contractAddress);
            contract.getBalance(address, function(error, response) {
                if (error) {
                    reject(error);
                } else {
                    resolve(response);
                }
            });
        })
            .catch((err) => {
                reject(err);
            });
    });
}

/**
* Returns the abi for the requests contract
* @param {string} contractName is the name of the contract
* @return {abi} abiu repreents the contracts abi
*/
_loadAbi(contractName) {
    return new Promise((resolve, reject) => {
        const xobj = new XMLHttpRequest();
        const path = '../base/src/contracts/' + contractName + '.json';
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

/**
* Returns the contract address
* @param {string} contractName is the name of the contract
* @return {string} contractAddress repreents the
* contracts address on main-net
*/
_loadAddress(contractName) {
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

 /**
 * Returns the web3 providers
 * @param {string} network limit to a network
 * @return {array} providers
 */
_loadProviders() {
    return new Promise((resolve, reject) => {
        const xobj = new XMLHttpRequest();
        const path = '../base/src/contracts/providers.json';
        xobj.overrideMimeType('application/json');
        xobj.open('GET', path, true);
        xobj.onreadystatechange = () => {
            if (xobj.readyState == 4 && xobj.status == '200') {
                const json = JSON.parse(xobj.responseText);
                resolve(json['web3']);
            }
        };
        // Request the json
        xobj.send(null);
    });
}
