angular.module('ToDoApplication.controllers.tasks', [])
	.controller('TasksController', 
		function($scope, $window, tasksApiService){

			$scope.tasks = [];

			$scope.updateList = function(){
				tasksApiService.getList().then(function(response){
					$scope.tasks = response.data;
				})
			}

			$scope.completed = function(index, bool){
				var task = $scope.tasks[index];
				var id = task['id'];

				tasksApiService.markTaskCompleted(id, bool).then(function(response){
					response.data; 
				});
			};

			$scope.create = function(description) {
				tasksApiService.addTask(description).then(function(response){
					
					if ($scope.tasks.length == undefined) {
						$scope.tasks = [response.data]
					} else {
						$scope.tasks.push(response.data);
					}

				});
				$scope['description'] = ''
			}

			if ($scope.$parent.loggedIn) { $scope.updateList() }

			$scope.$on('generateTaskList', function(data){
				$scope.updateList()
			})

		});

angular.module('ToDoApplication.services.tasks',[])
		.factory('tasksApiService', function($http, $window){

			var host = 'http://recruiting-api.nextcapital.com';

			return {
				getList: function(){
					var userId = $window.sessionStorage.userId;
				  var apiToken = $window.sessionStorage.token;

					return $http.get([ host, 'users', userId, 'todos' ].join('/'), { 
															params: { api_token: apiToken } 
														});
				},

				addTask: function(todoDescription){
					var userId = $window.sessionStorage.userId;
				  var apiToken = $window.sessionStorage.token;

					return $http.post([ host, 'users', userId, 'todos' ].join('/'), {
															api_token: apiToken, 
															todo: {description: todoDescription},
															user_id: userId 
														});
				},

				markTaskCompleted: function(taskId, completed){
					var userId = $window.sessionStorage.userId;
				  var apiToken = $window.sessionStorage.token;
					return $http.put([ host, 'users', userId, 'todos', taskId ].join('/'), { 
															api_token: apiToken,
															todo: {is_complete: completed}
														});
				}
			}

		});


				
