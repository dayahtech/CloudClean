const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    comment: { type: String, required: true },
    rating: { type: Number, required: true },
    image: { type: String, default: null },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
