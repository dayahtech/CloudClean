require('dotenv').config();
const mongoose = require("mongoose");
const Service = require("../models/service");

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const services = [
  {
      name: "Basic Cleaning Package 🧼 (For Regular Maintenance)",
      description: "Best for small homes, apartments, or light cleaning.",
      features: [
          "Dusting & wiping surfaces",
          "Vacuuming & mopping floors",
          "Bathroom cleaning (sink, toilet, mirror)",
          "Kitchen counter wipe-down",
          "Trash removal"
      ],
      price: "Starts at RM100 per session",
      image: "/images/basic-cleaning.jpg",
      timeSlots: [
          { time: "09:00 AM - 11:00 AM", duration: "2 Hours", cleaners: 1, price: "RM 100.00" },
          { time: "11:30 AM - 01:30 PM", duration: "2 Hours", cleaners: 1, price: "RM 100.00" },
          { time: "02:00 PM - 04:00 PM", duration: "2 Hours", cleaners: 1, price: "RM 100.00" },
          { time: "04:30 PM - 06:30 PM", duration: "2 Hours", cleaners: 1, price: "RM 100.00" },
          { time: "09:00 AM - 01:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 180.00" },
          { time: "02:00 PM - 06:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 180.00" }
      ]
  },
  {
      name: "Deep Cleaning Package 🏡 (For Thorough Cleaning)",
      description: "Recommended for homes that need a detailed, one-time clean.",
      features: [
          "Full house dusting",
          "Floor scrubbing",
          "Bathroom deep cleaning",
          "Interior window cleaning",
          "Cleaning under furniture & hard-to-reach areas",
          "Ceiling fan & light fixture dusting",
          "Disinfecting high-touch surfaces"
      ],
      price: "Starts at RM250 per session",
      image: "/images/deep-cleaning.jpg",
      timeSlots: [
          { time: "09:00 AM - 01:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 250.00" },
          { time: "02:00 PM - 06:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 250.00" },
          { time: "09:00 AM - 03:00 PM", duration: "6 Hours", cleaners: 2, price: "RM 350.00" },
          { time: "09:00 AM - 05:00 PM", duration: "8 Hours", cleaners: 3, price: "RM 480.00" }
      ]
  },
  {
      name: "Move-In/Move-Out Cleaning 🚪 (For New Tenants & Homeowners)",
      description: "Best for preparing a house/apartment for new occupants.",
      features: [
          "Inside cabinet & drawer cleaning",
          "Inside oven & refrigerator cleaning",
          "Wall spot cleaning",
          "Carpet shampooing (if needed)",
          "Deodorizing & sanitization"
      ],
      price: "Starts at RM450 per session",
      image: "/images/move-in-move-out.jpg",
      timeSlots: [
          { time: "09:00 AM - 03:00 PM", duration: "6 Hours", cleaners: 3, price: "RM 450.00" },
          { time: "09:00 AM - 05:00 PM", duration: "8 Hours", cleaners: 3, price: "RM 600.00" },
          { time: "10:00 AM - 06:00 PM", duration: "8 Hours", cleaners: 4, price: "RM 750.00" }
      ]
  },
  {
      name: "Office/Commercial Cleaning 🏢 (For Workspaces & Businesses)",
      description: "Best for offices, retail shops, and commercial spaces.",
      features: [
          "Dusting & wiping all desks, chairs, and surfaces",
          "Vacuuming & mopping office floors",
          "Trash collection & disposal",
          "Sanitizing high-touch points (elevators, doorknobs, etc.)",
          "Restroom deep cleaning & restocking supplies"
      ],
      price: "Starts at RM300 per session",
      image: "/images/office-commercial.jpg",
      timeSlots: [
          { time: "08:00 AM - 12:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 300.00" },
          { time: "01:00 PM - 05:00 PM", duration: "4 Hours", cleaners: 2, price: "RM 300.00" },
          { time: "09:00 AM - 03:00 PM", duration: "6 Hours", cleaners: 3, price: "RM 450.00" },
          { time: "09:00 AM - 05:00 PM", duration: "8 Hours", cleaners: 4, price: "RM 600.00" }
      ]
  },
  {
      name: "Eco-Friendly Cleaning Package 🍃 (For Health & Sustainability)",
      description: "Best for customers who prefer non-toxic, green cleaning.",
      features: [
          "Use of organic & eco-friendly cleaning products",
          "Air purification & essential oil scenting",
          "HEPA-filter vacuuming to reduce allergens"
      ],
      price: "Starts at RM180 per session",
      image: "/images/eco-friendly.jpg",
      timeSlots: [
          { time: "09:00 AM - 12:00 PM", duration: "3 Hours", cleaners: 1, price: "RM 180.00" },
          { time: "02:00 PM - 05:00 PM", duration: "3 Hours", cleaners: 1, price: "RM 180.00" },
          { time: "09:00 AM - 02:00 PM", duration: "5 Hours", cleaners: 2, price: "RM 280.00" }
      ]
  }
];

Service.insertMany(services)
  .then(() => {
      console.log("Services added!");
      mongoose.connection.close();
  })
  .catch((err) => console.log(err));



