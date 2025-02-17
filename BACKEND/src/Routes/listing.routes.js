import { Router } from "express";
const listingRouter = Router({ mergeParams: true });
import {
    createListing,
    deleteListing,
} from "../Controllers/listing.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";

listingRouter.route("/create-listing").post(verifyJWT, createListing);
listingRouter.route("/:id/delete-listing").post(verifyJWT, deleteListing);

export { listingRouter };
