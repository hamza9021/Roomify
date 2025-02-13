import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    placeType: {
        type: String,
        enum: ["Entire Place", "Private Room", "Shared Room"],
        required: true,
    },
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    location: {
      address: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },
    pricePerNight: {
      type: Number,
      required: true,
      min:20
    },
    maxGuests: Number,
    rooms: Number,
    beds: Number,
    bathrooms: Number,
    amenities: [String],
    photos: [{ name: { type: String }, image: { type: String } }],
    unavailableDates: [
      {
        startDate: Date,
        endDate: Date,
      },
    ],
    policies: {
      cancellationPolicy: String,
      checkInTime: String,
      checkOutTime: String,
    },
    rating: {
      averageRating: Number,
      totalReviews: Number,
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
    isVerified: Boolean,
    tags: [String],
  },
  { timestamps: true }
);

export const Listing = mongoose.model("Listing", listingSchema);

