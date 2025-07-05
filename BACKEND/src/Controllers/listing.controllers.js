import { Listing } from "../Models/listing.models.js";
import { ApiError } from "../Utils/ApiError.js";
import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";

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
        unavailableDates,
        tags,
        catogeroy,
    } = req.body;

    const photos = req.files?.photos || [];
    if (photos.length === 0) {
        throw new ApiError(400, "At least one photo is required");
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "image/avif",
        "image/webp",
    ];

    const maxSize = 5 * 1024 * 1024;

    for (const photo of photos) {
        if (!allowedTypes.includes(photo.mimetype)) {
            throw new ApiError(
                400,
                `Invalid file type: ${photo.originalname}. Only JPEG, PNG, GIF, and PDF are allowed.`
            );
        }
        if (photo.size > maxSize) {
            throw new ApiError(
                400,
                `File too large: ${photo.originalname}. Maximum size is 5MB.`
            );
        }
    }

    const photoUrls = [];

    try {
        for (const photo of photos) {
            const { secure_url } = await uploadOnCloudinary(photo.path);
            if (!secure_url) {
                throw new ApiError(500, "Failed to upload attachment");
            }
            photoUrls.push(secure_url);
        }
    } catch (error) {
        throw new ApiError(
            500,
            "Error uploading attachments: " + error.message
        );
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
        unavailableDates,
        tags,
        catogeroy,
        photos: photoUrls,
    });

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

const updateListing = wrapperFunction(async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!id) {
        throw new ApiError(400, "Listing ID is required");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    if (listing.host.toString() !== user._id.toString()) {
        throw new ApiError(403, "You can only update your own listings");
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
        amenities = [],
        unavailableDates = [],
        policies,
        tags,
        category,
        existingPhotos = [], // Add this to handle existing photos
    } = req.body;

    // Validate required fields
    if (!title || !description || !placeType || !location || !pricePerNight) {
        throw new ApiError(400, "Missing required fields");
    }

    // Handle photo updates
    let photoUrls = Array.isArray(existingPhotos)
        ? [...existingPhotos]
        : [existingPhotos];
    const newPhotos = req.files?.photos || [];

    // Validate at least one photo exists
    if (photoUrls.length === 0 && newPhotos.length === 0) {
        throw new ApiError(400, "At least one photo is required");
    }

    if (newPhotos.length > 0) {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const maxSize = 5 * 1024 * 1024; // 5MB

        for (const photo of newPhotos) {
            if (!allowedTypes.includes(photo.mimetype)) {
                throw new ApiError(
                    400,
                    `Invalid file type: ${photo.originalname}. Only JPEG, PNG, and WEBP are allowed.`
                );
            }
            if (photo.size > maxSize) {
                throw new ApiError(
                    400,
                    `File too large: ${photo.originalname}. Maximum size is 5MB.`
                );
            }
        }

        try {
            // Upload new photos
            const newPhotoUrls = await Promise.all(
                newPhotos.map(async (photo) => {
                    const { secure_url } = await uploadOnCloudinary(photo.path);
                    if (!secure_url) {
                        throw new Error("Failed to upload photo");
                    }
                    return secure_url;
                })
            );

            // Combine new photos with existing ones
            photoUrls = [...photoUrls, ...newPhotoUrls];
        } catch (error) {
            throw new ApiError(500, "Error uploading photos: " + error.message);
        }
    }

    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            title,
            description,
            placeType,
            location,
            pricePerNight: parseFloat(pricePerNight),
            maxGuests: parseInt(maxGuests),
            rooms: parseInt(rooms),
            beds: parseInt(beds),
            bathrooms: parseFloat(bathrooms),
            amenities: Array.isArray(amenities)
                ? amenities
                : [amenities].filter(Boolean),
            photos: photoUrls,
            unavailableDates: Array.isArray(unavailableDates)
                ? unavailableDates
                : [unavailableDates].filter(Boolean),
            policies,
            tags: tags ? tags.split(",").map((tag) => tag.trim()) : [],
            category,
        },
        { new: true, runValidators: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(200, updatedListing, "Listing updated successfully")
        );
});

const getAllListings = wrapperFunction(async (req, res) => {
    const listings = await Listing.find();
    // const updatedListing = [];

    if (!listings) {
        throw new ApiError(404, "No listings found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Listings found"));
});

const getListing = wrapperFunction(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "URL parameter missing");
    }

    const listing = await Listing.findById(id)
        .populate("host", "name email profileImage phoneNumber bio")
        .populate({
            path: "reviews",
            populate: {
                path: "user",
                select: "name profileImage",
            },
        });
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }
    return res.status(200).json(new ApiResponse(200, listing, "Listing found"));
});

const getAllHostListings = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const listings = await Listing.find({ host: user._id });
    if (!listings) {
        throw new ApiError(404, "No listings found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Listings found"));
});

export {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getAllListings,
    getAllHostListings,
};
