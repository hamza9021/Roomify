import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Review } from "../Models/review.models.js";
import { Listing } from "../Models/listing.models.js";

const createReview = wrapperFunction(async (req, res) => {
    const { rating, comment } = req.body;
    const { id } = req.params;

    if (!rating || !comment) {
        throw new ApiError(400, "Please fill all the fields");
    }

    const listing = await Listing.findById(id);

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    const review = await Review.create({
        user: req.user._id,
        listing: id,
        rating,
        comment,
    });

    await Listing.findByIdAndUpdate(
        id,
        { $push: { reviews: review._id } },
        { new: true },
    );
    await Listing.findByIdAndUpdate(
        id,
        {
            $inc: {
                "rating.averageRating": rating,
                "rating.totalReviews": 1,
            },
        },
        { new: true },
    );
    
    return res
        .status(200)
        .json(new ApiResponse(200, review, "Review Created Successfully"));
});

const deleteReview = wrapperFunction(async (req, res) => {
    const { id, reviewId } = req.params;

    if (!id) {
        throw new ApiError(400, "Please provide listing id");
    }

    if (!reviewId) {
        throw new ApiError(400, "Please provide review id");
    }

    const listing = await Listing.findById(id);
    const review = await Review.findById(reviewId);

    if (!listing) {
        throw new ApiError(404, "Listing not found");
    }

    if (!review) {
        throw new ApiError(404, "Review not found");
    }

    if (review.user.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this review");
    }

    await review.deleteOne();
    await listing.updateOne({
        $pull: { reviews: reviewId },
    });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Review Deleted Successfully"));
});


export { createReview, deleteReview };
