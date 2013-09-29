var util = require('util'),
    events = require('events'),
    exec = require('child_process').exec;

var RPiGPIO = function(){
    this.button1 = 7;
    this.led1 = 0;
    this.led2 = 1;
    this.buttonInterval = null;
};

util.inherits(RPiGPIO, events.EventEmitter);

RPiGPIO.prototype.setup = function(){
    var self = this;

    exec('gpio mode ' + this.button1 + ' in');
    exec('gpio mode ' + this.led1 + ' out');
    exec('gpio mode ' + this.led2 + ' out');

    exec('gpio write ' + this.led1 + ' 1');
    exec('gpio write ' + this.led2 + ' 1');

    this.buttonInterval = setInterval(function(){
        exec('gpio read ' + this.button1, function(err, stdout, stderr){
            var value = parseInt(stdout.replace(/\n$/, ''), 10);
            if (value === 1){
                console.log('reboot recieved');

                self.writeLed1(0);
                setTimeout(function(){
                    self.writeLed1(1);
                }, 100);
                setTimeout(function(){
                    self.writeLed1(0);
                }, 200);
                setTimeout(function(){
                    self.writeLed1(1);
                }, 300);
                setTimeout(function(){
                    exec('sudo reboot');
                }, 400);
            }
        });
    }, 500);
}

RPiGPIO.prototype.writeLed1 = function(val){
    exec('gpio write ' + this.led1 + ' ' + val);
}

RPiGPIO.prototype.writeLed2 = function(val){
    exec('gpio write ' + this.led2 + ' ' + val);
}

module.exports = RPiGPIO;
