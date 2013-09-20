var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server, {
        'log': false
    }),
    ioClient = require('socket.io-client'),
    fs = require('fs'),
    midi = require('midi'),
    LightArray = require('./lib/lightarray');

var version = 1,
    midiInput,
    relay,
    relayAddress = "ws://localhost:8001",
    relayConnectionInterval = 3000,
    relayConnectionTimer,
    sockets = {};

var lightArray = new LightArray({
    'serialPort': '/dev/tty.usbmodem15001',
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
    lightArray.start();
    midiInput.on('message', function(time, message){
        if (message[0] === 176 && 41 < message[1] < 46){
            lightArray.update(message[1] - 42, message[2]);
        }
    });

    // initialize relay
    relay = ioClient.connect(relayAddress);
    lightArray.setRelay(relay);
    relay.on('data', function(data){
        lightArray.updateAll(data.values);
    });
    // relayConnectionTimer = setInterval(function(){
    //     console.log('attempting connection');
    //     console.log(relay.socket.connected);
    //     if (!relay.socket.connected){
    //         delete relay;
    //         relay = ioClient.connect(relayAddress);
    //         lightArray.setRelay(relay);
    //         relay.on('data', function(data){
    //             lightArray.updateAll(data.values);
    //         });
    //     }
    // }, relayConnectionInterval);



    // initialize web server stuff

    server.listen(8000);
    console.log('listening');

});
