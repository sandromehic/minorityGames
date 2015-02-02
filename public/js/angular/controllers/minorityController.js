minorityApp.controller('minorityController', 
	function($scope, $location, $interval, socket) {

		$scope.makeDecision = function (data) {
			$scope.decision = data;
			console.dir($scope.decision);
		}

		$scope.ping = function() {
			socket.emit('ping', $scope.user);
		}

		$scope.$watch('timer', function (newValue, oldValue) {

		});

		var endRound;
		socket.on('newRound', function (data) {
			$scope.timer = data;
			endRound = $interval(function() {
				if($scope.timer > 0) {
					$scope.timer -= 1;
					console.log($scope.timer);
				}
				else {
					$interval.cancel(endRound);
            		endRound = undefined;
				}
			}, 1000);

		});

		var stop;
		$scope.testint = function () {
			stop = $interval(function() {
				$scope.timer = Math.random();
				console.log($scope.timer);
			}, 1000);
		};

		// testing purposes, ping
		socket.on('ping', function (data) {
			console.log('recieved ping from server:' + data);
		});

		$scope.init = function () {
			$scope.decision = 'boh';
			$scope.timer = 15;
		};

		$scope.init();
});