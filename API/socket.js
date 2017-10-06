const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const Web3 = require('web3');

const web3 = new Web3.providers.WebsocketProvider("ws://localhost:8546");
const minimeContract_abi = require('./contracts/MiniMeToken.json');
var minimeContract = new web3.eth.Contract(minimeContract_abi.abi, '0xb9e7f8568e08d5659f5d29c4997173d84cdf2607');

console.log(minimeContract.methods.symbol().call());
console.log(minimeContract.methods.balanceOf('0x7018d8f698bfa076e1bdc916e2c64caddc750944').call());

io.on('connect', (socket) => {
    socket.emit('connected');
    socket.on('subscribe', (data, fn) => {
		switch (data.channel) {
            case 'balance':
                console.log('balance')
				//balanceSubscribeHandler(socket, data, fn);
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

const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);
