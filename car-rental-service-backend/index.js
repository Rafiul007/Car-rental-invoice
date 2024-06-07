const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const rentalRoutes = require('./routes/rentalRoutes');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb://localhost:27017/carRentalService', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api', rentalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
