const axios = require('axios');
const Rental = require('../models/Rental');
const Car = require('../models/Car');

const fetchCarDetails = async (carId) => {
  try {
    const response = await axios.get('https://exam-server-7c41747804bf.herokuapp.com/carsList');
    const cars = response.data.data;
    return cars.find(car => car.id === carId);
  } catch (error) {
    throw new Error('Error fetching car details');
  }
};

const calculateRental = async (req, res) => {
  const { customer, carId, pickupDate, dropoffDate, additionalCharges, discount } = req.body;

  try {
    const car = await fetchCarDetails(carId);
    const pickup = new Date(pickupDate);
    const dropoff = new Date(dropoffDate);
    const duration = dropoff - pickup;
    const hours = duration / (1000 * 60 * 60);
    const days = Math.ceil(hours / 24);
    const weeks = Math.ceil(days / 7);

    let total = 0;
    if (hours <= 24) {
      total = Math.min(hours * car.rates.hourly, car.rates.daily);
    } else if (days <= 7) {
      total = Math.min(days * car.rates.daily, car.rates.weekly);
    } else {
      total = weeks * car.rates.weekly;
    }

    total += additionalCharges;
    total -= discount;

    const rental = new Rental({
      customer,
      car: {
        id: car.id,
        make: car.make,
        model: car.model,
        year: car.year,
        type: car.type,
      },
      rentalDuration: {
        pickupDate: pickup,
        dropoffDate: dropoff,
      },
      charges: {
        additionalCharges,
        discount,
        total,
      },
    });

    await rental.save();
    res.status(200).json({ success: true, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { calculateRental };
