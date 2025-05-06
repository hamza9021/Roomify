import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the user who wrote the review
    listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" }, // Reference to the listing
    rating: { type: Number, min: 1, max: 5 }, // 1 to 5
    comment: { type: String },
  },
  { timestamps: true }
);



export const Review = mongoose.model("Review", reviewSchema);
