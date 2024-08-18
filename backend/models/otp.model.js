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
        // TODO: OTP delete after 5 minutes
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 300,
        }
    },
    {
        timestamps: true,
    }
);

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
