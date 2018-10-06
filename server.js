// DEPENDENCIES
//for setting up server
var express = require("express");
//noSQl database
var mongoose = require("mongoose");
//will make automatic console.logs
var logger = require("morgan");
//for scraping website
var axios = require("axios");
var cheerio = require("cheerio");

//create express server
var app = express();

//automatic logging
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Use static folder
app.use(express.static("public"));

// Require mongoose models
var db = require("./models");

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);

// Connect to Mongoose
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//ROUTES





//start server listening on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});