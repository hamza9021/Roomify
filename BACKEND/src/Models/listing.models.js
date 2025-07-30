import mongoose from "mongoose";
import { Review } from "./review.models.js";
import { WishList } from "./wishList.models.js";
import { Booking } from "./booking.models.js";
import { User } from "./user.models.js";
const listingSchema = new mongoose.Schema(
    {
        title: {
            type: String,
        },
        description: {
            type: String,
        },
        placeType: {
            type: String,
            enum: ["Entire Place", "Private Room", "Shared Room"],
        },
        host: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        location: {
            address: String,
            city: String,
            state: String,
            country: String,
            zipCode: String,
            coordinates: {
                latitude: { type: Number },
                longitude: { type: Number },
            },
        },
        pricePerNight: {
            type: Number,
            min: 20,
        },
        maxGuests: Number,
        rooms: Number,
        beds: Number,
        bathrooms: Number,
        amenities: [String],
        photos: {
            type: [String],
            max: 8,
        },
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
        category: {
            type: String,
            enum: [
                "Apartment",
                "House",
                "Hotel",
                "Hostel",
                "Resort",
                "Villa",
                "A-frame",
                "Adapted",
                "Amazing pools",
                "Amazing views",
                "Arctic",
                "Barn",
                "Beach",
                "Beachfront",
                "Bed & breakfast",
                "Boat",
                "Cabin",
                "Camper",
                "Camping",
                "Casas particulares",
                "Castle",
                "Cave",
                "Chef's kitchen",
                "Container",
                "Countryside",
                "Creative space",
                "Cycladic home",
                "Dammuso",
                "Desert",
                "Design",
                "Dome",
                "Earth home",
                "Farm",
                "Fun for kids",
                "Golfing",
                "Grand piano",
                "Hanok",
                "Historical home",
                "Houseboat",
                "Iconic city",
                "Icon",
                "Island",
                "Kezhan",
                "Lake",
                "Lakefront",
                "Luxe",
                "Mansion",
                "Minsu",
                "National park",
                "Off-the-grid",
                "OMG!",
                "Riad",
                "Ryokan",
                "Shared home",
                "Shepherd's hut",
                "Ski-in/out",
                "Skiing",
                "Surfing",
                "Tiny home",
                "Tower",
                "Treehouse",
                "Tropical",
                "Trullo",
                "Vineyard",
                "Windmill",
                "Yurt",
            ],
        },
    },
    { timestamps: true }
);

listingSchema.post("findOneAndDelete", async function (data) {
    if (data) {
        await Review.deleteMany({ _id: { $in: data.reviews } });
        await Booking.deleteMany({ _id: { $in: data.bookings } });
        await WishList.updateMany({}, { $pull: { listings: data._id } });
    }
});

export const Listing = mongoose.model("Listing", listingSchema);
