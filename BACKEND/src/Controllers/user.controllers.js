import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.models.js";
import { generateAccessAndRefreshToken } from "../Utils/generateAccessAndRefreshToken.js";

const registerUser = wrapperFunction(async (req, res) => {
    const { name, email, password, phoneNumber, roles } = req.body;
    if (!name || !email || !password || !phoneNumber || !roles) {
        throw new ApiError(400, "Please fill all the fields");
    }

    if (await User.findOne({ $or: [{ name }, { email }] })) {
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

    const user = await User.create({
        name,
        email,
        password,
        phoneNumber,
        roles,
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

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
    );
    const updateUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    const cookieOptions = {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        domain: '.vercel.app',
        maxAge: 7 * 24 * 60 * 60 * 1000,
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

    const cookieOptions = { httpOnly: true, secure: true };
    res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "Logout Successfully"));
});

const getUserProfile = wrapperFunction(async (req, res) => {
    const user = await User.findById(req.user._id).select(
        "-password -refreshToken"
    );
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
};
