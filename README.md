# Crossover Application - Sr Front End Web Designer 
## Adam Thomas Smith <guernica0131@gmail.com>

This project is for my application to the Sr. Front End Web Designer. The following document covers the deployment and application structure.

## Getting started

In order to deploy the application, you must have [node.js](https://nodejs.org/en/) installed. Once installed, using the command line interface at the application's root directory, run the following command:

`npm start`

This will install all server/client dependencies and start the webserver. Once complete, the application will be running on port `1337`. If you are deploying locally, simply direct your web browser to `http://localhost:1337`, or click the following link: [Crossover App](http://localhost:1337).

Press `CTRL + C` to stop the application.

## Structure:

#### Technology 

The application was built using a node.js framwork called [Sails.js](http://sailsjs.org). The front-end components were built around [Angular.js](https://angularjs.org) and [Bootstrap](http://getbootstrap.com/), while the icon set, was implemented using [FontAwesome](http://fontawesome.io/icons/).

All custom client-side javascript files are located under `assets/js`. CSS styles are available under `assets/styles` and were written using [Less](http://lesscss.org/) preprocessor. [Grunt](http://gruntjs.com/) is used for managing the asset pipeline and [Bower](http://bower.io/) is in place for managing client dependencies. 

#### Server API

When first running the webserver, the framework checks to see if there are existing data models available. If none are found, it runs a **seed** function that builds random models based on arbitrary data parameters. You can find the custom logic implementing the seeding function under `config/bootstrap.js`. Should a new set of models need to be created simple run `rm -r .tmp` from the application's root directory. This will destroy the existing models and generate a new random set once the application has been restarted. Currently, the application is set to seed 10 random models, however, if more or less are needed, simply add an environment variable `SEED_COUNT` or you can manually change the default seed count by changing line 225 or `config/boostrap.js`. The line is as follows: 

`var seedCount = process.env.SEED_COUNT || 10; //change to update the seed count`

The api for these models exists at the following route: `api/v1/application`. Assuming you are running the application on localhost, you will find the json models @ `http://localhost:1337/api/v1/application`.

#### Frontend

Sails.js uses server-side EJS templating engine, all templates can be found under the `views` folder. The entry file is `views/layout.ejs`. I've set the index route under `config/routes.js` to call the server-side index controller and index action. This simple controller calls the index view `views/index/index.ejs`. The controller can be found at `api/controllers/IndexController.js`.

All remain HTML documents are complied to JST templates.

The angular entry module can be found at `assets/js/app.js`. At the root route, the index view `assets/js/views/index.js` contains the controller and most of the application logic for managing the angular app. 

Supporting javascript files can be found under `assets/js/common`.


