import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: false },
        phoneNumber: {
            type: Number,
            required: false,
            unique: false,
        },
        profileImage: { type: String, required: true },
        bio: { type: String },
        joinedDate: { type: Date, required: true },
        isHost: { type: Boolean },
        listings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Listing" }],
        savedListings: [
            { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        ],
        bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
        reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
        messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
        notifications: [
            {
                type: { type: String },
                message: { type: String },
                isRead: { type: Boolean },
                timestamp: { type: Date },
            },
        ],
        paymentMethods: [
            {
                cardNumber: { type: String },
                expiryDate: { type: String },
                cardType: { type: String },
                isDefault: { type: Boolean },
            },
        ],
        isVerified: { type: Boolean , default: false },
        otp: { type: String },
        verificationDocuments: [{ type: String }],
        roles: {
            type: String,
            enum: ["User", "Host"],
            required: true,
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    try {
        if (this.isModified("password")) {
            const hashedPassword = await bcrypt.hash(this.password, 10);
            this.password = hashedPassword;
        }
        next();
    } catch (error) {
        console.log(error);
        next(error);
    }
});

userSchema.methods.isPasswordMatch = async function (password) {
    try {
        return await bcrypt.compare(password, this.password);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { _id: this._id, email: this.email, name: this.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

export const User = mongoose.model("User", userSchema);
