/*
*  Entry application js file. 
*/

(function(angular) {

	angular.module('crossover', [
		'ngSails',
		'ui.router',
		'app.common',
		'app.views'
	])

	
	.config(['$locationProvider', '$stateProvider', function($locationProvider, $stateProvider) {
		 $locationProvider.html5Mode(true).hashPrefix('!');

		 $stateProvider.state('app', {
		 	url: '',
		 	template: '<div ui-view="app"></div>'
         });

	} ])


	.filter('trust', ['$sce', function($sce) { return $sce.trustAsHtml; }]);
		
	;
})(angular);