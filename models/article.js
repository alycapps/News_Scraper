var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Mongoose Article constructor
var Article = new Schema({
	title: {
		type: String,
		required: true,
		unique: true
	},
	link: {
		type: String,
		required: true
	},
	summary: {
		type: String,
		required: true
	},
	saved: {
		type: Boolean,
		default: false
	},
	// will be used to connect to notes
	note: {
		type: Schema.Types.ObjectId,
		ref: "Note"
	}
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", Article);

// Export the Article model
module.exports = Article;
