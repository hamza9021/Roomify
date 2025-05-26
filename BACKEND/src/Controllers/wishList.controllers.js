import { wrapperFunction } from "../Utils/asyncWrap.js";
import { WishList } from "../Models/wishList.models.js";
import { Listing } from "../Models/listing.models.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";

const getWishList = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const wishlist = await WishList.findOne({ user: user._id }).populate({
        path: "listings",
        populate: {
            path: "host",
            select: "name profileImage",
        },
    });
    if (!wishlist) {
        throw new ApiError(404, "WishList not found");
    }
    return res.status(200).json(new ApiResponse(200, wishlist, "WishList"));
});

const addToWishList = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }
    const { listingId } = req.params;
    if (!listingId) {
        throw new ApiError(400, "Listing ID is required");
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }
    let wishlist = await WishList.findOne({ user: user._id });
    if (!wishlist) {
        wishlist = new WishList({ user: user._id, listings: [] });
    }
    wishlist.listings.push(listingId);
    await wishlist.save();
    return res
        .status(200)
        .json(new ApiResponse(200, wishlist, "Listing added to WishList"));
});

const removeFromWishList = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { listingId } = req.params;
    if (!listingId) {
        throw new ApiError(400, "Listing ID is required");
    }
    const listing = await Listing.findById(listingId);
    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }
    const wishlist = await WishList.findOne({ user: user._id });
    if (!wishlist) {
        throw new ApiError(404, "WishList not found");
    }
    await wishlist.listings.pull(listingId);
    await wishlist.save();
    return res
        .status(200)
        .json(new ApiResponse(200, wishlist, "Listing removed from WishList"));

});

export { getWishList, addToWishList, removeFromWishList };
