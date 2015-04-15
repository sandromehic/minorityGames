var rollingCircles = {};
var colors = {
	"up" : "#5cb85c",
	"down" : "#d9534f",
	"boh" : "#f0ad4e"
};

var localNeigh = [];

function resetRollingCircles() {
	for (var key in rollingCircles) {
		for (var i=0; i<6; i++) {
			rollingCircles[key].addCircle("#ffffff");
		}
	}
};

function resetRollingGraph(rolling) {
	for (var i=0; i<6; i++) {
		rolling.addPoint(0, "#f0ad4e");
	}
}

function constructNeigh(usernames, mainuserId) {

};

function updateNeigh(usernames, mainuserId, newguyId) {

};

function spliceAndDice(data, mainuserId) {
	var len = data.length;
	// console.log('inside spliceAndDice:');
	// console.log('mainuserId', mainuserId);
	// console.log('data');
	// console.dir(data);
	var rtndata = [];
	if(len > 5) {
		var idx;
		for(var i = 0; i < len; i++) {
			if(data[i].identifier == mainuserId) {
				idx = i;
				rtndata.push(data[i]);
			}
		}
		for(var i=(idx+1); i<len; i++) {
			if(rtndata.length>=5) break;
			rtndata.push(data[i]);
		}
		for(var i=0; i<len; i++) {
			if(rtndata.length>=5) break;
			rtndata.push(data[i]);
		}
		console.log('IDX', idx);
		// check if user index + 2 >= lenght of the array
		console.log('data length', len);
		console.log('rtndata length', rtndata.length);

		// if ( (idx+2) >= len) {
		// 	// neighbourhood would overflow;
		// 	rtndata = data.slice(idx-2, len);
		// 	console.log('slice from slice and dice!');
		// 	console.dir(data.slice(idx-2, len));
		// 	for (var i = rtndata.length, j = 0; i < 5; i++) {
		// 		rtndata.push(data[j]);
		// 		j++;
		// 	}
		// }
		// else if ((idx-2) < 0) {
		// 	rtndata = data.slice(0, 5);
		// }
		// else {
		// 	// neighbourhood would not overflow so give it a slice -2 to +2
		// 	rtndata = data.slice(idx-2, idx+3);
		// }
		console.log('return data from slice and dice:');
		console.dir(rtndata);
		return rtndata;
	}

	else {
		return data;
	}
};

function d3Neighbourhood(data, mainuserId) {
	// console.log('inside d3neigh function!');
	// console.dir(data);
	// 		"identifier" : 0,
	// 	"username" : "tizio",
	// 	"decision" : "up",
	// 	"history" : []
	// },

	// console.dir(data);
	// console.dir(mainuserId);
	var modData;
	modData = spliceAndDice(data, mainuserId);
	// console.log('Modified data inside d3Neighbourhood!');
	// console.dir(modData);

	var neigh = d3.select("#neighbourhood");

	var neighbour = neigh.selectAll("svg")
		.data(modData, function(d) { return d.identifier; });

	// console.log('neighbour inside d3Neighbourhood');
	// console.dir(neighbour);
	// update selection
	// console.log('Update selection!');
	neighbour.each( function (d, i) {
		// console.log(this);
		// console.log(rollingCircles);
		// if (rollingCircles[this.id]) {
		// 	console.log("already existing rc in update selection!", this);
		// }
		if (rollingCircles[this.id]) {	
			rollingCircles[this.id].addCircle(colors[this.__data__.decision]);
		}
	});




	// enter selection
	var newones = neighbour.enter().append("svg")
		.attr("width", 600)
		.attr("height", 100)
		.attr("id", function(d) { return d.identifier; });

	// console.log('selectall svg', neighbourhood);
	// console.log('enter selection', newones);
	// console.log('is empyt newones?', newones.empty());

	// exit selection
	var exitones = neighbour.exit();
	exitones.each( function (d, i) {
		// console.log('deleting', this.id);
		delete rollingCircles[this.id];
	});
	exitones.remove();

	// console.log('Enter selection!');
	newones.each( function (d, i) {
		// console.log('Inside newones element');
		// console.log('d & i', d, i);
		// console.log(this);
		var r = 35;
		if(this.__data__.identifier == mainuserId) { r = 45; }
		rollingCircles[this.id] = createRollingCircles(this, 600, 100, 6, r, this.__data__.history, this.__data__.username);
		// console.dir(this);
		// console.log(rollingCircles);
	});
};

// function that returns random hex color
function co(lor) {   
	return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  		&& (lor.length == 6) ?  lor : co(lor); 
};

// returns true if obj is inside arr
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
};