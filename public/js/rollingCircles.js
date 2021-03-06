var colors = {
	"up" : "#5cb85c",
	"down" : "#d9534f",
	"boh" : "#f0ad4e",
};

function createRollingCircles(divname, w, h, n, r, d, title) {
	var svg = d3.select(divname)
		.attr("width", w)
		.attr("height", h);
	var title = title;
	appendLabel("title", svg, 50, 50, title, "black");

	var data = [];
	var key = 0;

  	// var offset = (w/(n * 2));
  	var offset = (w/(n * 2));
  	var	size = (w / n);
  	//console.log(offset, size);

  	// add the white balls of fire
  	for (var i=0; i<n; i++) {
  		data.push({
  			"key" : key++,
  			"color" : "white"
  		});
  	}

	if (d) {
		d.forEach(function(element, index){
			data.push({
				"key" : key++,
				"color" : colors[element]
			});
			// remove first element from data
			if (data.length > n) {
				data.shift();
			}
		});
		// console.log('data', data);
		// console.log('calling drawcircles');
		drawCircles(svg, data, w, h, n, r);
		if(d[0] != null) {
			appendLabel("title", svg, 50, 50, title, "black");
		}
	}

	function addCircle(newcolor, notransition) {
			//////////////////////////////////////
			if (newcolor) {
				data.push({
					"key" : key++,
					"color" : newcolor
				});
				// console.log('last element of data from add circle', data[data.length-1]);
				// remove first element from data
				if (data.length > n) {
					data.shift();
				}
			}

			var circles = svg.selectAll("circle")
				.data(data, function(d) { return d.key; });

		  	circles.exit().transition()
		  		.duration(1000)
		  		.style("opacity", 0)
		  		.remove();

		  	// add new elements
		  	if(notransition) {
		  		//console.log('no transition adding');
		  		circles.enter().append("circle")
					.attr("cx", function (d, i) {
						// return (( (w/(n * 2)) + (w/ n) ) + i*(w / n));
						return (( offset ) + i*size); 
					})
					.attr("cy", function (d) { 
						return (h / 2); 
					})
					.attr("r", function (d) { 
						// return ((h / 2) - (h / 10));
						return r; 
					})
					.style("fill", function (d) { return d.color; });
		  	}
		  	else {
				circles.enter().append("circle")
					.attr("cx", function (d, i) {
						// return (( (w/(n * 2)) + (w/ n) ) + i*(w / n));
						return (( offset + size ) + i*size); 
					})
					.attr("cy", function (d) { 
						return (h / 2); 
					})
					.attr("r", function (d) { 
						// return ((h / 2) - (h / 10));
						return r; 
					})
					.style("fill", function (d) { return d.color; });
					
				circles.transition()
						.duration(1000)
						.attr("cx", function (d, i) { 
							return (offset + i*size); 
						});
			}
			//////////////////////////////////////////////////////////////////////////////
			//update the title
			svg.select("#title").remove();
			appendLabel("title", svg, 50, 50, title, "black");
		}

	return {
		name: divname,
		width: w,
		height: h,
		number: n,
		radius: r,
		svg: svg,
		data: data,
		key: key,
		addCircle: addCircle
	};
};

// function that returns random hex color
function co(lor) {   
	return (lor += [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
  		&& (lor.length == 6) ?  lor : co(lor); 
};

function appendLabel(labelname, svg, x, y, content, clr) {
	svg.append("text")
		.attr("id", labelname)
		.attr("text-anchor", "middle")
		.attr("alignment-baseline", "middle")
		.attr("x", x)
		.attr("y", y)
		.text(content)
		.attr("font-family", "sans-serif")
		.attr("font-size", "16px")
		.attr("font-weight", "bold")
		.style("fill", clr);
};

function drawCircles(svg, data, w, h, n, r) {
	var offset = (w/(n * 2));
  	var	size = (w / n);
	var circles = svg.selectAll("circle")
		.data(data, function(d) { return d.key; });

	circles.enter().append("circle")
					.attr("cx", function (d, i) {
						// return (( (w/(n * 2)) + (w/ n) ) + i*(w / n));
						return (( offset ) + i*size); 
					})
					.attr("cy", function (d) { 
						return (h / 2); 
					})
					.attr("r", function (d) { 
						// return ((h / 2) - (h / 10));
						return r; 
					})
					.style("fill", function (d) { return d.color; });
};