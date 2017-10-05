module.exports = function (socket){

	socket.emit('connected', {
		version: '0.0.2'
	});

}