var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    serialport = require('serialport'),
    fs = require('fs'),
    SerialPort = serialport.SerialPort;

var arduino = new SerialPort('/dev/tty.usbserial-A6008hrf', {
    parser: serialport.parsers.readline("\n"),
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
});

var version = 1,
    values = [0, 0, 0, 0];

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
        'values': values
    });
});

app.post('/api/v' + version + '/array', function(req, res){
    values = req.body.values;
    console.log(values);
    arduino.write('['+values[0]+','+values[1]+','+values[2]+','+values[3]+']\n', function(err, resp){
        res.send({
            'values': values
        });
    });
});

app.get('/api/v' + version + '/array/:element', function(req, res){
    res.send(values[req.params.element]);
});

app.post('/api/v' + version + '/array/:element', function(req, res){
    values[req.params.element] = req.body.value;
    console.log(values);
    arduino.write('['+values[0]+','+values[1]+','+values[2]+','+values[3]+']\n', function(err, resp){
        res.send({
            'values': values
        });
    });
});

io.sockets.on('connection', function (socket) {

});

arduino.on('open', function(){

    server.listen(8000);
    console.log('listening');

    arduino.on('data', function(data){
        console.log("From Arduino: " + data);
    });

    // arduino.write('[1,2,3,4]\n', function(err, res){
    //     console.log(err, res)
    // });
});
