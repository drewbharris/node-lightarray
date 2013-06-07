var when = require('when'),
    util = require('util'),
    events = require('events'),
    serialport = require('serialport'),
    SerialPort = serialport.SerialPort;


var LightArray = function(opts){
    this.values = [0, 0, 0, 0];

    this.arduino = new SerialPort(opts.serialPort, {
        parser: serialport.parsers.readline("\n"),
        baudRate: 115200,
        dataBits: 8,
        parity: 'none',
        stopBits: 1,
        flowControl: false
    });

    if (opts.debug){
        this.arduino.on('data', function(data){
            console.log("From Arduino: " + data);
        });
    }

    this.arduino.on('open', function(){
        this.emit('ready');
    }.bind(this));

    this.getValues = function(){
        return this.values;
    };

    this.setValues = function(values){
        this.values = values;
    };

    this.setValue = function(element, value){
        this.values[element] = value;
    };

};
util.inherits(LightArray, events.EventEmitter);

LightArray.prototype.updateAll = function(newValues){
    var d = when.defer();
    this.setValues(newValues);
    console.log(this.getValues());
    this.arduino.write('[' +
        this.getValues()[0] + ',' +
        this.getValues()[1] + ',' +
        this.getValues()[2] + ',' +
        this.getValues()[3] + ']\n',
        function(err, resp){
            return d.resolve(this.values);
    });
    return d.promise;
};

LightArray.prototype.update = function(element, newValue){
    var d = when.defer();
    this.setValues(newValues);
    console.log(this.getValues());
    this.arduino.write('[' +
        this.getValues()[0] + ',' +
        this.getValues()[1] + ',' +
        this.getValues()[2] + ',' +
        this.getValues()[3] + ']\n',
        function(err, resp){
            return d.resolve(this.values);
    });
    return d.promise;
};

module.exports = LightArray;