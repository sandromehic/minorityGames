var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var exports = module.exports = {};

var userSchema = new mongoose.Schema({
	identifier: Number,
	name: String,
	decision: String,
	score: Number,
	rank: Number
});

var roundSchema = new mongoose.Schema({
	session: Number,
	number: Number,
	graphValue: Number,
	graphDifference: Number,
	users: [userSchema]
});

var secondRoundSchema = new mongoose.Schema({
	number: Number,
	graphValue: Number,
	graphDifference: Number,
	decision: String,
	score: Number,
	rank: Number
});

var secondUserSchema = new mongoose.Schema({
	identifier: Number,
	name: String,
	session: Number,
	rounds: [secondRoundSchema]
});

var Round = mongoose.model('Round', roundSchema);
var User = mongoose.model('User', secondUserSchema);

exports.saveRound = function(graph, usernames) {

	// console.log('==========================================');
	// console.log('==========================================');
	// console.dir(usernames);
	// console.log('==========================================');
	// console.log('==========================================');


	console.log('inside saveRound database part!');

	var thisRound = new Round();
	
	// save the graph part
	thisRound.session = graph.session;
	thisRound.number = graph.arr.length;
	thisRound.graphValue = graph.value;
	var prev = graph.arr[graph.arr.length-2] ? graph.arr[graph.arr.length-2] : 0;
	thisRound.graphDifference = graph.arr[graph.arr.length-1] - prev;

	// save usernames
	usernames.forEach(function(element, index){
		thisRound.users.push({
				identifier: element.identifier,
				name: element.username,
				decision: element.decision,
				score: element.score,
				rank: element.rank
		});

		User.findOne({ identifier: element.identifier }, function (err, usr) {
			if (err)
				console.log('error occured seraching for user', err);

			if (usr) {
				usr.rounds.push({
					number: graph.arr.length,
					graphValue: graph.value,
					graphDifference: (graph.arr[graph.arr.length-1] - prev),
					decision: element.decision,
					score: element.score,
					rank: element.rank
				});
				usr.save(function(err) {
					if (err)
						console.log('error trying to save existing user', err);
				})
			}
			else {
				var thisUser = new User();
				thisUser.identifier = element.identifier;
				thisUser.name = element.username;
				thisUser.session = graph.session;
				thisUser.rounds.push({
					number: graph.arr.length,
					graphValue: graph.value,
					graphDifference: (graph.arr[graph.arr.length-1] - prev),
					decision: element.decision,
					score: element.score,
					rank: element.rank
				});
				thisUser.save(function (err) {
					if (err)
						console.log('error occured saving user:', err);
				});
			}
			
		});
	});

	thisRound.save(function (err) {
		if (err)
			console.log('error occured saving round:', err);
	});

	// Round.find(function(err, rounds) {
	// 	if (err) {
	// 		console.log('error occured retrived data from db', err);
	// 	}

	// 	// console.log('rounds found in DB!');
	// 	// console.dir(rounds);
	// });	



	return true;
};

