const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter your name"],
            trim: true,
            maxLength: 50,
        },
        email: {
            type: String,
            required: [true, "Please enter your email"],
            unique: true,
            validate: [validator.isEmail, "Please enter a valid email"],
        },
        defaultAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        password: {
            type: String,
            required: [true, "Please enter your password"],
            select: false,
        },
        phoneNumber: {
            type: String,
            validate: {
                validator: function(phoneNumber) {
                    return phoneNumber.length == 10
                },
                message: "Phone number must be 10 digits"
            }
        },
        amazonPoints: {
            type: Number,
            default: 0,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
