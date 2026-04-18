const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();
const auth = require("../middleware/auth");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// Password Strength Validation Function
function isStrongPassword(password) {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
}

// Signup Route
router.post("/signup", async (req, res) => {
    try {
        let { name, email, password, confirmPassword, phone, area } = req.body;

        password = String(password).trim();
        confirmPassword = String(confirmPassword).trim();

        // Check if area is selected
        if (!area) {
            return res.render("signup", { title: "Sign Up", errorMessage: "Please select an area." });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.render("signup", { title: "Sign Up", errorMessage: "Passwords do not match!" });
        }

        // Check if the password is strong
        if (!isStrongPassword(password)) {
            return res.render("signup", { title: "Sign Up", errorMessage: "Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character." });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.render("signup", { title: "Sign Up", errorMessage: "User already exists!" });
        }

        // Save the user (password will be hashed by Mongoose)
        const newUser = new User({ name, email, password, phone, area });
        await newUser.save();

        res.redirect("/login"); // Redirect to login after successful signup
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error!");
    }
});

// LOGIN Route
router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.render("login", { title: "Login", errorMessage: "Invalid credentials!" });
        }

        // Compare password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render("login", { title: "Login", errorMessage: "Incorrect password!" });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Store token in a cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.redirect("/");
    } catch (error) {
        res.status(500).send("Server error!");
    }
});

// LOGOUT Route
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// UPDATE PROFILE
router.post("/update-profile", auth, async (req, res) => {
    try {
        const userId = req.user.userId;
        const updatedData = req.body;

        // Ensure phone number has "+60" prefix
        if (updatedData.phone && !updatedData.phone.startsWith("+60")) {
            updatedData.phone = "+60 " + updatedData.phone;
        }

        // Update house type and property size if provided
        if (updatedData.houseType) {
            updatedData.houseType = updatedData.houseType.trim();
        }
        if (updatedData.propertySize) {
            updatedData.propertySize = updatedData.propertySize.trim();
        }

        const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

        if (!updatedUser) {
            return res.status(404).send("User not found!");
        }

        res.json({ success: true, message: "Profile updated successfully!", updatedUser });
    } catch (error) {
        console.error("Update Error:", error);
        res.status(500).send("Server error!");
    }
});

// FETCH USER PROFILE (For displaying in profile.ejs)
router.get("/profile", async (req, res) => {
    try {
        if (!req.cookies.token) {
            return res.redirect("/login");
        }

        const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.redirect("/login");
        }

        res.render("profile", { title: "Profile", user });
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.clearCookie("token");
        res.redirect("/login");
    }
});

// FORGOT PASSWORD - Generate Reset Token
router.post("/forgot-password", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.render("forgot-password", { title: "Forgot Password", errorMessage: "Email not found. Please enter a registered email." });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetToken = resetToken;
        user.resetTokenExpire = Date.now() + 3600000; // 1 hour validity
        await user.save();

        // Email configuration
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const resetLink = `${req.protocol}://${req.headers.host}/reset-password/${resetToken}`;
        const mailOptions = {
            to: user.email,
            subject: "Password Reset",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        };

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err);
                return res.send("Error sending email.");
            }
            res.send("Reset link sent to your email. You can close this page now.");
        });

    } catch (error) {
        console.error(error);
        res.status(500).send("Server error!");
    }
});

// RESET PASSWORD - Show Reset Form
router.get("/reset-password/:token", async (req, res) => {
    try {
        const user = await User.findOne({
            resetToken: req.params.token,
            resetTokenExpire: { $gt: Date.now() } // Ensure token is still valid
        });

        if (!user) {
            return res.render("reset-password", { title: "Reset Password", errorMessage: "Invalid or expired token." });
        }

        res.render("reset-password", { title: "Reset Password", token: req.params.token, errorMessage: "" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error!");
    }
});

router.post("/reset-password/:token", async (req, res) => {
    try {
        let { password, confirmPassword } = req.body;
        const token = req.params.token;

        password = String(password).trim();
        confirmPassword = String(confirmPassword).trim();

        if (password !== confirmPassword) {
            return res.render("reset-password", { title: "Reset Password", token, errorMessage: "Passwords do not match!" });
        }

        if (!isStrongPassword(password)) {
            return res.render("reset-password", { title: "Reset Password", token, errorMessage: "Password must meet strength requirements!" });
        }

        const user = await User.findOne({ resetToken: token, resetTokenExpire: { $gt: Date.now() } });

        if (!user) {
            return res.render("reset-password", { title: "Reset Password", errorMessage: "Invalid or expired token." });
        }

        const samePassword = await bcrypt.compare(password, user.password);

        if (samePassword) {
            return res.render("reset-password", { title: "Reset Password", errorMessage: "The new password cannot be the same as old password." });
        }

        // Password will be hashed automatically by Mongoose before saving
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpire = undefined;
        await user.save();

        res.send(`
        <script>
            alert("Password reset successful! Redirecting to home...");
            setTimeout(() => {
                window.location.href = "/";
            }, 3000);
        </script>
    `);
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error!");
    }
});

module.exports = router;

