/**
 * IndexController
 *
 * @description :: Server-side logic for managing indices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	/*
	* We have a simple controller that
	* directly calls it's view 
	* views/index/index.ejs
	* @param: Object - req, the request object
	* @param: Object - res, the response object
	*/
	index: function(req, res) {
		res.view();
	}
	
};

