minorityApp.controller('graphController', function ($scope, socket) {
	var rollingGraph = createRollingGraph("#graph", 600, 400, 6);

	socket.on('graphNewPoint', function (data) {
		rollingGraph.addPoint(data);
	});
	
	// ping for testing purpose!
	$scope.ping = function () {
		socket.emit('ping');
	};

	socket.on('ping', function (data) {
		console.log('Recieved: ' + data);
	});
});