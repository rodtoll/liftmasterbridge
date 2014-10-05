var restify = require('restify');
var config = require('../houseconfig.json');
var MyQ = require('liftmaster');

console.log('Config file email from...');

console.log(config.emailfrom.username);

function sendGarageDoorCommand(state) {
    garageDoor = new MyQ(config.liftmaster.username, config.liftmaster.password);

    garageDoor.login(function(err,res) {
	if(err) {
            console.log('Error logging in to MyQ. '+err);
        } else {
    	    garageDoor.getDevices(function(err,devices) {
		if(err) { 
		    console.log('Error getting devices '+err); 
                } else {
                    if(state==true) {
		        garageDoor.setDoorState(devices[0].id,1, function(err, device) {
                        });
                    } else {
                        garageDoor.setDoorState(devices[0].id,2, function(err, device) {
                        });
                    }
                } 
            });
        }
    });
}

function controlGarageDoor(req, res, next) {
    if(req.params.state == 'open') {
        res.send('Open garage');
        sendGarageDoorCommand(true);
    } else if(req.params.state == 'close') {
        res.send('Closing garage');
        sendGarageDoorCommand(false);
    } else {
        res.send('Unknown command');
        next();
    }
    next();
}

var server = restify.createServer();
server.get('/garage/:state', controlGarageDoor);

server.listen(8041, function() {
  console.log('%s listening at %s', server.name, server.url);
});


