import { Router } from "express";
const reviewRouter = Router({ mergeParams: true });
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { createReview, deleteReview } from "../Controllers/review.controllers.js";

reviewRouter.route("/:id/create-review").post(verifyJWT, createReview);
reviewRouter.route("/:id/:reviewId/delete-review").post(verifyJWT, deleteReview);

export { reviewRouter };

