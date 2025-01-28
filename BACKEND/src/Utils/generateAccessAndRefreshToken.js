import { User } from "../Models/user.models.js";
import { ApiError } from "./ApiError.js";

const generateAccessAndRefreshToken = async (userID) => {
    try {
        const user = await User.findById(userID);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something Went Wrong While Generating Access And Refresh Token"
        );
    }
};

export { generateAccessAndRefreshToken };
