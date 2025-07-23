import { Router } from "express";
const authRouter = Router( { mergeParams: true } );
import {googleLogin} from "../Controllers/auth.controllers.js";

authRouter.get("/google", googleLogin);

export { authRouter };
