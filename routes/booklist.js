const express = require("express");
const router = express.Router();
const Booking = require("../models/booking");

// Route to fetch and display booking list
router.get("/booklist", async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings from DB
        res.render("booklist", { bookings, title: "Book List" }); // Pass data to EJS
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
