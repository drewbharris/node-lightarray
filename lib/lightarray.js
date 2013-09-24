var when = require('when'),
    util = require('util'),
    events = require('events'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort;


var LightArray = function(opts){
    this.values = [0, 0, 0, 0, 0];
    this.sockets = opts.sockets;
    this.debug = opts.debug;
    this.frameInterval = null;
    this.framerate = 30;
    this.remote = null;

    if (process.env.DEVICE === 'arduino'){
        this.arduino = new SerialPort(opts.serialPort, {
            parser: serialport.parsers.readline("\n"),
            baudRate: 115200,
            dataBits: 8,
            parity: 'none',
            stopBits: 1,
            flowControl: false
        });
    }
    else {
        this.arduino = {
            write: function(data){

            }
        };
    }

    if (this.debug){
        if (process.env.DEVICE === 'arduino'){
            this.arduino.on('data', function(data){
                console.log("From Arduino: " + data);
            });
        }
    }

    if (process.env.DEVICE === 'arduino'){
        this.arduino.on('open', function(){
            this.emit('ready');
        }.bind(this));
    }
    else {
        setTimeout(function(){
            this.emit('ready');
        }.bind(this), 100);
    }

    this.getValues = function(){
        return this.values;
    };

    this.setValues = function(values){
        this.values = values;
    };

    this.setValue = function(element, value){
        this.values[element] = value;
    };

    this.getRemote = function(){
        return this.remote;
    };

    this.setRemote = function(remote){
        this.remote = remote;
    };

};
util.inherits(LightArray, events.EventEmitter);

// the idea here is that we're only writing data at a certain FPS
// this should fix the data overload problem
LightArray.prototype.start = function(){
    this.frameInterval = setInterval(function(){
        // @todo implement promise here, not sure it matters
        this.writeToArduino(this.getValues());
        this.writeToSockets(this.getValues());
        this.writeToRemote(this.getValues());
    }.bind(this), (1000/this.framerate));
};

LightArray.prototype.writeToSockets = function(data){
    Object.keys(this.sockets).map(function(id){
        this.sockets[id].emit('data', {
            'values': data
        });
    }.bind(this));
};

LightArray.prototype.writeToRemote = function(data){
    if (this.getRemote()){
        this.getRemote().emit('updateAll', {
            'values': this.getValues()
        });
    }
};

LightArray.prototype.writeToArduino = function(data){
    var d = when.defer();

    this.arduino.write('[' +
        data[0] + ',' +
        data[1] + ',' +
        data[2] + ',' +
        data[3] + ',' +
        data[4] + ']\n',
        function(err, resp){
            return d.resolve(this.getValues());
    }.bind(this));

    return d.promise;
};

LightArray.prototype.updateAll = function(newValues){
    var d = when.defer();

    this.setValues(newValues);
    if (this.debug){
        console.log(this.getValues());
    }

    return d.promise;
};

LightArray.prototype.update = function(element, newValue){
    var d = when.defer();
    this.setValue(element, newValue);
    if (this.debug){
        console.log(this.getValues());
    }
    this.arduino.write('[' +
        this.getValues()[0] + ',' +
        this.getValues()[1] + ',' +
        this.getValues()[2] + ',' +
        this.getValues()[3] + ',' +
        this.getValues()[4] + ']\n',
        function(err, resp){
            return d.resolve(this.getValues());
    }.bind(this));
    this.writeToSockets(this.getValues());
    return d.promise;
};

module.exports = LightArray;