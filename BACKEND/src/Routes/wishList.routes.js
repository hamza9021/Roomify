import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { Router } from "express";
import {
    addToWishList,
    removeFromWishList,
    getWishList,
} from "../Controllers/wishList.controllers.js";
const wishListRouter = Router();

wishListRouter.route("/").get(verifyJWT, getWishList);
wishListRouter
    .route("/:listingId")
    .post(verifyJWT, addToWishList)
    .delete(verifyJWT, removeFromWishList);

export { wishListRouter };
