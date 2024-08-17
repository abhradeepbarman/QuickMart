const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "An address must belong to an user"],
        },
        country: {
            type: String,
            default: "India",
        },
        postCode: {
            type: String,
            required: [true, 'An address must have a postCode'],
        },
        city: {
            type: String,
            required: [true, 'An address must have a city'],
        },
    },
    { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
