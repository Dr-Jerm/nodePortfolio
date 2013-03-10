var mongoose = require("mongoose");
var db = require("../db");

mongoose.connection = db;

var schema = new mongoose.Schema({
	name: String,
	description: String,
	progress: String,
	pair: [ {name: String}, {name: String} ],
	comments: Array
});

var model = mongoose.model('UserStory', schema);

exports.model = model;