/*
 * Index page view
 */
(function(angular) {

    angular.module('views.index', ['angularMoment', 'chart.js'])


    .config(['$stateProvider', function($stateProvider) {

        $stateProvider.state('app.index', {
            url: '/',
            views: {
                'app': {
                    template: JST['assets/js/views/index/index.html'](),
                    controller: 'IndexController'
                }
            }

        });

    }])

    .controller('IndexController', ['$scope', 'Apps', '$timeout', '$sce', '$compile', '$filter', 'amMoment', function($scope, Apps, $timeout, $sce, $compile, $filter, amMoment) {

        var apps = new Apps($scope);

        /*
         * We pull the apps from websockets
         */
        apps.get().then(function(apps) {
            console.log("Our estabilshed apps", apps);
        });
        /*
         * setActive
         *
         * function for toggling the accordions
         * @param Object - element, the object clicked
         */
        $scope.setActive = function(element) {
            // we set a toggle to close an element
            var toggle = !element.active;
            angular.forEach($scope.apps, function(app) {
                app.active = false;
            });

            element.active = toggle;
        };

        /*
         * showDetails
         *
         * Shows the details for the item being searched
         * @param Integer - index, the index of the context box
         & @param Object - element, the model being displayed
         * @todo:: implement view with actual context
         */
        $scope.showDetails = function(index, element) {
            $scope.$root.popover = true;
            $scope.$root.pContent = JST['assets/templates/metrics-detail.html']({
                id: element.typeID,
                message: "This would contain detailed information for the current element"
            });
        };



        $scope.charColors = ['#f0ad4e', '#5cb85c'];

        /*
         * setPassing
         *
         * defines arbitrary logic for passing content
         * @param Object - metrics, contains metric data
         */
        $scope.setPassing = function(metrics) {

            var conducted = metrics.conducted,
                passed = metrics.passed;

            var percent = passed / (conducted || 1) * 100;

            if (percent > 70) {
                return 'ok'
            } else if (percent > 55) {
                return 'warning'
            }
        };

        /*
         * setTemplate
         *
         * sets a jst template 
         * @param Object - data, the selected model
         @ @param String - context, the name of the parameter
         */
        $scope.setTemplate = function(data, context) {
            // we test the logic her to define the state of the element
            if (!data) {
                return;
            }

            var template = (JST['assets/templates/' + context + '.html'] || angular.noop)(data);

            return $filter('trust')(template);
        };
        /*
         * deploy
         *
         * updates the api for the state change
         * @param Object - data, the selected model
         * @param String - context, the name of the parameter
         */
        $scope.deploy = function(data) {

            var changes = {
                    state: 'Running',
                    logs: angular.copy(data.logs),
                    stages: angular.copy(data.stages)
                }
                // not exactly defining the state we are in
            changes.stages.functional = 'running';
            changes.logs.unshift('Running on ' + data.deploy);

            apps.update(data, changes).then(function(update) {
                // inform the ui
            });

        };
        /*
         * findIssue
         *
         * creates issue based on stage failures
         * @param Object - data, the selected model
         */
        $scope.findIssues = function(data) {
            var issues = [],
                messages = {
                    metrics: 'Application metrics failed to meet requirements.',
                    unit: 'Unit testing failed to meet predefined benchmarks.',
                    build: 'The application failed to build.',
                    functional: 'Functional testing did not meet the required benchmarks.',
                    defaultMessage: 'The application architecture is not to specification.'
                };

            angular.forEach(data.stages, function(stage, index) {

                if (stage == 'fail') {
                    issues.push(messages[index]);
                }

            });

            if (!issues.length) {
                issues.push(messages['defaultMessage']);
            }

            $scope.$root.popover = true;
            $scope.$root.pContent = JST['assets/templates/issues.html']({
                id: data.typeID,
                issues: issues
            });

        };

        /*
         * merge
         *
         * empty function for updating a merge build
         * @param Object - data, the selected model
         * @todo :: implement server-side logic
         */
        $scope.merge = function(data) {
            console.log("@todo:: implement merge");
        };


    }])

    ;

})(angular);