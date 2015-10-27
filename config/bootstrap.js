/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

var Chance = require('chance'),
    chance = new Chance();

module.exports.bootstrap = function(cb) {


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    async.series([


        // seed the data
        function(cb) {

            /*
             * Our seed function creates fake data for our api
             */
            var seed = function() {
                console.log("Seeding app data");
                // here we set our log, based on randomly selected state
                var setLog = function(state) {
                    switch (state) {
                        case 'Pending':
                            return chance.pick(['Waiting on Build', 'Build type not ready', 'Pending acceptance']);
                        case 'Running':
                            return chance.pick(['Deployed to Development', 'Deployed to Production', 'Deployed to QA']);
                        case 'Rejected':
                            return chance.pick(['Metric Reduction', 'Insufficient Coverage', 'QA Failed', 'Build Failed']);
                        case 'Complete':
                            return 'Complete';
                        case 'Accepted':
                            return 'Auto Merged'
                    };
                };

                var setType = function(type) {
                    switch (type) {
                        case 'firewall':
                            return chance.integer({
                                min: 400000,
                                max: 499999
                            }); // 6 digits,
                        case 'build':
                            return 'Tenrox_' + chance.integer({
                                min: 1000,
                                max: 1999
                            });
                    };
                };

                // here we mock the code coverage due to dependency

                // now we seed our data
                async.times(seedCount, function(cb) {

                    var unit = chance.integer({
                            min: 0,
                            max: 300
                        }),
                        functional = chance.integer({
                            min: 0,
                            max: 3000
                        }),
                        type = chance.pick(['firewall', 'build']),
                        state = (function(type) {
                            // sets a default for debugging
                            //return 'Accepted';

                            if (type == 'firewall') {
                                return chance.pick(['Pending', 'Rejected', 'Accepted']);
                            } else {
                                return chance.pick(['Pending', 'Running', 'Complete', 'Failed']);
                            }

                        })(type),
                        stages = (function(state) {

                            var stages = {
                                    metrics: 'pass',
                                    build: 'pass',
                                    unit: 'pass',
                                    functional: 'pass'
                                },
                                chanceIndex = chance.pick(['metrics', 'build', 'unit', 'functional']),
                                clean = function(stage) {
                                    var skip = false;

                                    _.each(stages, function(stage, index) {
                                        stages[index] = '';

                                        if (index == chanceIndex) {
                                            skip = true;
                                        } else if (!skip) {
                                            stages[index] = chance.pick(['pass', 'fail', '']);
                                        }

                                    });

                                    stages[chanceIndex] = stage;

                                };

                            switch (state) {
                                case 'Pending':
                                    clean('');
                                case 'Rejected':
                                    clean('fail');
                                case 'Accepted':
                                    break;
                                case 'Running':
                                    clean('running');
                                case 'Complete':
                                    break;
                                case 'Failed':
                                    clean('fail');

                            };


                            return stages;
                        })(state),
                        builds = (function(count) {
                            var builds = [];

                            _.times(count, function() {
                                builds.push({
                                    time: chance.date({
                                        year: 2015
                                    }),
                                    id: chance.integer({
                                        min: 1200,
                                        max: 4500
                                    })
                                });
                            })

                            return builds;
                        })(chance.integer({
                            min: 1,
                            max: 10
                        }));


                    Application.create({
                        type: type,
                        typeID: setType(type),
                        state: state,
                        timeStarted: chance.date({
                            year: 2015,
                            month: 9
                        }),
                        stages: stages,
                        metrics: {
                            test: chance.integer({
                                min: 0,
                                max: 100
                            }),
                            maintain: chance.integer({
                                min: 0,
                                max: 100
                            }),
                            security: chance.integer({
                                min: 0,
                                max: 100
                            }),
                            workmanship: chance.integer({
                                min: 0,
                                max: 100
                            })
                        },
                        unit: {
                            coverage: chance.integer({
                                min: 0,
                                max: 100
                            }),
                            test: {
                                conducted: unit,
                                passed: chance.integer({
                                    min: 0,
                                    max: unit
                                })
                            }
                        },
                        build: builds,
                        functional: {
                            coverage: chance.integer({
                                min: 0,
                                max: 100
                            }),
                            test: {
                                conducted: functional,
                                passed: chance.integer({
                                    min: 0,
                                    max: functional
                                })
                            }
                        },
                        owner: chance.pick(['jtuck', 'samy', 'asmith']), // @todo, create an associated user model
                        logs: [
                            setLog(state)
                        ],
                        deployment: chance.pick(['Development', 'Production', 'QA'])

                    }, function(err, app) {
                        console.log("Seed app created", app);
                    });


                });
            };



            var seedCount = process.env.seedCount || 10;
            //console.log(sails.models['application']);
            Application.find({}).exec(function(err, found) {
                if (!(found || []).length) {
                    seed();
                }

            });
            // we are going to callback because we don't need the models to build before waiting
            // to boostrap the app
            cb();

        }

    ], cb)



};