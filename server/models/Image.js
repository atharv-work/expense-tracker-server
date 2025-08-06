// models/Image.js
const mongoose = require('mongoose');
const { Buffer } = require('buffer');

// Mongoose schema
const ImageSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
});

module.exports = mongoose.model('Image', ImageSchema);