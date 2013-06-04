var midi = require('midi'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.get('/', function(req, res){
    var output = new midi.output();
    var name = output.getPortName(1);
    res.send(name);
});

io.sockets.on('connection', function (socket) {

});

server.listen(8000);
console.log('listening');
