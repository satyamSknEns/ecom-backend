const mongoose = require("mongoose");
const { Schema } = mongoose;

const ratingReviews = new Schema({
  productId: { type: String, required: true },
  email: { type: String, required: true },
  reviewText: { type: String },
  rating: {
    type: Number,
    min: [1, "min rating must be 1"],
    max: [5, "max rating must be 5"],
  },
});

exports.Rating = mongoose.model("ratingReviews", ratingReviews);
