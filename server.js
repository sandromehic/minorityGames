// load all the dependencies
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');

// load socket logic that handled all websocket events
var logic = require('./logic/main.js');
logic.launch(io);

// set view engine to jade and folder to /views
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

// app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
// app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());

// set public folder from which client side scripts will be loaded
app.use(express.static(__dirname + '/public'));

// Heroku won't actually allow us to use WebSockets
// so we have to setup polling instead.
// https://devcenter.heroku.com/articles/using-socket-io-with-node-js-on-heroku
io.configure(function () {  
  io.set("transports", ["xhr-polling"]); 
  io.set("polling duration", 10); 
});

// routing
require('./config/routes.js')(app);

// this part is for heroku deployment. Pass the port as argument (won't work on heroku without it) or use default port 3000 (for localhost)
var port = process.env.PORT || 3000;
http.listen(port, function (socket) {
	console.log('Server listening on port ' + port);
});

