minorityApp.controller('graphController', function ($scope, socket) {
	var rollingGraph = createRollingGraph("#graph", 600, 500, 6);
	var point = 0;

	socket.on('graphNewPoint', function (data) {
		point += data;
		rollingGraph.addPoint(point);
	});
	
	// ping for testing purpose!
	$scope.ping = function () {
		socket.emit('ping');
	};

	socket.on('ping', function (data) {
		console.log('Recieved: ' + data);
	});
});