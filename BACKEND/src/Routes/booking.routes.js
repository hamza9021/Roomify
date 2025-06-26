import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { Router } from "express";
const bookingRouter = Router({ mergeParams: true });
import { createBooking } from "../Controllers/booking.controllers.js";

bookingRouter.route("/:listingID/create-booking").post(verifyJWT,createBooking);

export { bookingRouter };