function createRollingGraph(divname, width, height, n) {

	var margin = {top: 20, right: 20, bottom: 20, left: 40},
	    w = width - margin.left - margin.right,
	    h = height - margin.top - margin.bottom;

	var svg = d3.select(divname)
	    .attr("width", w + margin.left + margin.right)
	    .attr("height", h + margin.top + margin.bottom)
	  .append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var data = [];
	var key = 0;
	var lower = -1;
	var upper = 1;

	var x = rescaleAxis(0, n-1, 0, w);
	var y = rescaleAxis(lower, upper, h, 0);

	var line = d3.svg.line()
		.x(function(d, i) { return x(i); })
		.y(function(d, i) { return y(d.value); });

	var yaxis = svg.append("g")
	    .attr("class", "y axis")
	    .call(d3.svg.axis().scale(y).orient("right"));

	// append a group to svg to apply transition to it
	var g = svg.append("g")
		.attr("clip-path", "url(#clip)");

	// line element
	var path = g.append("path")
		.attr("class", "line")
		.attr("d", line(data));

	// needed functions
	function translateWhole(newData, g) {
		var oldCenter = (upper + lower) / 2;	
		g.transition()
	  	  	.duration(1000)
	  	  	.ease("linear")
	  	  	.attr("transform", "translate(" + x(-1) + "," + (y(oldCenter) - y(newData)) + ")")
	  	  	.each("end", updateYAxis(newData))
	};

	var updateYAxis = function(newData) {
	  	upper = newData + 1;
	  	lower = newData - 1;
	  	y = rescaleAxis(lower, upper, h, 0);
	  	yaxis.call(d3.svg.axis().scale(y).orient("right"));
	};

	function rescaleAxis(d1, d2, r1, r2) {
	    return d3.scale.linear()
	      .domain([d1, d2])
	      .range([r1, r2]);
	};

	function reset() {
		updateYAxis(0);
		var circles = g.selectAll("circle")
			.data([]);
		circles.exit().remove();
	};

	return {
		name: divname,
		data: data,
		updateYAxis: updateYAxis,
		reset: reset,
		addPoint: function (newPoint, color) {
			data.push({
				"key" : key++,
				"value" : newPoint,
				"color" : color
			});

			var circles = g.selectAll("circle")
				.data(data, function(d) { return d.key; });

			// enter selection
			circles.enter().append("circle")
				.attr("cx", function (d, i) {
					return (x(i)); 
				})
				.attr("cy", function (d) { 
					return (y(d.value)); 
				})
				.attr("r", function (d) { 
					return 10; 
				})
				.style("fill", function (d) { return d.color; });

			// update path
			path.attr("d", line(data));
			//console.log(line(data));

			// default group to transition
			var nextg = g;

			// once we have more data than space to draw points
			if(data.length > n) {
				circles
					.attr("cx", function (d, i) {
						return (x(i)); 
					})
					.attr("cy", function (d) { 
						return (y(d.value)); 
					})
				// transitions are per-element so we need to apply it to the whole group
				g
					.attr("transform", null);
				nextg = g.transition()
				  	.ease("linear")
					.duration(1000)
					.attr("transform", "translate(" + (x(-1)) + ",0)");

				data.shift();
			}
			if (newPoint > upper || newPoint < lower) {
			  	translateWhole(newPoint, nextg);
			}
			// exit selection
			circles.exit().remove();
		}
	};
};