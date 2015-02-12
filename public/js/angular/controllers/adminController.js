minorityApp.controller('adminController', function ($scope, socket) {
	$scope.startRounds = function () {
		var data = {};
		data.rounds = $scope.nrounds;
		data.high = $scope.hduration;
		data.low = $scope.lduration;
		data.jalgos = $scope.jalgos;
		socket.emit('startRounds', data);
	}
	$scope.stopRounds = function () {
		socket.emit('stopRounds', true);
	}

	$scope.nrounds = 25;
	$scope.hduration = 10;
	$scope.lduration = 5;
	$scope.jalgos = 15;
});