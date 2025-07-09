import { Router } from "express";
const listingRouter = Router({ mergeParams: true });
import {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getAllListings,
    getAllHostListings,
    searchListings,
} from "../Controllers/listing.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.js";


listingRouter
    .route("/create-listing")
    .post(
        verifyJWT,
        upload.fields([{ name: "photos", maxCount: 8 }]),
        createListing
    );
listingRouter.route("/:id/delete-listing").delete(verifyJWT, deleteListing);
listingRouter
    .route("/:id/update-listing")
    .patch(
        verifyJWT,
        upload.fields([{ name: "photos", maxCount: 8 }]),
        updateListing
    );
listingRouter.route("/search").get(searchListings); 
listingRouter.route("/:id").get(getListing);
listingRouter.route("/").get(getAllListings);
listingRouter.route("/host/listings").get(verifyJWT, getAllHostListings);

export { listingRouter };
