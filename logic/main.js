var util = require('util');

exports = module.exports = {};

// array of objects of users
// {
// 	'identifier' : timestamp generated by function
// 	'username' : string
// 	'decision' : up, down or boh
// 	'history' : array of past decisions
// }
var usernames = [{ 
		"identifier" : 1,
		"username" : "tizio",
		"decision" : "up",
		"history" : ["up", "down", "up"]
	},	
	{ 
		"identifier" : 2,
		"username" : "caio",
		"decision" : "up",
		"history" : ["up", "down", "up"]
	},
	{ 
		"identifier" : 3,
		"username" : "stronz",
		"decision" : "down",
		"history" : ["up", "down", "up"]
	},
	{ 
		"identifier" : 4,
		"username" : "puppa",
		"decision" : "down",
		"history" : ["down", "down", "up"]
	},
	{ 
		"identifier" : 5,
		"username" : "melo",
		"decision" : "down",
		"history" : ["up", "down", "up"]
	}
];

var roundTimeout;
var refreshTime = 5;

function startRounds(socket) {
	// refreshTime = refreshTime - 1;
	if (refreshTime > 0) {
		sendNewData(socket, refreshTime);
		clearTimeout(roundTimeout);
		roundTimeout = setTimeout( function() {
			startRounds(socket);
		}, refreshTime * 1000);		
	}
	else {
		console.log('Rounds are over!');
	}
}

// send new Data to clients and initialize new round
function sendNewData(socket, time) {
	var data = calculateLastRound();
	// socket.broadcast.emit('newRound', time-1);
	// socket.broadcast.emit('graphNewPoint', data.point);
	// socket.broadcast.emit('newNeighbourhood', data.usernames);
	socket.broadcast.emit('newRound', time-1);
	socket.broadcast.emit('graphNewPoint', data.point);
	socket.broadcast.emit('newNeighbourhood', data.usernames);
	// console.dir(data.usernames);
};

// calculate total minority, new graph point, neighbourhood and other
function calculateLastRound() {
	var obj = {};

	obj.point = calculateMinority();
	obj.usernames = usernames;

	return obj;
};

function calculateMinority() {
	var up=0;
	var down=0;
	usernames.forEach(function(element, index){
		if(element.decision == "up") {
			up++;
		}
		else if(element.decision == "down") {
			down++;
		}
		// add the latest decision to history array
		if (element.decision != '') {
			element.history.push(element.decision); 
			if(element.history.length > 16) {
				element.history.shift();
			}
		}
	});
	if(up > down) { return 0.2; }
	else if(up == down) { return 0; }
	else { return (-0.2); }
};

function setUserDecision(id, data) {
	usernames.forEach(function(element, index){
		if(element.identifier == id) {
			element.decision = data;
		}
	});
};

function generateUserId() {
	var d = new Date();
	return d.getTime(); 
};

exports.launch = function(io) {
	// create a socket for every active connection and listen to other events
	io.sockets.on('connection', function (socket) {
		
		// one socket for every connection 
		// we will add this properties to socket object
		// username, decision

		console.log('user connected');
		
		// --- EVENTS
		// disconnect event
		socket.on('disconnect', function (data) {
			console.log('a user disconnected');
			var idx = includeUser(usernames, socket.username);
			if (idx) {
				usernames.splice(idx,1);
			}
			console.log(usernames);
		});

		// admin messages
		socket.on('startRounds', function (data) {
			startRounds(socket);
			console.log('Received new round signal from admin ' + data);
		});
		socket.on('stopRounds', function (data) {
			if (roundTimeout) {
				clearTimeout(roundTimeout);
			}
			console.log('Stoped the round!');
		});

		// when the client emits 'add user', this listens and executes
		socket.on('add user', function (username) {

			// we store the username in the socket session for this client
			socket.username = username;
			var alreadyLogged = includeUser(usernames, username);
			console.log('already logged index', alreadyLogged);
			if(alreadyLogged) {
				console.log('welcome back');
				socket.identifier = usernames[alreadyLogged].identifier;
			}
			else {
				socket.identifier = generateUserId();
				// add the client's username to the global list
				usernames.push({ 
					"identifier" : socket.identifier, 
					"username" : username,
					"decision" : "",
					"history" : []
				});
				console.dir(usernames);				
			}
		});

		// user sends a decision
		socket.on('decision', function (data) {
			console.log('Received decision', data, 'from', socket.username);
			socket.decision = data;
			setUserDecision(socket.identifier, data);
		});

		// ping for testing
		socket.on('ping', function(data) {
			console.log('recieved ping message from ' + data);
			socket.emit('ping', data);
		})
	});
};

// returns true if obj is inside arr
function includeUser(arr,obj) {
	var includes = false;
	arr.forEach(function(element, index){
		if (element.username === obj) {
			includes = index;
		}
	});
    return includes;
};