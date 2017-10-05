module.exports = function(socket) {
	socket.on('subscribe', (data, fn) => {
		switch (data.channel) {
			case 'balance':
				balanceSubscribeHandler(socket, data, fn);
				break;
				//case ''
            case 'hashtags':
                hashtagsSubscribeHandler(socket, data, fn);
                break;
            //case ''
			default:
				console.log('unknown channel', data.channel);
				fn({
					success: false,
					message: 'unknown channel'
				});
				break;
		}
	});
};

//TODO create in-memory map of token address to token long/short names
var tokens = {}

function balanceSubscribeHandler(socket, data, fn) {
	if (!validateBalance(data.args)) {
        console.log('bad data');
        fn({
            success: false,
            message: 'bad input data'
        });
	} else {
        let pubKey = data.args.pubkey;

        let tokenAddress = data.args.tokens[0];

        fn({
            response: 200,
            subscriptionId: socket.id,
            data: [
                {
                    pubkey: data.args.pubkey,
                    tokenContractAddress: data.args.tokens[0],
                    tokenSymbol: 'SWT',
                    tokenName: 'Swarm City Token',
                    balance: 123
                }
            ]


        });
	}

}
function validateBalance(dataArgs) {
	if (dataArgs == null) {
		return false;
	}

    if (dataArgs.pubkey == null) {
        return false;
    }

    if (dataArgs.tokens == null) {
        return false;
    }

    if (dataArgs.tokens.length > 10) {
        return false;
    }

}

function hashtagsSubscribeHandler(socket, data, fn) {

}
