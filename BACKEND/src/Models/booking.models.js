import mongoose from "mongoose";
import { User } from "./user.models.js";

const bookingSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        checkInDate: Date,
        checkOutDate: Date,
        totalPrice: Number,
        status: String,
    },
    { timestamps: true }
);

//WHEN DELETE LISTING, DELETE ALL BOOKINGS RELATED TO USERS


export const Booking = mongoose.model("Booking", bookingSchema);
