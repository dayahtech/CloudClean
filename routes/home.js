const express = require("express");
const router = express.Router();
const Service = require("../models/service");

router.get("/", async (req, res) => {
    try {
        const services = await Service.find({}, "name image");
        res.render("home", {  services, title: "Home" });
    } catch (error) {
        res.status(500).send("Error fetching data");
    }
});

module.exports = router;