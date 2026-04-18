const express = require("express");
const router = express.Router();
const Addon = require("../models/addon");

// Get all add-ons from the database
router.get("/addon", async (req, res) => {
    try {
        const addons = await Addon.find();
        res.json(addons);
    } catch (error) {
        res.status(500).json({ message: "Error fetching add-ons", error });
    }
});

module.exports = router;

