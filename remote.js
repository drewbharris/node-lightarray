var io = require('socket.io').listen(8001),
    LightArray = require('./lib/lightarray'),
    mdns = require('mdns');

var lightArray = new LightArray({
    'serialPort': '/dev/tty.usbmodem15001',
    'debug': true,
    'sockets': {}
});

var ad;

lightArray.on('ready', function(){
    io.sockets.on('connection', function (socket) {
        console.log('connection from host');
        socket.on('updateAll', function (data) {
            lightArray.updateAll(data);
        });
    });
    ad = mdns.createAdvertisement(new mdns.ServiceType('lightarray', 'tcp'), 8001);
    ad.start();
    console.log('remote listening on 8001');
});