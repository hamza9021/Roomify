import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updatePassword,
    updateprofileImage,
} from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const router = Router();

router
    .route("/register")
    .post(upload.fields([{ name: "profileImage", maxCount: 1 }]), registerUser);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/get/profile").get(verifyJWT, getUserProfile);
router.route("/update/profile").patch(verifyJWT, updateUserProfile);
router.route("/update/password").patch(verifyJWT, updatePassword);
router
    .route("/update/profile/image")
    .patch(
        verifyJWT,
        upload.fields([{ name: "profileImage", maxCount: 1 }]),
        updateprofileImage
    );

export { router };
