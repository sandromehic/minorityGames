// jalgo.js containing algorithm players, names start with J
// NAMES
// ["Jack", "Jacob", "James", "Jimmy", "Jarvis", "Jason", "Jasper", "Jed", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jesse", "John", "Jonathan", "Joseph", "Joey", "Joe", "Joshua", "Justin", "Kane", "Keene", "Keegan", "Keaton", "Keith", "Kelsey", "Kelvin", "Kendall", "Kendrick", "Kenneth", "Ken", "Kent", "Kenway", "Kenyon", "Kerry", "Kerwin", "Kevin", "Kiefer", "Kilby", "Kilian", "Kim", "Kimball", "Kingsley", "Kirby", "Kirk", "Kit", "Kody", "Konrad", "Kurt", "Kyle", "Lambert", "Lamont", "Lancelot", "Landon", "Landry", "Lane", "Lars", "Laurence", "Lee", "Leith"]


var exports = module.exports = {};

var names = ["Jack", "Jacob", "James", "Jimmy", "Jarvis", "Jason", "Jasper", "Jed", "Jeffrey", "Jeremiah", "Jeremy", "Jerome", "Jesse", "John", "Jonathan", "Joseph", "Joey", "Joe", "Joshua", "Justin", "Kane", "Keene", "Keegan", "Keaton", "Keith", "Kelsey", "Kelvin", "Kendall", "Kendrick", "Kenneth", "Ken", "Kent", "Kenway", "Kenyon", "Kerry", "Kerwin", "Kevin", "Kiefer", "Kilby", "Kilian", "Kim", "Kimball", "Kingsley", "Kirby", "Kirk", "Kit", "Kody", "Konrad", "Kurt", "Kyle", "Lambert", "Lamont", "Lancelot", "Landon", "Landry", "Lane", "Lars", "Laurence", "Lee", "Leith"];
// save all the ids of algorithmic players
var localID = [];
var currentIndex = 0;

exports.populate = function(usernames, quan) {
	var ind;
	for (var i = 0, n = names.length; currentIndex < n && i < quan; currentIndex++, i++) {
		ind = Math.floor((Math.random() * 200) + ((currentIndex + 1) * 1000));
		usernames.push({
			"identifier" : ind,
			"username" : names[currentIndex],
			"history" : []
		});
		localID.push(ind);
	}
};

exports.calculateDecisions = function (usernames) {
	usernames.forEach(function(element, index){
		if (inside(localID, element.identifier)) {
			element.decision = getRandomDecision();
		}		
	});
};

function inside(arr, element) {
	for(var i = 0, n = arr.length; i < n; i++) {
		if(arr[i] == element) {
			console.log('element equals', element, i);
			return true;
		}
	}
	return false;
};

function getRandomDecision() {
	var rnd = Math.random();
	if (rnd < 0.5) { return "down"; }
	else { return "up"; }
}