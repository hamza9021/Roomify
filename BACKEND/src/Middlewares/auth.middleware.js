import jwt from "jsonwebtoken";
import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { User } from "../Models/user.models.js";

const verifyJWT = wrapperFunction(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        throw new ApiError(401, "Token Not Found");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
        "-password -refreshToken"
    );

    if (!user) {
        throw new ApiError(401, "Invalid Token");
    }
    req.user = user;
    next();
});

export { verifyJWT };
