var express = require("express");
var router = express.Router();
var orm = require("../config/orm.js");

// Import the model (cat.js) to use its database functions.
var Articles = require("../models/articles.js");

// Create all our routes and set up logic within those routes where required.
router.get("/", function (req, res) {
	orm.all(Articles, function(res) {
		cb(res);
	});
});


module.exports = router;
