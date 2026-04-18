const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Service = require("../models/service");
const verifyToken = require("../middleware/auth"); // Import JWT middleware

// Checkout Page (Protected)
router.get("/", verifyToken, async (req, res) => {
    try {

        if (!req.user || !req.user.userId) {
            return res.redirect("/login");
        }

        const user = await User.findById(req.user.userId);
        const services = await Service.find();

        if (!user) {
            return res.redirect("/login");
        }

        const transportationFee = user.getTransportationFee();

        // Fix: Define `formattedAddress`
        let formattedAddress = "";
        if (user.house && user.address && user.city && user.postcode && user.area) {
            formattedAddress = `${user.house}, ${user.address}, ${user.city}, ${user.postcode} ${user.area}`;
        }

        // Get selected service from query params
        const selectedService = req.query.service
            ? await Service.findOne({ name: req.query.service })
            : null;

        // Pass `formattedAddress` to `checkout.ejs`
        res.render("checkout", { user, formattedAddress, services, selectedService, transportationFee, title: "Checkout" });
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;




