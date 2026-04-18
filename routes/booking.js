const express = require("express");
const router = express.Router();
require("dotenv").config();
const Booking = require("../models/booking"); 
const User = require("../models/user");  

// Route to send PayPal Client ID securely
router.get("/paypal-config", (req, res) => {
    res.json({ clientId: process.env.PAYPAL_CLIENT_ID });
});

// Handle booking submission
router.post("/submit-booking", async (req, res) => {

    // Generate unique Booking ID
    const generateBookingID = () => "BKG" + Date.now().toString().slice(-6);

    try {
        const { serviceDate, timeSlot, service, price, paymentStatus } = req.body;
        if (!serviceDate || !timeSlot || !service || !price || !paymentStatus) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const selectedDate = new Date(`${serviceDate}T00:00:00`);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (Number.isNaN(selectedDate.getTime()) || selectedDate < today) {
            return res.status(400).json({ success: false, message: "Please select today or a future booking date" });
        }

        const name = res.locals.user.name; // Access name from res.locals.user
        const userId = res.locals.user.userId;

        // Find the user in the database by name
        const user = await User.findOne({ name });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const transportationFee = user.getTransportationFee();

        const newBooking = new Booking({
            userId,
            name: user.name,
            bookingID: generateBookingID(),
            serviceDate,
            timeSlot,
            service,
            price,
            paymentStatus,
            transportationFee
        });

        await newBooking.save();
        res.json({ success: true, message: "Booking saved!", booking: newBooking });
    } catch (error) {
        console.error("Booking error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/bookings", async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings from DB
        res.render("booklist", { bookings }); // Pass data to EJS
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;

