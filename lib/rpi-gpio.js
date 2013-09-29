var gpio = require('gpio'),
    util = require('util');

var RPiGPIO = function(){
    this.button1 = null;
    this.led1 = null;
    this.led2 = null;
};

util.inherits(LightArray, events.EventEmitter);

RPiGPIO.prototype.setup = function(){
    var self = this;

    this.button1 = gpio.export(4, {
        'direction': "in",
        'interval': 200,
        'ready': function() {
            self.button1.on("change", function(val){
                if (val === 1){
                    exec("sudo shutdown now");
                }
            });
        }
    });

    this.led1 = gpio.export(17, {
        'direction': "out",
        'interval': 200,
        'ready': function() {

        }
    });

    this.led2 = gpio.export(18, {
        'direction': "out",
        'interval': 200,
        'ready': function() {
            
        }
    });

}

module.exports = RPiGPIO;
