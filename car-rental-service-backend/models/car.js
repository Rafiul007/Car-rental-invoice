// models/Car.js
const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  make: String,
  model: String,
  year: Number,
  type: String,
  seats: Number,
  bags: Number,
  features: [String],
  rates: {
    hourly: Number,
    daily: Number,
    weekly: Number,
  },
  imageURL: String,
});

module.exports = mongoose.model('Car', CarSchema);
