const should = require('should');
const io = require('socket.io-client');


const socketURL = 'http://localhost:8011?publicKey=0x7018d8f698bfa076e1bdc916e2c64caddc750944';

const options = {
	transports: ['websocket'],
	'force new connection': true
};

describe("Swarm City API socket client", function() {

	let client;

	it('should receive all related events right after socket connects', function(done) {
		client = io.connect(socketURL, options);
		client.on('connected', function(data) {
			console.log('client id=', client.id);
		});

		let promises = [];

		promises.push(new Promise((resolve, reject) => {
			client.on('balanceChanged', (data) => {
				console.log('balanceChanged', data);
				resolve();
			});
		}));

		promises.push(new Promise((resolve, reject) => {
			client.on('fxChanged', (data) => {
				console.log('fxChanged', data);
				resolve();
			});
		}));

		promises.push(new Promise((resolve, reject) => {
			client.on('gasPriceChanged', (data) => {
				console.log('gasPriceChanged', data);
				resolve();
			});
		}));

		promises.push(new Promise((resolve, reject) => {
			client.on('hashtagsChanged', (data) => {
				console.log('hashtagsChanged', data);
				resolve();
			});
		}));

		Promise.all(promises).then(() => {
			done();
		});

	});

	after(function(done) {
		client.close();
		done();
	});


});