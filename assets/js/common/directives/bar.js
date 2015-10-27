/*
* Custom bar directive
*/

(function(angular) {

	angular.module('directives.bar', [])

	.directive('bar', [function() {
		return {
			restrict: 'E',
			controller: ['$scope', function($scope) {
				
				

			}],
			template: JST['assets/templates/bar.html'](),
			scope: {
				coverage: '=',
			},
			link: function(scope, el, attrs) {
				// @todo perhaps needed in future implementations
				var $_chart = el.children().children();
				var $_child;
				// angular does not support advanced query language without jQuery
				angular.forEach($_chart, function(child) {

					var $_lookup = angular.element(child);

					if ($_lookup.hasClass('bar-chart')) {
						$_child = $_lookup;
					}

				});
				// this should be computed. jQuery would be useful
				var bar_width = Math.round(180 * (scope.coverage / 100));
				$_child.css({width: bar_width + 'px'});

			}
		};	
	}])


	;

})(angular);