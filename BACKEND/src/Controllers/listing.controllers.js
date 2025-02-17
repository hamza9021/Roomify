import { Listing } from "../Models/listing.models.js";
import { ApiError } from "../Utils/ApiError.js";
import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

const createListing = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const {
        title,
        description,
        placeType,
        location,
        pricePerNight,
        maxGuests,
        rooms,
        beds,
        bathrooms,
        amenities,
        photos,
        unavailableDates,
        policies,
        tags,
        catogery,
    } = req.body;
    if (
        !title ||
        !description ||
        !placeType ||
        !pricePerNight ||
        !maxGuests ||
        !rooms ||
        !beds ||
        !bathrooms ||
        !amenities ||
        !catogery
    ) {
        throw new ApiError(400, "Missing required fields");
    }
    const listing = await Listing.create({
        title,
        description,
        placeType,
        host: user._id,
        location,
        pricePerNight,
        maxGuests,
        rooms,
        beds,
        bathrooms,
        amenities,
        photos,
        unavailableDates,
        policies,
        tags,
        catogery,
    });
    console.log(listing);

    if (!listing) {
        throw new ApiError(500, "Listing not created");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, listing, "Listing created successfully"));
});

const deleteListing = wrapperFunction(async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!id) {
        throw new ApiError(400, "Missing required fields");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    if (listing.host.toString() !== user._id.toString()) {
        throw new ApiError(401, "Unauthorized");
    }

    await Listing.findOneAndDelete({ _id: id });
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Listing deleted successfully"));
});

export { createListing, deleteListing };
