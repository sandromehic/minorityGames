// load all the dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// load socket logic that handled all websocket events
var socketlogic = require('./logic/socketlogic.js')(io);

// set view engine to jade and folder to /views
app.set('views', './views');
app.set('view engine', 'jade');

// set public folder from which client side scripts will be loaded
app.use(express.static(__dirname + '/public'));

// routing
require('./config/routes.js')(app);

// this part is for heroku deployment. Pass the port as argument (won't work on heroku without it) or use default port 3000 (for localhost)
var port = process.env.PORT || 3000;
http.listen(port, function (socket) {
	console.log('Server listening on port ' + port);
});
