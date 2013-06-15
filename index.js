var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {
        'log': false
    }),
    fs = require('fs'),
    midi = require('midi'),
    LightArray = require('./lib/lightarray');

var version = 1,
    midiInput,
    sockets = {};

var lightArray = new LightArray({
    'serialPort': '/dev/tty.usbserial-A6008hrf',
    'debug': false,
    'sockets': sockets
});

app.use("/js", express.static(__dirname + '/web/js'));
app.use("/css", express.static(__dirname + '/web/css'));
app.use(express.bodyParser());

// Web app routes

app.get('/', function(req, res){
    fs.readFile(__dirname + "/web/index.html", "UTF-8", function(err, data){
        res.send(data);
    });
});

// API routes

app.get('/api/v' + version + '/array', function(req, res){
    res.send({
        'values': lightArray.getValues()
    });
});

app.post('/api/v' + version + '/array', function(req, res){
    lightArray.updateAll(req.body.values);
});

app.get('/api/v' + version + '/array/:element', function(req, res){
    res.send(lightArray.getValues()[req.params.element]);
});

app.post('/api/v' + version + '/array/:element', function(req, res){
    lightArray.update(req.params.element, req.body.value);
});

io.sockets.on('connection', function (socket) {
    sockets[socket.id] = socket;

    socket.on('update', function(data){
        lightArray.update(data.element, data.value);
    });
    socket.on('updateAll', function(data){
        lightArray.updateAll(data.values);
    });

    socket.on('disconnect', function(){
        delete sockets[socket.id];
    });
});

lightArray.on('ready', function(){

    // initialize midi stuff
    midiInput = new midi.input();
    midiInput.openVirtualPort("LightArray");
    lightArray.initializeInterval();
    midiInput.on('message', function(time, message){
        if (message[0] === 176 && 41 < message[1] < 46){
            lightArray.update(message[1] - 42, message[2]);
        }
    });

    // initialize web server stuff

    server.listen(8000);
    console.log('listening');

});
