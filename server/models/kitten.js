var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var kittenSchema = new Schema({
	name: String,
});

module.exports = mongoose.model('Kitten', kittenSchema);
