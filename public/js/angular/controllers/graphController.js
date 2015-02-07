minorityApp.controller('graphController', function ($scope, socket) {
	var rollingGraph = createRollingGraph("#graph", 600, 500, 6);
	var point = 0;

	// initial data from graph and create the graph
	socket.on('graphInfo', function (data) {
		point = data.value;
		rollingGraph.updateYAxis(point);
		var pts = data.arr;
		if(pts.length > 5) {
			pts = pts.slice( (pts.length-5), pts.length );
		}
		// console.dir(pts);
		pts.forEach(function(element, index){
			rollingGraph.addPoint(element);
		});
	});

	socket.on('graphNewPoint', function (data) {
		point += data;
		rollingGraph.addPoint(point);
	});
	socket.on('reset', function (graph) {
		rollingGraph.reset();
	})
	socket.on('changecenter', function (data) {
		rollingGraph.updateYAxis(5);
	});
	
	// ping for testing purpose!
	$scope.ping = function () {
		socket.emit('ping');
	};

	socket.on('ping', function (data) {
		console.log('Recieved: ' + data);
	});

	// initialize, get the point of the graph
	$scope.init = function() {
		socket.emit('getGraphInfo', true);
	};
	$scope.init();
});