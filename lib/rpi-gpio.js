var util = require('util'),
    events = require('events'),
    exec = require('child_process').exec;

var RPiGPIO = function(){
    this.led1 = 0;
    this.led2 = 1;
    this.buttonInterval = null;
};

util.inherits(RPiGPIO, events.EventEmitter);

RPiGPIO.prototype.setup = function(){
    var self = this;

    exec('gpio mode ' + this.led1 + ' out');
    exec('gpio mode ' + this.led2 + ' out');

    exec('gpio write ' + this.led1 + ' 1');
    exec('gpio write ' + this.led2 + ' 1');

}

RPiGPIO.prototype.writeLed1 = function(val){
    exec('gpio write ' + this.led1 + ' ' + val);
}

RPiGPIO.prototype.writeLed2 = function(val){
    exec('gpio write ' + this.led2 + ' ' + val);
}

module.exports = RPiGPIO;
