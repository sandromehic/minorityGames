var util = require('util');
var jalgo = require('./jalgo.js');
var db = require('./database.js');

exports = module.exports = {};

var usernames = [];

//server side graph variable
var graph = {
	"value" : 0,
	"arr" : [],
	"session": 0
};

function resetValues() {
	graph.value = 0;
	graph.arr = [];
	usernames.forEach(function(element, index){
		element.decision = "boh";
		element.history = [];
		element.score = 0;
		element.rank = 0;
	});
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

function startRounds(socket, highDuration, lowDuration, rounds) {
	resetValues();
	graph.session = generateUserId();
	socket.broadcast.emit('reset', graph);
	var r = getRoundsDuration(highDuration, lowDuration, rounds);
	startIntervals(socket, r);
};

// send new Data to clients and initialize new round
function sendNewData(socket, time) {
	var data = calculateLastRound();
	// socket.broadcast.emit('newRound', time);
	// socket.broadcast.emit('graphNewPoint', data.point);
	// socket.broadcast.emit('roundInfo', graph.arr.length);
	// socket.broadcast.emit('newNeighbourhood', data.usernames);
	data.time = time;
	db.saveRound(graph, usernames);
	socket.broadcast.emit('newRound', data);
};

// calculate total minority, new graph point, neighbourhood and other
function calculateLastRound() {
	var obj = {};

	// calculate decisions for algorithmic players
	jalgo.calculateDecisions(usernames);

	var point = calculateMinority();
	graph.value += point;
	graph.arr.push(graph.value);
	//update scores
	updateUsernameScores(point);
	updateUsernameRanks();

	obj.usernames = usernames;
	obj.graph = graph;

	return obj;
};

exports.launch = function(io) {

	// create a socket for every active connection and listen to other events
	io.sockets.on('connection', function (socket) {
		
		// one socket for every connection 
		// we will add this properties to socket object
		// username, decision

		// console.log('user connected');
		
		// --- EVENTS
		// disconnect event
		socket.on('disconnect', function (data) {
			// console.log('a user disconnected');
			var idx = includeUser(usernames, socket.username);
			if (idx) {
				(function(idx) {
					// remove user only after 30 sec disconnect (allow refresh)
					setTimeout(function() {
						usernames.splice(idx,1);
					}, 30000);
				})(idx);
			}
		});

		// when the client emits 'add user', this listens and executes
		socket.on('add user', function (username) {
			console.log('adding user, new socket opened!');
			// we store the username in the socket session for this client
			socket.username = username;
			var alreadyLogged = includeUser(usernames, username);
			console.log('already logged index', alreadyLogged);
			if(alreadyLogged !== false) {
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
			socket.emit('userId', socket.identifier);
			// console.dir(usernames);
		});

		socket.on('getUpdateState', function (data) {
			var res = {};
			res.graph = graph;
			res.usernames = usernames;
			res.newguyID = socket.identifier;
			io.sockets.emit('updateState', res);
		});

		// user sends a decision
		socket.on('decision', function (data) {
			socket.decision = data;
			setUserDecision(socket.identifier, data);
		});

		// // send graph info to user
		// socket.on('getGraphInfo', function (data) {
		// 	socket.emit('graphInfo', graph)
		// });
		// socket.on('getNeighInfo', function (data) {
		// 	socket.emit('newNeighbourhood', usernames)
		// });
		// socket.on('getRoundTime', function (data) {
		// 	socket.emit('newRound', getRemainingRoundTime());
		// })
		socket.on('getId', function (data) {
			socket.emit('userId', socket.identifier);
		});

		// ping for testing
		socket.on('ping', function(data) {
			console.log('recieved ping message from ' + data);
			socket.emit('ping', data);
		})

		// ADMIN messages
		socket.on('startRounds', function (data) {
			console.log('Starting new set of rounds (issued by admin) with following data:');
			console.log('number of rounds:', data.rounds);
			console.log('high duration of round:', data.high);
			console.log('low duration of round:', data.low);
			console.log('number of jalgo users:', data.jalgos);
			// remove all the jalgos from usernames
			jalgo.spopulate(usernames);
			// add new number of jalgos
			jalgo.populate(usernames, data.jalgos);
			startRounds(socket, data.high, data.low, data.rounds);
		});
		socket.on('stopRounds', function (data) {
			if (roundTimeout) {
				clearTimeout(roundTimeout);
			}
			resetValues();
			console.log('Stoped the rounds (issued by admin)!');
		});
	});
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
	var returnValue = -(( up + (- down) ) / usernames.length);
	// console.log('Return value of the calculateMinority:', returnValue);
	return returnValue;
	// if(up > down) { return (-0.2); 	}
	// else if(up == down) { return 0; }
	// else { return (0.2); }
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
};

function updateUsernameRanks() {
	var orderedUsers = [];
	for(var i=0, n=usernames.length; i<n; i++) {
		// console.log('username i', usernames[i]);
		orderedUsers.push([usernames[i].identifier, usernames[i].score]);
	}
	orderedUsers.sort(function(c, d){return d[1]-c[1]});
	for(var i=0, n=usernames.length; i<n; i++) {
		for(var j=0, m=orderedUsers.length; j<m; j++) {
			if(orderedUsers[j][0] == usernames[i].identifier) { 
				usernames[i].rank = j+1;
			}
		}
	}
	// console.log('Ordered users array');
	// console.dir(usernames);
};

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

function getRoundsDuration(highDuration, lowDuration, rounds) {
	var r = [];
	var num = highDuration+1;
	var cond = Math.floor(rounds / (num - lowDuration));
	for (var i = 0; i < rounds; i++) {
		if (i%cond == 0 && num > lowDuration) {
			num -= 1;
		}
		r.push(num);
	}
	return r;
};

function getRemainingRoundTime() {
	var milis = (refreshTime * 1000) - ( (new Date()).getTime() - roundStartedAt );
	return Math.floor( milis / 1000 );
};