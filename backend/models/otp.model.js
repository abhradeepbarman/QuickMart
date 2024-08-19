const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
        },
        otp: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            expires: 3600,
        }
    },
    {
        timestamps: true,
    }
);

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
