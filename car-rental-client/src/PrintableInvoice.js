import React from "react";
import "./invoice.css";
import batman from "./batman.webp";
const PrintableInvoice = React.forwardRef((props, ref) => {
  const { formData, totalCharges, dailyCharge, weeklyCharge } = props;

  return (
    <div ref={ref} className="invoice">
      <div className="company-header">
        <div className="company">
          <img src={batman} alt="" height={"150px"} width={"200px"} />
          <h1>Batman Car Rental</h1>
          <p>224 Park Drive</p>
          <p>Gotham City, USA 12345</p>
        </div>
        <div className="invoice-details">
          <h2>Reservation Details</h2>
          <p>Reservation ID: {formData.reservationId}</p>
          <p>Pickup Date: {formData.pickupDate}</p>
          <p>Return Date: {formData.returnDate}</p>
          <p>Duration: {formData.duration}</p>
          <p>Discount: {formData.discount}</p>
        </div>
      </div>
      <div className="details">
        <div className="information">
          <div className="info-1">
            <h2>Vehicle Information</h2>
            <p>Vehicle Type: {formData.vehicleType}</p>
            <p>Vehicle: {formData.vehicle}</p>
          </div>

          <div className="info-2">
            <h2>Customer Information</h2>
            <p>First Name: {formData.firstName}</p>
            <p>Last Name: {formData.lastName}</p>
            <p>Email: {formData.email}</p>
            <p>Phone: {formData.phone}</p>
          </div>
        </div>

        <h2>Charges Summary</h2>
        <table className="charge-summary-table">
          <thead>
            <tr>
              <th>Charge</th>
              <th>Unit</th>
              <th>Rate</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
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
            <tr className="total-tr">
              <td>Total</td>
              <td></td>
              <td></td>
              <td>${totalCharges.total.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
});

export default PrintableInvoice;
