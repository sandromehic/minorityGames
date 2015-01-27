var classicalMinorityApp = angular.module('classicalMinorityApp', ['ngRoute']);

classicalMinorityApp.config(['$routeProvider',
	function($routeProvider){
		$routeProvider
			.when('/login', {
				templateUrl: 'partials/login',
				controller: 'loginController'
			})
			.when("/classicalminority", {
				templateUrl: 'partials/classicalminority',
				controller: 'classicalMinorityController'
			})
			.otherwise({ 
				redirectTo: '/login' 
			});
}]);