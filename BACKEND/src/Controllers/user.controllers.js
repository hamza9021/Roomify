import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.models.js";
import { generateAccessAndRefreshToken } from "../Utils/generateAccessAndRefreshToken.js";
import { sendVerificationCode } from "../Utils/VerificationCodeSent.js";

const registerUser = wrapperFunction(async (req, res) => {
    const { name, email, password, phoneNumber, roles } = req.body;
    if (!name || !email || !password || !phoneNumber || !roles) {
        throw new ApiError(400, "Please fill all the fields");
    }

    if (await User.findOne({ $or: [{ phoneNumber }, { email }] })) {
        throw new ApiError(409, "User Already Exists");
    }

    const profileImageLocalPath = await req.files?.profileImage?.[0]?.path;

    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile Image Should Be Required");
    }

    console.log(profileImageLocalPath);

    const profileImage = await uploadOnCloudinary(profileImageLocalPath);

    if (!profileImage) {
        throw new ApiError(400, "Profile Image is not uploaded on cloud");
    }

    const otp = Math.floor(1000000 + Math.random() * 9000000).toString();

    sendVerificationCode(email, otp);

    const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        roles,
        otp,
        joinedDate: new Date(),
        profileImage: profileImage.url,
    });

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    console.log(createdUser);

    return res
        .status(200)
        .json(new ApiResponse(200, createdUser, "User Created Successfully"));
});


const verifyEmail = wrapperFunction(async (req, res) => {
    const { otp } = req.body;
    console.log(otp);
    if (!otp) {
        throw new ApiError(400, "OTP is required");
    }

    const user = await User.findOne({ otp }).select('-password');
    if (!user) {
        throw new ApiError(404, 'User Not Found')
    }

    if (user.otp != otp) {
        throw new ApiError(403, 'Invalid OTP')
    }

    if (user.isVerified) {
        throw new ApiError(400, 'Email already verified')
    }

    user.isVerified = true;
    user.otp = null;

    await user.save();

    return res.status(200).json(new ApiResponse(200, { message: 'Email Verified' }));
}
);

const loginUser = wrapperFunction(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new ApiError(400, "Please fill all the fields");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }

    if (!(await user.isPasswordMatch(password))) {
        throw new ApiError(401, "Incorrect Password");
    }

    if (user.isVerified === false) {
        await sendVerificationCode(user.email, user.otp);
        throw new ApiError(403, 'Email is not verified');
    }


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );
    const updateUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

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
        .json(new ApiResponse(200, updateUser, "User Logged In Successfully"));
});

const logoutUser = wrapperFunction(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        { $set: { refreshToken: undefined } },
        { new: true }
    );

    // const cookieOptions = { httpOnly: true, secure: true };
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        path: "/",

    };

    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logout Successfully"));
});

const getUserProfile = wrapperFunction(async (req, res) => {
    const user = await User.findById(req.user._id)
        .populate({
            path: "messages",
            select: "content attachments createdAt status",
            populate: [
                {
                    path: "sender",
                    select: "name profilePicture",
                },
                {
                    path: "receiver",
                    select: "name profilePicture",
                },
            ],
        })
        .select("-password -refreshToken");

    if (!user) {
        throw new ApiError(404, "User Not Found");
    }
    return res.status(200).json(new ApiResponse(200, user, "User Profile"));
});

const updateUserProfile = wrapperFunction(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "You are not authorized to update this user");
    }

    const { name, email, phoneNumber, bio, roles } = req.body;
    if (!name && !email && !phoneNumber && !bio && !roles) {
        throw new ApiError(400, "Please fill any one field");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: req.body },
        { new: true },
        { validateBeforeSave: false }
    ).select("-password -refreshToken");

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedUser,
                "User Profile Updated Successfully"
            )
        );
});

const updatePassword = wrapperFunction(async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ApiError(400, "Please fill all the fields");
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "You are not authorized to update this user");
    }

    if (!(await user.isPasswordMatch(currentPassword))) {
        throw new ApiError(401, "Incorrect Password");
    }

    if (newPassword !== confirmPassword) {
        throw new ApiError(400, "Password and Confirm Password should be same");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    res.status(200).json(
        new ApiResponse(200, {}, "Password Updated Successfully")
    );
});

const updateprofileImage = wrapperFunction(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "You are not authorized to update this user");
    }
    const profileImageLocalPath = await req.files?.profileImage?.[0]?.path;
    if (!profileImageLocalPath) {
        throw new ApiError(400, "Profile Image Should Be Required");
    }
    const profileImage = await uploadOnCloudinary(profileImageLocalPath);
    if (!profileImage) {
        throw new ApiError(400, "Profile Image is not uploaded on cloud");
    }

    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { profileImage: profileImage.url },
        { new: true, validateBeforeSave: false }
    ).select("-password -refreshToken");

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile Image Updated Successfully")
    );
});

export {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updatePassword,
    updateprofileImage,
    verifyEmail
};
