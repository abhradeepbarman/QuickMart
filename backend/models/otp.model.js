const mongoose = require("mongoose");
const validator = require("validator");

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
    },
    { timestamps: true }
);

const Otp = mongoose.model("Otp", otpSchema);
module.exports = Otp;
