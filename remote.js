var io = require('socket.io').listen(8001),
    LightArray = require('./lib/lightarray'),
    mdns = require('mdns'),
    exec = require('child_process').exec,
    RPiGPIO = require('./lib/rpi-gpio');

var lightArray = new LightArray({
    'serialPort': '/dev/ttyACM0',
    'debug': false,
    'sockets': {},
    'device': 'arduino'
});

var rPi = new RPiGPIO();

var ad;

lightArray.on('ready', function(){
    rPi.setup();
    io.sockets.on('connection', function (socket) {
        rPi.writeLed2(0);
        console.log('connection from host');
        socket.on('updateAll', function (data) {
            lightArray.writeToArduino(data.values);
        });
        socket.on('disconnect', function(){
            Pi.writeLed2(1);
        });
    });
    ad = mdns.createAdvertisement(new mdns.ServiceType('lightarray', 'tcp'), 8001);
    ad.start();
    console.log('remote listening on 8001');

});
