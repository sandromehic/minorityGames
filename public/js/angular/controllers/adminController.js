minorityApp.controller('adminController', function ($scope, socket) {
	$scope.startCircles = function () {
		socket.emit('start');
	};
	$scope.stopCircles = function () {
		socket.emit('stop');
	};
	$scope.sendNewPoint = function () {
		socket.emit('sendNewPoint', Math.random());
	}
	$scope.sendNewRound = function () {
		socket.emit('sendNewRound', 15);
	}
});