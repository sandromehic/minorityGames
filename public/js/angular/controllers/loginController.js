classicalMinorityApp.controller('loginController', ['$scope', '$location', 'userService', 
	function($scope, $location, userService) {
		$scope.login = function() {
			if($scope.user != '') {
				userService.setuser($scope.user);
				$location.path('/classicalminority');
			}
		};
		$scope.keypressedLogin = function(keyEvent) {
			if (keyEvent.keyCode == 13) {
				$scope.login();
			}
		};
}]);