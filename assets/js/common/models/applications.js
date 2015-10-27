/*
 * applications model,
 * inherits from mode
 */

(function(angular) {

    angular.module('model.applications', [])

    .factory('Apps', ['Model', function(Model) {

        var Apps = function($scope) {
            Model.call(this, $scope, 'application', 'apps');
        };

        Apps.prototype = Object.create(Model.prototype);

        Apps.prototype.constructor = Model;


        return Apps;


    }])

    ;


})(angular);