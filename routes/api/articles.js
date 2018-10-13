var db = require("../../models");

module.exports = {
	// Route for all Articles
	all: function(req, res) {
		db.Article.find({})
			.then(function(articles) {
				res.json(articles);
			})
		//error handling
			.catch(function(err) {
				res.json(err);
			});
	},

	// Route for specific Article and note
	findOne: function(req, res) {
		db.Article.findOne({_id: req.params.id})
			.populate("note")
			.then(function(articles) {
				res.json(articles);
			})
		//error handling
			.catch(function(err) {
				res.json(err);
			});
	},

	// Route for saving & updating the Article's note
	postOne: function(req, res) {
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
	}
};