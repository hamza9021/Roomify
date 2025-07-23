import { google } from "googleapis";
import { googleConfig } from "../Utils/googleConfig.js";
import axios from "axios";
import { User } from "../Models/user.models.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { ApiError } from "../Utils/ApiError.js";
import { wrapperFunction } from "../Utils/asyncWrap.js";

const googleLogin = wrapperFunction(async (req, res) => {
    try {
        const { code } = req.query;
        const googleReponse = await googleConfig.getToken(code);
        googleConfig.setCredentials(googleReponse.tokens);
        const { access_token } = googleReponse.tokens;
        console.log("Access Token:", access_token);
        const userInfoResponse = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
        );

        const { email, name, picture } = userInfoResponse.data;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name,
                email,
                profileImage: picture,
                joinedDate: new Date(),
                roles: "User",
            });
        }

        
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            // sameSite: process.env.NODE_ENV === "production" && "lax",
            maxAge: 24 * 60 * 60 * 1000,

            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            //   priority: 'high',
            // domain: ".onrender.com",
            path: "/",
        };

        return res
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .status(200)
            .json(new ApiResponse(200, user, "User Logged In Successfully"));


    } catch (error) {
        console.error("Google login error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
});

export { googleLogin };
