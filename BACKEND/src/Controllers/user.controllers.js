import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { User } from "../Models/user.models.js";

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

export { registerUser };
