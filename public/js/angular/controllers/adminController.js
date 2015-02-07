minorityApp.controller('adminController', function ($scope, socket) {
	$scope.startRounds = function () {
		var data = {};
		data.high = 10;
		data.low = 5;
		data.rounds = 24;
		socket.emit('startRounds', data);
	}
	$scope.stopRounds = function () {
		socket.emit('stopRounds', true);
	}
});