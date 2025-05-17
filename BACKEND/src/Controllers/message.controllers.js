import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Message } from "../Models/message.models.js";
import { User } from "../Models/user.models.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";

const createMessageWithText = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { receiverId } = req.params;
    if (!receiverId) {
        throw new ApiError(400, "Receiver ID is required");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }

    const { content } = req.body;
    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const message = await Message.create({
        sender: user._id,
        receiver: receiverId,
        content,
        status: "sent",
    });

    if (!message) {
        throw new ApiError(500, "Failed to send message");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message sent successfully"));
});

const createMessageWithFile = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { receiverId } = req.params;
    if (!receiverId) {
        throw new ApiError(400, "Receiver ID is required");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }

    const attachments = req.files?.attachments || [];
    const attachmentUrls = [];
    for (const attachment of attachments) {
        const { path } = attachment;
        const { secure_url } = await uploadOnCloudinary(path);
        attachmentUrls.push(secure_url);
    }

    const message = await Message.create({
        sender: user._id,
        receiver: receiverId,
        attachments: attachmentUrls,
        status: "sent",
    });

    if (!message) {
        throw new ApiError(500, "Failed to send message");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, message, "Message sent successfully"));
});

const getMessages = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const { receiverId } = req.params;
    if (!receiverId) {
        throw new ApiError(400, "Receiver ID is required");
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
        throw new ApiError(404, "Receiver not found");
    }

    const messages = await Message.find({
        $or: [
            { sender: user._id, receiver: receiverId },
            { sender: receiverId, receiver: user._id },
        ],
    })
        .populate({ path: "sender", select: "name profilePicture" })
        .populate({ path: "receiver", select: "name profilePicture" })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(200, messages, "Messages retrieved successfully")
        );
});

export { createMessageWithText, createMessageWithFile, getMessages };
