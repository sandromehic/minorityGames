var util = require('util');
var jalgo = require('./jalgo.js');

exports = module.exports = {};

var usernames = [];

//server side graph variable
var graph = {
	"value" : 0,
	"arr" : []
};

function resetValues() {
	graph.value = 0;
	graph.arr = [];
	usernames.forEach(function(element, index){
		element.decision = "boh";
		element.history = [];
		element.score = 0;
	});
};

function getRoundsDuration(highDuration, lowDuration, rounds) {
	var r = [];
	var num = highDuration+1;
	var cond = Math.floor(rounds / (num - lowDuration));
	console.log(num, cond);
	for (var i = 0; i < rounds; i++) {
		if (i%cond == 0 && num > lowDuration) {
			num -= 1;
		}
		r.push(num);
	}
	return r;
};

var roundTimeout;
var roundStartedAt;
var refreshTime;

function startIntervals(socket, data) {
	// refreshTime = refreshTime - 1;
	refreshTime = data.shift();
	if (refreshTime > 0) {
		sendNewData(socket, refreshTime);
		clearTimeout(roundTimeout);
		// set time of start to be able to calculate remaining
		roundStartedAt = (new Date()).getTime();
		roundTimeout = setTimeout( function() {
			startIntervals(socket, data);
		}, refreshTime * 1000);		
	}
	else {
		console.log('Rounds are over!');
	}
};

function getRemainingRoundTime() {
	var milis = (refreshTime * 1000) - ( (new Date()).getTime() - roundStartedAt );
	return Math.floor( milis / 1000 );
};

function startRounds(socket, highDuration, lowDuration, rounds) {
	resetValues();
	socket.broadcast.emit('reset', graph);
	var r = getRoundsDuration(highDuration, lowDuration, rounds);
	startIntervals(socket, r);
};

// send new Data to clients and initialize new round
function sendNewData(socket, time) {
	var data = calculateLastRound();
	socket.broadcast.emit('newRound', time);
	socket.broadcast.emit('graphNewPoint', data.point);
	socket.broadcast.emit('newNeighbourhood', data.usernames);
};

// calculate total minority, new graph point, neighbourhood and other
function calculateLastRound() {
	var obj = {};

	// calculate decisions for algorithmic players
	jalgo.calculateDecisions(usernames);

	obj.point = calculateMinority();
	//update scores
	updateUsernameScores(obj.point);

	graph.value += obj.point;
	graph.arr.push(graph.value);

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
	if(up > down) { return (-0.2); 	}
	else if(up == down) { return 0; }
	else { return (0.2); }
};

function updateUsernameScores(value) {
	// if graph is going up, the "down" decision won

	usernames.forEach(function(element, index){
		if (element.decision == "down") {
			element.score -= sign(value);
		}
		else if(element.decision == "up") {
			element.score += sign(value);
		}
	});
}

function sign(x){
	if (x === 0) { return 0; }
	else { return x > 0 ? 1 : -1; }
};

function setUserDecision(id, data) {
	usernames.forEach(function(element, index){
		if(element.identifier == id) {
			element.decision = data;
		}
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
		});

		// admin messages
		socket.on('startRounds', function (data) {
			startRounds(socket, data.high, data.low, data.rounds);
			console.log('Received new round signal from admin');
			console.dir(data);
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
					"decision" : "boh",
					"history" : []
				});			
			}

			// each time we add a human user we also add one algorithmic player
			jalgo.populate(usernames, 1);
			console.dir(usernames);
		});

		// user sends a decision
		socket.on('decision', function (data) {
			console.log('Received decision', data, 'from', socket.username);
			socket.decision = data;
			setUserDecision(socket.identifier, data);
		});

		// send graph info to user
		socket.on('getGraphInfo', function (data) {
			socket.emit('graphInfo', graph)
		});
		socket.on('getNeighInfo', function (data) {
			socket.emit('newNeighbourhood', usernames)
		});
		socket.on('getRoundTime', function (data) {
			socket.emit('newRound', getRemainingRoundTime());
		})
		socket.on('changecenter', function (data) {
			socket.emit('changecenter', true);
		});
		socket.on('getId', function (data) {
			socket.emit('userId', socket.identifier);
		});

		// ping for testing
		socket.on('ping', function(data) {
			console.log('recieved ping message from ' + data);
			socket.emit('ping', data);
		})
	});
};

// ALGORITHMIC PLAYERS SETUP
// jalgo.puppa();
jalgo.populate(usernames, 5);
console.log(usernames);