var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var kittenSchema = new Schema({
	name: { type: String, required: true },
});

module.exports = mongoose.model('Kitten', kittenSchema);
