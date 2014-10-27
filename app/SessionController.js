angular.module('ToDoApplication.controllers.session', [])
	.controller('SessionController', 
		function($scope, $window, sessionApiService){

			$scope.loggedIn = $window.sessionStorage.userId ? true : false;

			$scope.credentials = {
				email: '',
				password: ''
			}

			$scope.newCredentials = {
				email: '',
				password: ''
			}

			$scope.createUser = function(email, password){
				sessionApiService.newUser(email, password).then(function(response){
					$window.sessionStorage.token = response.data.api_token;
					$window.sessionStorage.userId = response.data['id'];
					$scope.loggedIn = true;
				});
			}

			$scope.login = function(email, password){
				sessionApiService.newSession(email, password).then(function(response){
					$window.sessionStorage.token = response.data.api_token;
					$window.sessionStorage.userId = response.data['id'];

					$scope.loggedIn = true;
					$scope.$broadcast('generateTaskList',{});
				});

				$scope.credentials.email = '';
				$scope.credentials.password = '';
			}

			$scope.logout = function(){
				sessionApiService.closeSession().then(function(response){
					console.log(response)
				});

				delete $window.sessionStorage.token;
				delete $window.sessionStorage.userId;
				$scope.loggedIn = false;
			}
		});

angular.module('ToDoApplication.services.session',[])
		.factory('sessionApiService', function($http, $window){

			var host = 'http://recruiting-api.nextcapital.com';

			return {
				newUser: function(email, password){
					return $http.post([host, 'users'].join('/'), {
															email: email,
															password: password
														});

				},

				newSession: function(email, password){
					return $http.post([host, 'users', 'sign_in'].join('/'), {
															email: email,
															password: password
														});

				},

				closeSession: function(){
					var apiToken = $window.sessionStorage.token;
					var userId = $window.sessionStorage.userId;

					return $.ajax({
						method:'DELETE',
						url: [host, 'users', 'sign_out'].join('/'), 
						data: { api_token: apiToken, 
										user_id: userId }
					});
				}
			}
		});

//////////////////////////////////////////////////////// 
// For some reason, neither of these are working for me. 
		// When I try to pass the api token and user id as data, they are not recognized. 
					// return $http({
					// 	method:'delete',
					// 	url: [host, 'users', 'sign_out'].join('/'), 
					// 	params: { 
					// 		api_token: apiToken, 
					// 		user_id: userId
					// 	}
					// });


// When I pass them as params, I get a CORS error.
					// return $http.delete([host, 'users', 'sign_out'].join('/'), {
					// 	data: {
					// 		api_token: apiToken, 
					// 		user_id: userId
					// 	}
					// });