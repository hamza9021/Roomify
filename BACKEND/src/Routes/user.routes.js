import { Router } from "express";
import { registerUser } from "../Controllers/user.controllers.js";
import { upload } from "../Middlewares/multer.js";
const router = Router();

router.route("/register").post(
    upload.fields([
        { name: "profileImage", maxCount: 1 },
    ]),
    registerUser
);

export { router };
