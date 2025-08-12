import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updatePassword,
    updateprofileImage,
    verifyEmail
} from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.js";
import { verifyJWT } from "../Middlewares/auth.middleware.js";
const userRouter = Router();

userRouter
    .route("/register")
    .post(upload.fields([{ name: "profileImage", maxCount: 1 }]), registerUser);
    userRouter.route("/verify/email").post(verifyEmail);

    userRouter.route("/login").post(loginUser);
    userRouter.route("/logout").post(verifyJWT, logoutUser);
    userRouter.route("/get/profile").get(verifyJWT, getUserProfile);
    userRouter.route("/update/profile").patch(verifyJWT, updateUserProfile);
    userRouter.route("/update/password").patch(verifyJWT, updatePassword);
    userRouter
    .route("/update/profile/image")
    .patch(
        verifyJWT,
        upload.fields([{ name: "profileImage", maxCount: 1 }]),
        updateprofileImage
    );

export { userRouter };
