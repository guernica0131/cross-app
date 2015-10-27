/*
 * Defines the base models class to be inherited by application models
 */

(function(angular) {

    angular.module('common.models', [
        'model.applications'
    ])

    .factory("Model", ['utils', '$q',
        function(utils, $q) {

            /*
             * Model
             *
             * Constructor of the object function
             * @param {Object} $scope - the angular scope
             * @param {String} model - the objecttype being created
             * @param {String} scopeName - the name of the scoped array of objs
             */
            var Model = function($scope, model, scopeName) {
                this.scope = $scope;
                this.model = model;
                this.scopeName = scopeName || utils.pluralize(model);
            };


            Model.prototype.models = function() {
                return this.scope[this.scopeName];
            };

            /*
             * listen
             *
             * activate auto listening for model changes
             */
            Model.prototype.listen = function(callback) {
                var self = this,
                    actions = {
                        updated: function(data) {

                            var index = utils.findIndex(self.scope[self.scopeName], 'id', data.id);

                            if (index === -1) {
                                return;
                            }

                            Object.keys(data.data).forEach(function(key) {
                                self.scope[self.scopeName][index][key] = data.data[key];
                            });

                        },
                        created: function(data) {
                            var pId = data.data.document;
                            // if the document id is the same as the parent, insert
                            if (this.scope.activeDocument.id === pId) {
                                this.insert(data.data);
                            }


                        },
                        destroyed: function(data) {

                            var index = utils.findIndex(self.scope[self.scopeName], 'id', data.id);

                            if (index === -1) {
                                return;
                            }
                            self.scope[self.scopeName].splice(index, 1);
                        },

                    };

                this.register(function(commet) {
                    console.log("SETTING UP LISTEN", commet);
                    var action = actions[commet.verb];
                    if (action instanceof Function) {
                        (action.bind(self))(commet);
                    }

                });


            };

            /*
             * register
             *
             * registers a function to the socket callback for changes.
             * @param {Function} callback : callback that will be registered
             */
            Model.prototype.register = function(callback) {
                utils.socket(this.model, callback);
            };


            /*
             * set 
             *
             * sets models in the scope
             *
             * @param {Array} models - the models to insert
             * @return {promise} resolved once we get a valid response from the web server
             */

            Model.prototype.set = function(models) {
                this.scope[self.scopeName] = models;
            };

            /*
             * connect
             *
             * generic function for connecting to the we socket
             *
             * @param {object} params - any parameters we want to include
             * @return {promise} resolved once we get a valid response from the web server
             */

            Model.prototype.connect = function(params) {
                var deferred = $q.defer();

                utils.connect(angular.extend({
                    model: this.model
                }, params)).then(deferred.resolve, deferred.reject);

                return deferred.promise;
            };

            /*
             * update
             *
             * updates a single instance of a model.
             * @param {Object} model  - instance of a model
             * @param {Object} updatedAttributes - the updated attributes
             * @return {promise}
             */
            Model.prototype.update = function(model, update) {

                var self = this,
                    deferred = $q.defer(),
                    params = angular.extend({
                        url: model.id
                    }, update);
                this.connect(angular.extend({
                    method: 'put'
                }, params)).then(function(updated) {
                    // now we update the model
                    var index = utils.findIndex(self.scope[self.scopeName], 'id', updated.id);

                    if (index === -1) {
                        return deferred.resolve(updated);
                    }
                    self.scope[self.scopeName][index] = updated;
                    deferred.resolve(updated);
                }, deferred.reject);

                return deferred.promise;

            };

            /*
             * get
             *
             * gets all or a single instance of a model.
             *
             * @param {object} params - the option query parameters
             * @return {promise}
             */

            Model.prototype.get = function(params) {
                var self = this,
                    deferred = $q.defer();
                this.connect(angular.extend({
                    method: 'get'
                }, params)).then(function(models) {
                    // place in scope
                    if (models && models.length) {
                        self.scope[self.scopeName] = (models instanceof Array) ? models : [models];
                    }
                    deferred.resolve(models);
                }, deferred.reject);

                return deferred.promise;
            };

            /*
             * insert
             *
             * inserts a single object into the array. It adds the statics
             *
             * @param {Object} model - the model
             * @return {promise}
             */

            Model.prototype.insert = function(model) {
                this.scope[self.scopeName].push(model[0]);
            };

            /*
             * create
             *
             * creates a single instance of a model.
             * @param {Object} params : the new model we create
             * @return {promise}
             */

            Model.prototype.create = function(params) {
                var self = this,
                    deferred = $q.defer();
                this.connect(angular.extend({
                    method: 'post'
                }, params)).then(function(model) {
                    // place in scope once the model has been added to the api
                    self.insert(model);

                    deferred.resolve(model);
                }, deferred.reject);

                return deferred.promise;
            };


            /*
             * destroy
             *
             * deletes a single instance of a model.
             * @param {Object} model - the model we want to destroy
             * @return {promise}
             */
            Model.prototype.destroy = function(model) {
                var self = this,
                    deferred = $q.defer();

                var params = {
                    url: model.id
                };

                this.connect(angular.extend({
                    method: 'delete'
                }, params)).then(function(model) {
                    var index = utils.findIndex(self.scope[self.scopeName], 'id', model.id);

                    if (index >= 0) {
                        self.scope[self.scopeName].splice(index, 1);
                    }

                    deferred.resolve(model);
                }, deferred.reject);

                return deferred.promise;
            };


            return Model;


        }



    ])



    ;

})(angular);