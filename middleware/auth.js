const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        res.locals.user = null; // Allow pages to load without login
        return next(); 
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        res.locals.user = decoded; // Pass user info to EJS
        next();  // Ensures the request continues.
    } catch (error) {
        console.error("JWT verification failed:", { error: error.message, stack: error.stack });

        if (error.name === "TokenExpiredError") {
            // Handle expired token case
            res.clearCookie("token"); // Clear expired token
            return res.redirect("/login"); // Redirect to login page
        }

        res.clearCookie("token"); // Clear invalid token
        res.locals.user = null; // Ensure no login state remains
        return next();  // Continue the request even after clearing the token
    }
};
