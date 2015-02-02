var loginApp = angular.module('loginApp', []);

loginApp.controller('loginController', function ($scope, $http, $location) {
	$scope.loginUser = function() {
		if($scope.user.name) {
			$http.post('/api/login', $scope.user)
				.success(function (data) {
					console.log('Success post /api/login');
					window.location.href = '/';
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		}
	};

	$scope.keypressedLogin = function(keyEvent) {
		if (keyEvent.keyCode == 13) {
			$scope.loginUser();
		}
	};
	
	$scope.loginAdmin = function() {
		if($scope.user.name) {
			$http.post('/api/loginAdmin', $scope.user)
				.success(function (data) {
					console.log('Success post /api/loginAdmin');
					window.location.href = '/admin';
				})
				.error(function (data) {
					console.log('Error: ' + data);
				});
		}
	};
});