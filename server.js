// DEPENDENCIES ---
//for setting up server
var express = require("express");
//noSQl database
var mongoose = require("mongoose");
//will make automatic console.logs
var logger = require("morgan");
//for scraping website
var axios = require("axios");
var cheerio = require("cheerio");
// Set Handlebars.
var exphbs = require("express-handlebars");
//----

//create express server
var app = express();

//automatic console logging
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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// Connect to Mongoose
// mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//HANDLEBARS ---
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// // Import routes and give the server access to them.
// var routes = require("./controllers/routecontroller.js");

// app.use(routes);
//used for handlebars
// var router = express.Router();
app.get("/", function(req, res) {
	res.render("index", articles);
});
//---

//scraping route for npr food
// var articles = [];
app.get("/scrape", function(req, res) {
	//grab the html body of npr
	axios.get("https://www.npr.org/sections/food/").then(function(response) {

		// Load the Response into cheerio and save it to a variable
		var $ = cheerio.load(response.data);
		$("h2.title").each(function(i, element) {
			var result = [];

			var title = $(element).children().text();
			var link = $(element).children().attr("href");
			var summary = $(element).parent().children().text();
			result.push({
				title: title,
				link: link,
				summary: summary
			});
			// Create a new Article using the `result` object built from scraping
			db.Article.create(result)
				.then(function(dbArticle) {
					// View the added result in the console
					console.log(dbArticle);
				})
				.catch(function(err) {
					// If an error occurred, send it to the client
					return res.json(err);
				});
		});
		res.send("articles found :)")
	});
});

//ROUTES----
// Route for all Articles
app.get("/articles", function(req, res) {
	db.Article.find({})
		.then(function(articles) {
			res.json(articles);
		})
	//error handling
		.catch(function(err) {
			res.json(err);
		});
});
// Route for specific Article and note
app.get("/articles/:id", function(req, res) {
	db.Article.findOne({_id: req.params.id})
		.populate("note")
		.then(function(articles) {
			res.json(articles);
		})
	//error handling
		.catch(function(err) {
			res.json(err);
		});
});

// Route for saving & updating the Article's note
app.post("/articles/:id", function(req, res) {
	db.Note.create(req.body)
		.then(function(newNote) {
			return db.Article.findOneAndUpdate(
				{_id: req.params.id}, 
				{$push: { note: newNote._id }}, 
				{new: true });
		})
		.then(function(article) {
			res.json(article);
		})
		.catch(function(err) {
			res.json(err);
		});
});
//----

//start server listening on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!");
});