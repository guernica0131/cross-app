/*
* Custom popover directive
*/

(function(angular) {

	angular.module('directives.popover', [])

	.directive('popOver', [function() {
		return {
			restrict: 'E',
			controller: ['$scope', '$sce', function($scope, $sce) {
				
				$scope.close = function() {
					$scope.popover = false;
				};

				$scope.trust = function(content) {
					return $sce.trustAsHtml(content);
				};

			}],
			template: '<div ng-show="popover" id="popover"><div class="popover-content-wrapper"><div class="close-button" ng-click="close()"><i class="fa fa-times fa-3x"></i></div><div id="popover-content" ng-bind-html="content | trust"></div></div></div>',
			scope: {
				popover: '=',
				content: '='
			},
			link: function(scope, el, attrs) {
				// @todo perhaps needed in future implementations
			}
		};	
	}])


	;

})(angular);