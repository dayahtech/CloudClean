const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
    name: String,
    description: String,
    features: [String],
    price: String,
    timeSlots: [
        {
            duration: String,
            cleaners: Number,
            price: String,
            time: String
        }
    ],
    image: String // Add an image field for each package
});

const Service = mongoose.model("Service", serviceSchema);

module.exports = Service;


