var mongoose = require("mongoose");

var Schema = mongoose.Schema;

// Mongoose Note constructor
var Note = new Schema({
  title: String,
  body: String
});

// This creates our model from the above schema, using mongoose's model method
var Note = mongoose.model("Note", Note);

// Export the Note model
module.exports = Note;