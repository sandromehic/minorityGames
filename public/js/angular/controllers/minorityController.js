minorityApp.controller('minorityController', 
	function($scope, $location, $interval, $cookies, socket) {
		var username = $cookies.name;
		var userId;
		var rollingGraph = createRollingGraph("#graph", 600, 500, 6);
		var point = 0; // graph point
		var endRound;

		socket.on('userId', function (data) {
			console.log('received user id', data);
			userId = data;
			socket.emit('getUpdateState', userId);
		});

		socket.on('endRounds', function (usernames) {
			$scope.timer = 0;
			$interval.cancel(endRound);
		});

		// when connected we get state of graph and neighbourhood to draw the UI
		socket.on('updateState', function (data) {
			// data: userid, graph and usernames
			// graph is global, while neighbourhood (usernames) is local
			// we have to see if we need to update the graph
			// we have to update rankTotal (updateState gets transmitted when new user is added)
			if(userId == data.newguyID) {
				// initialize graph, neighbourhood and the rest
				$scope.drawGraph(data.graph);
				d3Neighbourhood(data.usernames, userId);
				$scope.round=data.graph.arr.length;
				$scope.updateScoreAndRank(data.usernames);
				socket.emit('getRoundTime', true);
			}
			// else {
			// 	//we just need to update the rank and total users
			// 	$scope.updateScoreAndRank(data.usernames);
			// }

		});

		socket.on('newRoundTimer', function (data) {
			// timer control
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

		socket.on('reset', function (data) {
			resetRollingCircles();
			resetRollingGraph(rollingGraph);
		});

		socket.on('newRound', function (data) {
			console.log('received new round signal!');
			
			// add the point to the graph
			color = $scope.getColor(point, data.graph.value);
			point = data.graph.value;
			rollingGraph.addPoint(point, color);

			// update neighbourhood
			console.log('updating neighbourhood!');
			d3Neighbourhood(data.usernames, userId);

			$scope.updateScoreAndRank(data.usernames);
			$scope.round = data.graph.arr.length;

			// timer control
			$scope.timer = data.time > 0 ? data.time : 0;
			$interval.cancel(endRound);
			endRound = $interval(function() {
				if ($scope.timer > 0) {
					$scope.timer -= 1;
				}
				else {
					$interval.cancel(endRound);
				}			
			}, 1000, data.time);
		});

		$scope.updateScoreAndRank = function (data) {
			// console.log('inside updateScoreAndRank');
			// console.dir(data);
			data.forEach(function(element, index){
				if(element.identifier == userId) {
					$scope.score = element.score;
					$scope.rank = element.rank;
				}
			});
			$scope.rankTotal = data.length;
		};

		$scope.makeDecision = function (data) {
			$scope.decision = data;
			socket.emit('decision', data);
			$scope.upbuttonClass = "";
			$scope.downbuttonClass = "";
			if (data=='up') {
				$scope.upbuttonClass = "btn-lg";
			}
			if (data=='down') {
				$scope.downbuttonClass = "btn-lg";
			}
		};

		$scope.drawGraph = function (graph) {
			rollingGraph.reset();
			point = graph.value;
			rollingGraph.updateYAxis(point);
			var pts = graph.arr;
			if(pts.length > 5) {
				pts = pts.slice( (pts.length-6), pts.length );
			}
			// console.dir(pts);
			previous = 0;
			pts.forEach(function(element, index){
				color = $scope.getColor(previous, element);
				rollingGraph.addPoint(element, color);
				previous = element;
			});
		};

		$scope.getColor = function (previous, current) {
			if (previous<current) { color = "#5cb85c"; }
			else { color = "#d9534f"; }
			return color;
		};

		// initialize default values and send 'add user' event to server
		// server should respond with a 'getState' event so that we can
		// draw the graph and neighbourhood and update score, rank and timer.
		$scope.init = function () {
			$scope.decision = 'boh';
			$scope.timer;
			$scope.round=0;
			$scope.rank=0;
			$scope.rankTotal=0;
			socket.emit('add user', username);

			// admin stuff
			$scope.nrounds = 25;
			$scope.hduration = 10;
			$scope.lduration = 5;
			$scope.jalgos = 15;
		};

		// admin stuff
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

		$scope.init();
});