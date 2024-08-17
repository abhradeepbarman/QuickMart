const mongoose = require("mongoose");
const { CATEGORIES } = require("../constants");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "A product must have a name"],
            trim: true,
            maxLength: [
                50,
                "A product name must have less or equal than 50 characters",
            ],
        },
        category: {
            type: String,
            required: [true, "A product must have a category"],
            enum: CATEGORIES,
        },
        price: {
            type: Number,
            required: [true, "A product must have a price"],
        },
        stock: {
            type: Number,
            default: 1,
        },
        description: {
            type: String,
            required: [true, "A product must have a description"],
            trim: true,
        },
        image: {
            type: String,
            required: [true, "A product must have an image"],
        },
        ratingAndReviews: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: "RatingReview",
        }]
    },
    { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
