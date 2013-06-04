var midi = require('midi'),
    express = require('express'),
    app = express();

app.get('/', function(req, res){
    var output = new midi.output();
    var name = output.getPortName(1);
    res.send(name);
});

app.listen(8000);
console.log('listening');
