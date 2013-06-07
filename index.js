var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    fs = require('fs'),
    LightArray = require('./lib/lightarray');

var lightArray = new LightArray({
    'serialPort': '/dev/tty.usbserial-A6008hrf',
    'debug': true
});

var version = 1;

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

});

lightArray.on('ready', function(){

    // initialize midi stuff




    // initialize web server stuff

    server.listen(8000);
    console.log('listening');

});
