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
mongoose.connect(MONGODB_URI);

// Connect to Mongoose
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

//HANDLEBARS ---
// app.engine("handlebars", exphbs({ defaultLayout: "main" }));
// app.set("view engine", "handlebars");

// // Import routes and give the server access to them.
// var routes = require("./controllers/routecontroller.js");

// app.use(routes);
//---

//scraping route for npr food
app.get("/scrape", function(req, res) {
  //grab the html body of npr
  axios.get("https://www.npr.org/sections/food/").then(function(response) {

    // Load the Response into cheerio and save it to a variable
    var $ = cheerio.load(response.data);

    var articles = [];

    $("h2.title").each(function(i, element) {
      // Save the text of the element in a "title" variable
      var title = $(element).children().text();
      // In the currently selected element, look at its child elements (i.e., its a-tags),
      // then save the values for any "href" attributes that the child elements may have
      var link = $(element).children().attr("href");
      var summary = $(element).parent().children().text();
    // Save these results in an object that we'll push into the results array we defined earlier
      articles.push({
        title: title,
        link: link,
        summary: summary
      });
    });
    // Log the results once you've looped through each of the elements found with cheerio
    console.log(articles);
    res.send("articles found :)")
  });
});

//ROUTES----
// Route for getting all Articles
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


//----

//start server listening on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});