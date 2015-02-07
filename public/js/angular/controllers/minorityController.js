minorityApp.controller('minorityController', 
	function($scope, $location, $interval, $cookies, socket) {
		var username = $cookies.name;
		var userId;

		$scope.makeDecision = function (data) {
			$scope.decision = data;
			socket.emit('decision', data);
			// change button class
			if (data == "up") {
				$scope.upbuttonClass = "active";
				$scope.downbuttonClass = "";
				$scope.bohbuttonClass = "";
			}
			else if (data == "down") {
				$scope.upbuttonClass = "";
				$scope.downbuttonClass = "active";
				$scope.bohbuttonClass = "";
			}
			else {
				$scope.upbuttonClass = "";
				$scope.downbuttonClass = "";
				$scope.bohbuttonClass = "active";				
			}
		};

		$scope.startRounds = function () {
			socket.emit('startRounds', true);
		};
		$scope.stopRounds = function () {
			socket.emit('stopRounds', true);
		};

		socket.on('newNeighbourhood', function (data) {
			// data = usernames array
			d3Neighbourhood(data, userId);
			// update the score
			$scope.updateScoreAndRank(data);
		});

		socket.on('graphInfo', function (data) {
			$scope.round = data.arr.length;
		});

		socket.on('userId', function (data) {
			userId = data;
		});

		$scope.updateScoreAndRank = function (data) {
			data.forEach(function(element, index){
				if(element.identifier == userId) {
					$scope.score = element.score;
					$scope.rank = element.rank;
				}
			});
			$scope.rankTotal = data.length;
		};

		$scope.changeCenter = function () {
			socket.emit('changecenter', true);
		};

		var endRound;
		socket.on('newRound', function (data) {
			$scope.timer = data > 0 ? data : 0;
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
			$scope.timer;
			$scope.round=0;
			socket.emit('add user', username);
			socket.emit('getNeighInfo', true);
			socket.emit('getRoundTime', true);
			socket.emit('getId', true);
		};

		$scope.init();
});