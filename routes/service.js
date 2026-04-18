const express = require("express");
const router = express.Router();
const Service = require("../models/service");
const Booking = require("../models/booking");
const Review = require("../models/review");

router.get("/", async (req, res) => {
    try {
        const user = res.locals.user;
        const services = await Service.find();

        let hasBooked = {};
        let hasReviewed = {};
        let reviewsByService = {}; // Store reviews grouped by service

        if (services.length > 0) {
            const serviceNames = services.map(service => service.name);

            // Fetch all reviews for these services
            const allReviews = await Review.find({ serviceName: { $in: serviceNames } }).sort({ timestamp: -1 });

            // Group reviews by service name
            services.forEach(service => {
                reviewsByService[service.name] = allReviews.filter(review => review.serviceName === service.name);
            });

            if (user) {
                // Fetch bookings & reviews at the same time
                const [bookings, userReviews] = await Promise.all([
                    Booking.find({ userId: user.userId, service: { $in: serviceNames }, paymentStatus: "Success" }),
                    Review.find({ userId: user.userId, serviceName: { $in: serviceNames } })
                ]);

                // Convert results into lookup objects
                const bookedSet = new Set(bookings.map(b => b.service));
                const reviewedSet = new Set(userReviews.map(r => r.serviceName));

                services.forEach(service => {
                    hasBooked[service.name] = bookedSet.has(service.name);
                    hasReviewed[service.name] = hasBooked[service.name] && reviewedSet.has(service.name);
                });
            }
        }

        res.render("services", { 
            title: "Services", 
            services, 
            user: user || null, 
            hasBooked: hasBooked || {}, 
            hasReviewed: hasReviewed || {},
            reviewsByService // Pass all reviews grouped by service
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
});

module.exports = router;
