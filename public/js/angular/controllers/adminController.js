minorityApp.controller('adminController', function ($scope, socket) {
	$scope.startRounds = function () {
		socket.emit('startRounds', true);
	}
	$scope.stopRounds = function () {
		socket.emit('stopRounds', true);
	}
});