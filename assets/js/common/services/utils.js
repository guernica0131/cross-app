/* 
 * defines common helper functions
 */

(function(angular) {

    angular.module('services.utils', ['ngSails'])

    /*
     * factory for injecting lodash
     */
    .factory('_', ['$window',
        function($window) {
            return $window._;
        }
    ])

    .service('utils', ['$sails', '$q', '$state', '$filter', '_', 'config', function($sails, $q, $state, $filter, _, config) {

        // here we simply concatenate the url from config
        this.prepareUrl = function(model) {
            return config.apiUrl + model;
        };

        /*
         * socket
         *
         * assigns a callback to a certain model
         * @param :: String - the model
         * @param :: Function - the callback
         */
        this.socket = function(model, callback) {
            $sails.on(model, callback);
        };

        /*
         * connected
         *
         * we use this util to ensure that
         * sails is connected to the sockets
         */
        this.connected = function(callback) {

            var deferred = $q.defer();
            // if we are connected return
            if ($sails._raw.connected) {
                deferred.resolve();
            } else {
                $sails.on('connect', deferred.resolve);
            }

            return deferred.promise;
        };

        /*
         * connect
         *
         * generic connect function for sails connectivity
         *
         */
        this.connect = function(params) {
            var deferred = $q.defer();
            //this.connected
            var self = this;

            this.connected().then(function() {
                // if we don't have a model, reject
                if (!params || !params.model) {
                    return deferred.reject("A specific 'model' parameter is required");
                }
                // we'll assume a get method
                var method = params.method || 'get',
                    url = self.prepareUrl(params.model) + ((params.url) ? "/" + params.url : ""),
                    data = angular.copy(angular.extend(params));

                url = url.replace('//', '/');

                delete data.method;
                delete data.model;
                delete data.url;

                $sails[method](url, data).success(deferred.resolve).error(deferred.reject);


            });

            return deferred.promise;
        };

        /*
         * findIndex
         *
         * returns the next index of where based on search conditions
         *
         * @param {Array} items - the array being searched
         * @param {String} key - the object key index
         * @param {String | Number} - value being searched
         */
        this.findIndex = function(items, key, value) {
            return _.indexOf(_.pluck(items, key), value);
        };

    }])

    ;

})(angular);