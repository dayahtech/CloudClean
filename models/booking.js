const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    bookingID: { type: String, required: true, unique: true }, // Unique Booking ID
    serviceDate: { type: String, required: true }, // Date of service
    timeSlot: { type: String, required: true }, // Time selected
    service: { type: String, required: true }, // Service name
    price: { type: Number, required: true }, // Total amount
    paymentStatus: { type: String, enum: ["Success", "Failed"], required: true } // Payment status
});

module.exports = mongoose.model("Booking", bookingSchema);
