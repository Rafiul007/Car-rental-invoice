// models/Rental.js
const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
  customer: {
    name: String,
    email: String,
    address: String,
  },
  car: {
    id: String,
    make: String,
    model: String,
    year: Number,
    type: String,
  },
  rentalDuration: {
    pickupDate: Date,
    dropoffDate: Date,
  },
  charges: {
    additionalCharges: Number,
    discount: Number,
    total: Number,
  },
});

module.exports = mongoose.model('Rental', RentalSchema);
