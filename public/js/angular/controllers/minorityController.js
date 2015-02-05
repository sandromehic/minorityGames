minorityApp.controller('minorityController', 
	function($scope, $location, $interval, $cookies, socket) {
		var username = $cookies.name;

		$scope.makeDecision = function (data) {
			$scope.decision = data;
			socket.emit('decision', data);
		};

		$scope.startRounds = function () {
			socket.emit('startRounds', true);
		};
		$scope.stopRounds = function () {
			socket.emit('stopRounds', true);
		};

		socket.on('newNeighbourhood', function (data) {
			// data = usernames array
			d3Neighbourhood(data, username);
		});

		var endRound;
		socket.on('newRound', function (data) {
			$scope.timer = data;
			$interval.cancel(endRound);
			endRound = $interval(function() {
				if ($scope.timer > 0) {
					$scope.timer -= 1;
				}
				else {
					$interval.cancel(endRound);
				}			
			}, 1000, data);
		});

		$scope.init = function () {
			$scope.decision = 'boh';
			$scope.timer = 15;
			socket.emit('add user', username);
		};

		$scope.init();
});