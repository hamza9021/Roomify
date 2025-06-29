import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { wrapperFunction } from "../Utils/asyncWrap.js";
import { Booking } from "../Models/booking.models.js";
import { Listing } from "../Models/listing.models.js";
import { User } from "../Models/user.models.js";

const createBooking = wrapperFunction(async (req, res) => {
    const { listingID } = req.params;
    const { checkInDate, checkOutDate, Guests, totalPrice } = req.body;

    console.log("Request body:", req.body);

    if (!listingID) {
        throw new ApiError(400, "Listing ID is required");
    }

    const listing = await Listing.findById(listingID);
    if (!listing) {
        throw new ApiError(404, "Listing does not exist");
    }

    const user = req.user;
    if (!user) {
        throw new ApiError(400, "Must login to book a listing");
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
        throw new ApiError(400, "Invalid date format");
    }

    const totalNumberOfDays = (checkOut - checkIn) / (1000 * 60 * 60 * 24);

    if (totalNumberOfDays <= 0) {
        throw new ApiError(400, "Check-out date must be after check-in date");
    }

    console.log("Total number of days:", totalNumberOfDays);

    const booking = {
        user: req.user._id,
        listing: listing._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        Guests: Guests,
        totalPrice: totalPrice,
    };

    const createdBooking = await Booking.create(booking);

    await Listing.findByIdAndUpdate(
        listingID,
        {
            $push: {
                bookings: createdBooking._id,
            },
        },
        { new: true , validateBeforeSave: false }
    );


    await User.findByIdAndUpdate(
        user._id,
        {
            $push: {
                bookings: createdBooking._id,
            },
        },
        { new: true , validateBeforeSave: false }
    );



    if (!createdBooking) {
        throw new ApiError(500, "Network Issue, While creating the booking. please try again later");
    }
    
    return res
        .status(200)
        .json(
            new ApiResponse(200, createdBooking, "Booking created successfully")
        );
});

export { createBooking };
