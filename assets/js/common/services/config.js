/*
* Application config
* @todo:: change config basked on environment 
*/

(function(angular) {

	angular.module('services.config', [])

	.service('config', [function() {
		this.apiUrl = '/api/v1/';
		// remaining configs here

	}]);

})(angular);