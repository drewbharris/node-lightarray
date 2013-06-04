var midi = require('midi'),
    io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = require('http').createServer(app);

app.get('/', function(req, res){
    var output = new midi.output();
    var name = output.getPortName(1);
    res.send(name);
});

app.listen(8000);
console.log('listening');
