const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            enum: [
                "Ordered",
                "Shipped",
                "Out for Delivery",
                "Delivered",
                "Cancelled",
            ],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "An order must belong to an user"],
        },
        price: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Address",
            required: [true, "An order must have a shipping address"],
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "OrderItem",
                required: true,
            },
        ],
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
