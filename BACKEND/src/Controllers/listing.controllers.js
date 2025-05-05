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
        policies,
        tags,
        catogeroy,
    } = req.body;
    // if (
    //     !title ||
    //     !description ||
    //     !placeType ||
    //     !pricePerNight ||
    //     !maxGuests ||
    //     !rooms ||
    //     !beds ||
    //     !bathrooms ||
    //     !amenities ||
    //     !catogeroy
    // ) {
    //     throw new ApiError(400, "Missing required fields");
    // }


    console.log(req.body);
    const photos = [];
    console.log(req.files);


    if (!req.files || !req.files.photos || req.files.photos.length === 0) {
        throw new ApiError(400, "At least one image is required");
    }
    for (const file of req.files.photos) {
        const localPath = file.path;

    
        if (!localPath) {
            throw new ApiError(400, "Image path not found");
        }
    
    
        const uploadedImage = await uploadOnCloudinary(localPath);
    
        if (!uploadedImage || !uploadedImage.secure_url) {
            throw new ApiError(400, "Image upload failed");
        }
    
    
        photos.push(uploadedImage.url);
    }
    
    

    console.log("Uploaded Photos:", photos);
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
        tags,
        catogeroy,
    });
    // const listing = await Listing.create({
    //     photos,
    // });
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

const updateListing = wrapperFunction(async (req, res) => {
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

    await Listing.findOneAndUpdate(
        { _id: id },
        {
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
        },
        { new: true }
    );
    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Listing updated successfully"));
});

// const getListing = wrapperFunction(async (req, res) => {
//     const { id } = req.params;

//     if (!id) {
//         throw new ApiError(400, "URL parameter missing");
//     }
//     const listing = await Listing.findById(id);
//     if (!listing) {
//         throw new ApiError(404, "Listing not found");
//     }
//     return res.status(200).json(new ApiResponse(200, listing, "Listing found"));
// });

const getAllListings = wrapperFunction(async (req, res) => {
    const listings = await Listing.find();
    console.log(listings);
    // const updatedListing = [];

    if (!listings) {
        throw new ApiError(404, "No listings found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, listings, "Listings found"));
});


const getListing = wrapperFunction(async(req,res)=>{
    const {id} = req.params;

    if(!id){
        throw new ApiError(400,"URL parameter missing");
    }
    
    const listing = await Listing.findById(id).populate("host","name email profileImage phoneNumber bio" );
    if(!listing){
        throw new ApiError(404,"Listing not found");
    }
    return res.status(200).json(new ApiResponse(200,listing,"Listing found"));
})

export {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getAllListings,
};
