const expressLayouts = require('express-ejs-layouts');  
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000; 
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');
const authMiddleware = require('./middleware/auth');
const serviceRoutes = require("./routes/service");
const checkoutRoutes = require("./routes/checkout");
const addonRoutes = require("./routes/addon");
const bookingRoutes = require("./routes/booking");
const booklistRoutes = require("./routes/booklist");
const reviewRoutes = require("./routes/review");
const path = require('path');
const homeRoutes = require("./routes/home");

// Middleware
app.use(express.json()); // For JSON data
app.use(express.urlencoded({ extended: true })); // For form data
app.use(cookieParser());
app.use(express.static("public")); // Static files
app.set("view engine", "ejs"); // Render dynamic HTML templates 
app.use(expressLayouts); // For layout
app.set('layout', 'layout'); // layout.ejs
app.use(authMiddleware);
app.use("/", authRoutes);
app.use('/auth', authRoutes);
app.use("/services", serviceRoutes);
app.use("/checkout", checkoutRoutes);
app.use("/", addonRoutes);
app.use("/booking", bookingRoutes);
app.use("/", booklistRoutes);
app.use("/reviews", reviewRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/', homeRoutes);

// Connect database
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

// Routes
app.get("/", (req, res) => res.render('home', { title: 'Home' }));
app.get("/login", (req, res) =>  res.render("login", { title: "Login", errorMessage: "" }));
app.get("/signup", (req, res) => res.render("signup", { title: "Signup", errorMessage: "" }));
app.get("/forgot-password", (req, res) => res.render('forgot-password', { title: 'Forgot Password', errorMessage: ""}));
app.get("/reset-password", (req, res) => res.render('reset-password', { title: 'Reset Password', errorMessage: "" }));
app.get("/about", (req, res) => res.render('about', { title: 'About'}));
app.get("/booklist", (req, res) => res.render('about', { title: 'Book List'}));

app.listen(PORT, "0.0.0.0",() => {
    console.log(`Server running at http://localhost:${PORT}`);
});
