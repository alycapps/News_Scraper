var db = require("../../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = {
	scrape: function(req, res) {
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
	}
}