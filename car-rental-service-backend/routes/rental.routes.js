const express = require('express');
const { calculateRental } = require('../controllers/rentalController');
const router = express.Router();

router.post('/calculate-rental', calculateRental);

module.exports = router;
