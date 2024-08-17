const mongoose = require("mongoose");

const ratingReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
        review: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const RatingReview = mongoose.model("RatingReview", ratingReviewSchema);
module.exports = RatingReview;
