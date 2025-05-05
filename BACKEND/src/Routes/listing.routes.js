import { Router } from "express";
const listingRouter = Router({ mergeParams: true });
import {
    createListing,
    deleteListing,
    updateListing,
    getListing,
    getAllListings
} from "../Controllers/listing.controllers.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.js";

listingRouter.route("/create-listing").post(verifyJWT,upload.fields([{ name: "photos", maxCount: 8 }]), createListing);
listingRouter.route("/:id/delete-listing").post(verifyJWT, deleteListing);
listingRouter.route("/:id/update-listing").post(verifyJWT, updateListing);
listingRouter.route("/:id").get(getListing);
listingRouter.route("/").get(getAllListings);

export { listingRouter };
