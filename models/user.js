const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    area: { type: String, required: true },
    house: { type: String, required: false },
    postcode: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    houseType: { type: String, required: false },
    propertySize: { type: String, required: false },
    resetToken: String,
    resetTokenExpire: Date
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

UserSchema.methods.getTransportationFee = function() {
    const fees = {
        "Sabak Bernam": 50.00,
        "Kuala Selangor": 40.00,
        "Hulu Selangor": 35.00,
        "Gombak": 20.00,
        "Petaling": 0,
        "Klang": 25.00,
        "Kuala Langat": 30.00,
        "Hulu Langat": 15.00,
        "Sepang": 35.00
    };

    const fee = fees[this.area] || 0; // Default to 0 if area isn't found
    return fee.toFixed(2);
};

module.exports = mongoose.model('User', UserSchema);

