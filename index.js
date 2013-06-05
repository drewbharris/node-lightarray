var midi = require('midi'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);
    
var version = 1,
    values = [0, 0, 0, 0];

// Web app routes

app.get('/', function(req, res){
    var output = new midi.output();
    var name = output.getPortName(1);
    res.send(name);
});

// API routes

app.get('/api/v' + version + '/array', function(req, res){
    res.json({
        'values': values
    });
});

app.get('/api/v' + version + '/array/:element', function(req, res){
    res.send(values[req.params.element]);
});

app.post('/api/v' + version + '/array/:element', function(req, res){
    
});

io.sockets.on('connection', function (socket) {

});

server.listen(8000);
console.log('listening');
