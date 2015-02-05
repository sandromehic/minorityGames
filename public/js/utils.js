// function that returns random hex color
function co(lor) {   
	return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  		&& (lor.length == 6) ?  lor : co(lor); 
};

// returns true if obj is inside arr
function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
};

function spliceAndDice(data, mainuser) {
	var len = data.length;
	var rtndata = [];
	if(len <= 5) {
		return data;
	}
	else {
		var idx;
		for(var i = 0; i < len; i++) {
			if(data[i].username == mainuser) {
				idx = i;
			}
		}
		// check if user index + 2 >= lenght of the array
		if ( (idx+2) >= len) {
			// neighbourhood would overflow;
			rtndata = data.slice(idx-2, len);
			for (var i = rtndata.length, j = 0; i < 5; i++) {
				rtndata.push(data[j]);
				j++;
			}
		}
		return rtndata;
	}
};

var rollingCircles = {};
var colors = {
	"up" : "#5cb85c",
	"down" : "#d9534f",
	"boh" : "#f0ad4e"
};

function d3Neighbourhood(data, mainuser) {
	console.log('inside d3neigh function!');
	// console.dir(data);
	// 		"identifier" : 0,
	// 	"username" : "tizio",
	// 	"decision" : "up",
	// 	"history" : []
	// },

	// console.dir(data);
	var modData;
	modData = spliceAndDice(data, mainuser);

	var neigh = d3.select("#neighbourhood");

	var neighbour = neigh.selectAll("svg")
		.data(modData, function(d) { return d.identifier; });

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

	console.log('Enter selection!');
	newones.each( function (d, i) {
		// console.log('Inside newones element');
		// console.log('d & i', d, i);
		// console.log(this);
		var r = 40;
		if(this.__data__.username == mainuser) { r = 45; }
		rollingCircles[this.id] = createRollingCircles(this, 600, 100, 6, r, this.__data__.history, this.__data__.username);
		// console.log(rollingCircles);
	});

	// exit selection
	var exitones = neighbour.exit();
	exitones.each( function (d, i) {
		console.log('deleting', this.id);
		delete rollingCircles[this.id];
	});
	exitones.remove();
};