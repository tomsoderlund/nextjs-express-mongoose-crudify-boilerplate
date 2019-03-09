const mongoose = require('mongoose')

const Schema = mongoose.Schema

const kittenSchema = new Schema({
  name: { type: String, required: true }
})

module.exports = mongoose.model('Kitten', kittenSchema)
