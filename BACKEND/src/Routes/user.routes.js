import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
} from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();

router
    .route("/register")
    .post(upload.fields([{ name: "profileImage", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);

export { router };
