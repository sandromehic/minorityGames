classicalMinorityApp.controller('classicalMinorityController', ['$scope', '$location', 'userService', 'socket',
	function($scope, $location, userService, socket) {

		$scope.makeDecision = function (data) {
			$scope.decision = data;
			console.dir($scope.decision);
		}

		$scope.ping = function() {
			socket.emit('ping', $scope.user);
		}


		// testing purposes, ping
		socket.on('ping', function (data) {
			console.log('recieved ping from server:' + data);
		});

		$scope.init = function () {
			$scope.user = userService.getuser();
			$scope.decision = 'boh';

			// if ($scope.user == '') {
			// 	$location.path('/login');
			// }

			$scope.dummydata = ['boh', 'up', 'down', 'asd', 'qwe', 'dfg'];
		};

		$scope.init();
}]);