const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const Review = require("../models/review");
const Booking = require("../models/booking");
const auth = require("../middleware/auth");
const upload = require('../middleware/upload');

// Fetch reviews for a specific service
router.get("/:serviceName", auth, async (req, res) => {
    try {
        const decodedServiceName = decodeURIComponent(req.params.serviceName);

        const user = res.locals.user; // Ensure user is passed

        let hasBooked = false;
        let hasReviewed = false;

        if (user) {
            hasBooked = await Booking.exists({ userId: user.userId, service: decodedServiceName, paymentStatus: "Success" });
            hasReviewed = await Review.exists({ userId: user.userId, serviceName: decodedServiceName });
        }

        const reviews = await Review.find({ serviceName: decodedServiceName }).sort({ timestamp: -1 });

        // Fetch all services
        const services = await Service.find();

        // Fetch all reviews and group them by service
        const allReviews = await Review.find();
        const reviewsByService = {};
        allReviews.forEach((review) => {
            if (!reviewsByService[review.serviceName]) {
                reviewsByService[review.serviceName] = [];
            }
            reviewsByService[review.serviceName].push(review);
        });

        // Ensure `services` and `reviewsByService` are passed to EJS
        res.render("services", { 
            title: "Services", 
            services,  
            reviews, 
            hasBooked, 
            hasReviewed,
            user: user || null,
            reviewsByService // Pass reviewsByService
        });

    } catch (error) {
        console.error("Error in fetching service data:", error);
        res.status(500).json({ message: "Error fetching reviews" });
    }
});

// Submit a review for a specific service (with image upload handling)
router.post("/*", auth, upload.single('reviewImage'), async (req, res) => { // Handle a single file upload
    try {

        const { comment, rating } = req.body;
        const image = req.file ? req.file.path : null; 

        if (!rating) {
            return res.render("services", { title: "Services", errorMessage: "Rating is required!" });
        }

        const serviceName = decodeURIComponent(req.params[0]); // Decode before querying

        const user = res.locals.user;

        console.log("Submitting review for:", serviceName);
        console.log("User:", user.name);

        // Check if user has booked this service
        const hasBooked = await Booking.findOne({ userId: user.userId, service: serviceName, paymentStatus: "Success" });
        if (!hasBooked) {
            console.log("❌ User hasn't booked this service.");
            return res.status(400).json({ message: "You must book this service before reviewing" });
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({ serviceName, userId: user.userId });
        if (existingReview) {
            console.log("❌ User has already reviewed this service.");
            return res.status(400).json({ message: "You have already reviewed this service" });
        }


        // Save the new review
        const newReview = new Review({
            serviceName,
            userId: user.userId,
            name: user.name,
            comment,
            rating,
            image
        });

        await newReview.save();
        console.log("Review saved successfully!");
        res.status(201).json({ message: "Review added successfully" });

    } catch (error) {
        console.error("Error submitting review:", error);
        res.status(500).json({ message: "Error submitting review", error: error.message });
    }
});

module.exports = router;
