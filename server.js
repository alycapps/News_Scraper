// DEPENDENCIES ---
//for setting up server
var express = require("express");
//noSQl database
var mongoose = require("mongoose");
//will make automatic console.logs
var logger = require("morgan");
// Set Handlebars.
var exphbs = require("express-handlebars");
//----

//Import routes
var viewRoutes = require("./routes/view/index")
var scrapeRoute = require("./routes/api/scrape")
var articleRoutes = require("./routes/api/articles")

//create express server
var app = express();

//automatic console logging
app.use(logger("dev"));

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Use static folder
app.use(express.static("public"));

// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

//HANDLEBARS 
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//ROUTES ----
//used for handlebars
app.get("/", viewRoutes.fetchAll);
//scraping route for NPR food
app.get("/scrape", scrapeRoute.scrape);
// Route for all Articles
app.get("/articles", articleRoutes.all);
// Route for specific Article and note
app.get("/articles/:id", articleRoutes.findOne);
// Route for saving & updating the Article's note
app.post("/articles/:id", articleRoutes.postOne);
//----

//start server listening on port 3000
app.listen(3000, function() {
	console.log("App running on port 3000!");
});