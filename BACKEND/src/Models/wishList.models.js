import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
  },
  { timestamps: true }
);

export const WishList = mongoose.model("WishList", wishListSchema);
