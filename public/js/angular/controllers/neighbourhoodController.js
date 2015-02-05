minorityApp.controller('neighbourhoodController', function ($scope, $element, socket) {

	socket.on('newNeighbourhood', function (data) {
		// data = usernames array
		d3Neighbourhood(data);
	});
	
	// ping for testing purpose!
	$scope.ping = function () {
		socket.emit('ping');
	};

	socket.on('ping', function (data) {
		console.log('Recieved: ' + data);
	});
});

