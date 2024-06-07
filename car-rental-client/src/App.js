// src/App.js
import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import "./App.css";
import PrintableInvoice from "./PrintableInvoice";

function App() {
  const [formData, setFormData] = useState({
    reservationId: "",
    pickupDate: "",
    returnDate: "",
    duration: "",
    discount: "",
    vehicleType: "",
    vehicle: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    collisionDamageWaiver: false,
    liabilityInsurance: false,
    rentalTax: false,
  });

  const [totalCharges, setTotalCharges] = useState({
    daily: 0,
    weekly: 0,
    collisionDamageWaiver: 9.0,
    liabilityInsurance: 15.0,
    rentalTax: 11.5,
    total: 0,
  });

  const [dailyCharge, setDailyCharge] = useState(0);
  const [weeklyCharge, setWeeklyCharge] = useState(0);
  const [carsList, setCarsList] = useState([]);
  const componentRef = useRef();

  useEffect(() => {
    fetch("https://exam-server-7c41747804bf.herokuapp.com/carsList")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          setCarsList(data.data);
        } else {
          console.error("Failed to fetch cars data");
        }
      })
      .catch((error) => console.error("Error fetching cars data:", error));
  }, []);

  const calculateCharges = () => {
    const selectedCar = carsList.find(
      (car) =>
        car.type === formData.vehicleType && car.model === formData.vehicle
    );
    if (selectedCar) {
      const durationInDays = Math.ceil(
        (new Date(formData.returnDate) - new Date(formData.pickupDate)) /
          (1000 * 60 * 60 * 24)
      );
      const dailyRate = selectedCar.rates.daily;
      const weeklyRate = selectedCar.rates.weekly;
      const totalBeforeTaxAndInsurance =
        weeklyCharge * weeklyRate + dailyCharge * dailyRate;

      const collisionDamageWaiverCharge = formData.collisionDamageWaiver
        ? 9.0
        : 0;
      const liabilityInsuranceCharge = formData.liabilityInsurance ? 15.0 : 0;

      let subtotal =
        totalBeforeTaxAndInsurance +
        collisionDamageWaiverCharge +
        liabilityInsuranceCharge;
      const discount = parseFloat(formData.discount) || 0;
      subtotal = subtotal - discount;

      const rentalTaxCharge = formData.rentalTax ? subtotal * (11.5 / 100) : 0;

      const total = subtotal + rentalTaxCharge;

      setTotalCharges({
        daily: dailyRate,
        weekly: weeklyRate,
        collisionDamageWaiver: collisionDamageWaiverCharge,
        liabilityInsurance: liabilityInsuranceCharge,
        rentalTax: rentalTaxCharge,
        total: total,
      });
    }
  };

  const calculateDuration = (pickupDate, returnDate) => {
    if (!pickupDate || !returnDate) {
      setDailyCharge(0);
      setWeeklyCharge(0);
      setFormData({ ...formData, duration: "0 weeks 0 days" });
      return;
    }
    const pickup = new Date(pickupDate);
    const returnDt = new Date(returnDate);
    const diffTime = Math.abs(returnDt - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    console.log(weeks, days);
    setDailyCharge(days);
    setWeeklyCharge(weeks);
    const duration = `${weeks} week${weeks > 1 ? "s" : ""} ${days} day${
      days > 1 ? "s" : ""
    }`;
    setFormData({ ...formData, duration: duration });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "pickupDate" || name === "returnDate") {
      // If pickupDate or returnDate changed, calculate duration
      calculateDuration(
        name === "pickupDate" ? value : formData.pickupDate,
        name === "returnDate" ? value : formData.returnDate
      );
    }
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    calculateCharges();
  }, [formData]);

  useEffect(() => {
    calculateDuration(formData.pickupDate, formData.returnDate);
  }, [formData.pickupDate, formData.returnDate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="container">
      <div className="heading-section">
        <h1>Reservation</h1>
        <button className="mt-4" onClick={handlePrint}>
          Print / Download
        </button>
      </div>
      <div className="grid grid-3-col">
        {/* Reservation Details */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="column-1">
                {/* reservation details div */}
                <div className="reservation details">
                  <h2 className="text-xl mb-2">Reservation Details</h2>
                  <div className="border">
                    <label>Reservation ID</label>
                    <input
                      type="text"
                      name="reservationId"
                      value={formData.reservationId}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <label>Pickup Date</label>
                    <input
                      type="datetime-local"
                      name="pickupDate"
                      value={formData.pickupDate}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <label>Return Date</label>
                    <input
                      type="datetime-local"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="input"
                    />
                    <div className="duration">
                      <label>Duration:</label>
                      <span>{formData.duration}</span>
                    </div>
                    <label>Discount</label>
                    <input
                      type="text"
                      name="discount"
                      value={formData.discount}
                      onChange={handleInputChange}
                      className="input"
                    />
                  </div>
                </div>
                {/* Vehicle Information */}
                <div className="vehicle details">
                  <h2 className="text-xl mb-2">Vehicle Information</h2>
                  <div className="border">
                    <label>Vehicle Type</label>
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select a type</option>
                      {[...new Set(carsList.map((car) => car.type))].map(
                        (type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        )
                      )}
                    </select>
                    <label>Vehicle</label>
                    <select
                      name="vehicle"
                      value={formData.vehicle}
                      onChange={handleInputChange}
                      className="input"
                    >
                      <option value="">Select a vehicle</option>
                      {carsList
                        .filter((car) => car.type === formData.vehicleType)
                        .map((car) => (
                          <option key={car.id} value={car.model}>
                            {car.make} {car.model} ({car.year})
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="column-2">
                {/* Customer Information */}
                <div className="customer details">
                  <div>
                    <h2 className="text-xl mb-2">Customer Information</h2>
                    <div className="border">
                      <label>First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                      <label>Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                      <label>Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                  <div className="insurance details">
                    {/* Insurance Options */}
                    <h2 className="text-xl mb-2">Insurance Options</h2>
                    <div className="border">
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          name="collisionDamageWaiver"
                          checked={formData.collisionDamageWaiver}
                          onChange={handleInputChange}
                        />
                        <label>Collision Damage Waiver ($9.00/day)</label>
                      </div>
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          name="liabilityInsurance"
                          checked={formData.liabilityInsurance}
                          onChange={handleInputChange}
                        />
                        <label>Liability Insurance ($15.00/day)</label>
                      </div>
                      <div className="checkbox">
                        <input
                          type="checkbox"
                          name="rentalTax"
                          checked={formData.rentalTax}
                          onChange={handleInputChange}
                        />
                        <label>Rental Tax (11.5%)</label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Charges Summary */}
        <div className="charges-summary details">
          <h2 className="text-xl mb-2">Charges Summary</h2>
          <div className="charge-summary">
            <table>
              <thead>
                <tr>
                  <th>Charge</th>
                  <th>Unit</th>
                  <th>Rate</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody className="body-border">
                <tr>
                  <td>Daily</td>
                  <td>{dailyCharge}</td>
                  <td>${totalCharges.daily.toFixed(2)}</td>
                  <td>${(totalCharges.daily * dailyCharge).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Weekly</td>
                  <td>{weeklyCharge}</td>
                  <td>${totalCharges.weekly.toFixed(2)}</td>
                  <td>${(totalCharges.weekly * weeklyCharge).toFixed(2)}</td>
                </tr>
                {formData.collisionDamageWaiver && (
                  <tr>
                    <td>Collision Damage Waiver</td>
                    <td>1</td>
                    <td>${totalCharges.collisionDamageWaiver.toFixed(2)}</td>
                    <td>${totalCharges.collisionDamageWaiver.toFixed(2)}</td>
                  </tr>
                )}
                {formData.liabilityInsurance && (
                  <tr>
                    <td>Liability Insurance</td>
                    <td>1</td>
                    <td>${totalCharges.liabilityInsurance.toFixed(2)}</td>
                    <td>${totalCharges.liabilityInsurance.toFixed(2)}</td>
                  </tr>
                )}
                {formData.rentalTax && (
                  <tr>
                    <td>Rental Tax</td>
                    <td>1</td>
                    <td>11.5%</td>
                    <td>
                      $
                      {(
                        (totalCharges.total - totalCharges.rentalTax) *
                        0.115
                      ).toFixed(2)}
                    </td>
                  </tr>
                )}
                <tr className="total">
                  <td>Total</td>
                  <td></td>
                  <td></td>
                  <td className="total-value">
                    ${totalCharges.total.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Printable Invoice */}
      <div style={{ display: "none" }}>
        <PrintableInvoice
          ref={componentRef}
          formData={formData}
          totalCharges={totalCharges}
          dailyCharge={dailyCharge}
          weeklyCharge={weeklyCharge}
        />
      </div>
    </div>
  );
}

export default App;
