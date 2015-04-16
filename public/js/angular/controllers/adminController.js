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

	socket.on('endRounds', function (usernames) {
		console.log('endRounds recieved!');
		// console.dir(usernames);
		// $scope.usernames = usernames;
		neighData = spliceAndDice(usernames, mainUserID);
		usernames.forEach(function (element, index){
			if (include(neighData, element)) {
				usernames[index].neigh = true;
			}
		});

		$scope.usernames = usernames;
		$('#modal6').modal(); 
	});

	$scope.nrounds = 2;
	$scope.hduration = 10;
	$scope.lduration = 5;
	$scope.jalgos = 50;
});