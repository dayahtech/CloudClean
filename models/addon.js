const mongoose = require('mongoose');

const AddonSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    includes: { type: [String], required: true },
    pricing: [
        {
            size: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],
    image: { type: String, required: true } // Single image URL
});

module.exports = mongoose.model('Addon', AddonSchema);
