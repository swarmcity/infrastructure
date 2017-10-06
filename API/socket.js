const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Web3 = require('web3');

function printMultipleMessages(error, result) {
    for (resultIndex in result) {
        printSingleMessage(error, result[resultIndex]);
    }
}
function printSingleMessage(error, result) {
    try {
        if (!error) {
            console.log(result);
        } else {
            console.log(error);
        }
    } catch (e) {
        console.log(e);
    }
}

const tokenAddress = "0xb9e7f8568e08d5659f5d29c4997173d84cdf2607";
const web3Hostname = 'ws://localhost:8546';
const tokenAbi = [{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_amount","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_amount","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_amount","type":"uint256"}],"name":"Approval","type":"event"}];

var web3 = new Web3(Web3.givenProvider || web3Hostname);
var bittrexAddress = '0xFBb1b73C4f0BDa4f67dcA266ce6Ef42f520fBB98';

var myContract = new web3.eth.Contract(tokenAbi, tokenAddress);
console.log("contract options: " + myContract.options)

console.log("balance of bittrex: ");
myContract.methods.balanceOf(bittrexAddress).call(printSingleMessage);


io.on('connect', (socket) => {
    socket.emit('connected');
    socket.on('subscribe', (data, fn) => {
		switch (data.channel) {
            case 'balance':
                console.log('balance')
				// balanceSubscribeHandler(socket, data, fn);
				break;
            case 'hashtags':
                //hashtagsSubscribeHandler(socket, data, fn);
                break;
			default:
				console.log('unknown channel', data.channel);
				break;
		}
    });
});

// function balanceSubscribeHandler(socket, data, fn) {
//
//     fn({
//         success: true,	// http 200 here..
//         balance: balance, //.toString(10),
//         subscription: 'aaaaa'
//     });
// }

const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);
