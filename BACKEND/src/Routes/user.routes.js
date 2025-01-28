import { Router } from "express";
import { userRegister } from "../Controllers/user.controllers.js";
const router = Router();

router.route("/register").post(userRegister);

export { router };
