// jalgo.js containing algorithm players, names start with J
// NAMES
// ["Jack", "Jacob", "James", "Jimmy", "Jarvis", "Jason", "Jasper", "Jed", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jesse", "John", "Jonathan", "Joseph", "Joey", "Joe", "Joshua", "Justin", "Kane", "Keene", "Keegan", "Keaton", "Keith", "Kelsey", "Kelvin", "Kendall", "Kendrick", "Kenneth", "Ken", "Kent", "Kenway", "Kenyon", "Kerry", "Kerwin", "Kevin", "Kiefer", "Kilby", "Kilian", "Kim", "Kimball", "Kingsley", "Kirby", "Kirk", "Kit", "Kody", "Konrad", "Kurt", "Kyle", "Lambert", "Lamont", "Lancelot", "Landon", "Landry", "Lane", "Lars", "Laurence", "Lee", "Leith"]

var exports = module.exports = {};

var names = ["Jack", "Jacob", "James", "Jimmy", "Jarvis", "Jason", "Jasper", "Jed", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jesse", "John", "Jonathan", "Joseph", "Joey", "Joe", "Joshua", "Justin", "Kane", "Keene", "Keegan", "Keaton", "Keith", "Kelsey", "Kelvin", "Kendall", "Kendrick", "Kenneth", "Ken", "Kent", "Kenway", "Kenyon", "Kerry", "Kerwin", "Kevin", "Kiefer", "Kilby", "Kilian", "Kim", "Kimball", "Kingsley", "Kirby", "Kirk", "Kit", "Kody", "Konrad", "Kurt", "Kyle", "Lambert", "Lamont", "Lancelot", "Landon", "Landry", "Lane", "Lars", "Laurence", "Lee", "Leith"];
// save all the ids of algorithmic players
var localID = [];
var currentIndex = 0;
var desc = ["down", "up"];

var jalgos = [];

exports.populate = function(usernames, quan) {
	var ind;
	for (var i = 0, n = names.length; currentIndex < n && i < quan; currentIndex++, i++) {
		ind = Math.floor((Math.random() * 200) + ((currentIndex + 1) * 1000));
		usernames.push({
			"identifier" : ind,
			"username" : names[currentIndex],
			"history" : []
		});
		var newJalgo = new Jalgo(ind, 5, 2);
		newJalgo.generateStrategies();
		jalgos.push(newJalgo);
		localID.push(ind);
	}
	// console.log('Generated these jalgos:');
	// console.dir(jalgos);
};

exports.spopulate = function(usernames) {	
	console.log('cleaning up usernames array of jalgos...');
	var removeID = [];
	for(var i=0, n=usernames.length; i<n; i++) {
		if(inside(localID, usernames[i].identifier)) {
			removeID.push(i);
		}
	}
	for(var i=removeID.length-1; i>=0; i--) {
		usernames.splice(removeID[i],1);
	}
	// console.log('done with removing jalgos from usernames array');
	// console.dir(usernames);
	// reset values
	currentIndex = 0;
	localID = [];
};

exports.calculateDecisions = function (usernames, graph) {
	usernames.forEach(function(element, index){
		if (inside(localID, element.identifier)) {
			hist = reconstructHistory(graph);
			for (var i=0, n=jalgos.length; i<n; i++){
				if (element.identifier == jalgos[i].ind) {
					// console.log("Making decision for: ");
					// console.dir(jalgos[i]);
					relevantHist = hist.slice(hist.length-jalgos[i].brainSize, hist.length);
					// console.log('relevant history: ' + relevantHist);
					if (relevantHist.length == jalgos[i].brainSize) {


						var idx = parseInt(relevantHist.join(""),2);
						// console.log("last decision: " + relevantHist[relevantHist.length-1]);
						var maxIdx = 0;
						jalgos[i].strategy.forEach(function (element, index){
							element.updateScore(relevantHist[relevantHist.length-1]);
							if (element.vscore > jalgos[i].strategy[maxIdx].vscore) {
								maxIdx = index;
							}
							element.makeDecision(idx);
						});
						element.decision = desc[jalgos[i].strategy[maxIdx].s[idx]];
					}
					else {
						element.decision = getRandomDecision();
					}
					// console.log('jalgo decision: ' + element.decision);
				}				
			}
			// console.log("reconstructed history!");
			// console.dir(hist);
		}		
	});
};

function inside(arr, element) {
	for(var i = 0, n = arr.length; i < n; i++) {
		if(arr[i] == element) {
			// console.log('element equals', element, i);
			return true;
		}
	}
	return false;
};

function getRandomDecision() {
	var rnd = Math.random();
	if (rnd < 0.5) { return "down"; }
	else { return "up"; }
};

function reconstructHistory(graph) {
	history = [];
	graph.arr.forEach( function (element, index){
		if (index == 0) {
			history.push(Math.round(Math.random()))
		}
		else {
			if ((element - graph.arr[index-1]) > 0) {
				history.push(0)
			}
			else {
				history.push(1)
			}
		}
	});
	return history;
};

function Jalgo(ind, brainSize, S){
	this.ind = ind;
	this.S = S;
	this.brainSize = brainSize;
	this.strategy = [];
};

Jalgo.prototype.generateStrategies = function(){
	for (var i=0; i<this.S; i++) {
		var newStrategy = new Strategy(this.brainSize);
		newStrategy.generateStrategy();
		this.strategy.push(newStrategy);
	}
};

function Strategy(brainSize){
	this.brainSize = brainSize
	this.s = [];
	this.vscore = 0;
	this.decision = 0;
};

Strategy.prototype.generateStrategy = function () {
	limit = Math.pow(2, this.brainSize)
	for (var i=0; i<limit; i++) {
		this.s.push(Math.round(Math.random()));
	}
};

Strategy.prototype.makeDecision = function(idx) {
	this.decision = this.s[idx];
	// console.log("Strategy " + this + " made decision: " + this.decision);
};

Strategy.prototype.updateScore = function(correctD) {
	if (this.decision == correctD) {
		this.vscore += 1;
	}
	else {
		this.vscore -= 1;
	}
}