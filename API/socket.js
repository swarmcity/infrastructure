var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);


const PORT = 8011;
const HOST = '0.0.0.0';
server.listen(PORT, HOST);


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
        console.log(data);
    });
});

