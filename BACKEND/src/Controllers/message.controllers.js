import { wrapperFunction } from "../Utils/asyncWrap.js";
import { ApiError } from "../Utils/ApiError.js";
import { ApiResponse } from "../Utils/ApiResponse.js";
import { Message } from "../Models/message.models.js";
import { User } from "../Models/user.models.js";
import { uploadOnCloudinary } from "../Services/cloudinary.js";

const createMessageWithText = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) throw new ApiError(401, "Unauthorized");

    const { receiverId } = req.params;
    if (!receiverId) throw new ApiError(400, "Receiver ID is required");

    const receiver = await User.findById(receiverId);
    if (!receiver) throw new ApiError(404, "Receiver not found");

    const { content } = req.body;
    if (!content?.trim()) throw new ApiError(400, "Content is required");

    const message = await Message.create({
        sender: user._id,
        receiver: receiverId,
        content,
        status: "sent",
    });

    await User.updateMany(
        { _id: { $in: [user._id, receiverId] } },
        { $push: { messages: message._id } }
    );

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name profilePicture")
        .populate("receiver", "name profilePicture");

    return res
        .status(200)
        .json(
            new ApiResponse(200, populatedMessage, "Message sent successfully")
        );
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
    if (attachments.length === 0) {
        throw new ApiError(400, "At least one attachment is required");
    }

    const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024;

    for (const attachment of attachments) {
        if (!allowedTypes.includes(attachment.mimetype)) {
            throw new ApiError(
                400,
                `Invalid file type: ${attachment.originalname}. Only JPEG, PNG, GIF, and PDF are allowed.`
            );
        }
        if (attachment.size > maxSize) {
            throw new ApiError(
                400,
                `File too large: ${attachment.originalname}. Maximum size is 5MB.`
            );
        }
    }

    const attachmentUrls = [];
    try {
        for (const attachment of attachments) {
            const { secure_url } = await uploadOnCloudinary(attachment.path);
            if (!secure_url) {
                throw new ApiError(500, "Failed to upload attachment");
            }
            attachmentUrls.push(secure_url);
        }
    } catch (error) {
        throw new ApiError(
            500,
            "Error uploading attachments: " + error.message
        );
    }

    const message = await Message.create({
        sender: user._id,
        receiver: receiverId,
        attachments: attachmentUrls,
        status: "sent",
    });

    await User.updateMany(
        { _id: { $in: [user._id, receiverId] } },
        { $push: { messages: message._id } }
    );

    const populatedMessage = await Message.findById(message._id)
        .populate("sender", "name profilePicture")
        .populate("receiver", "name profilePicture");

    if (!populatedMessage) {
        throw new ApiError(500, "Failed to send message");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                populatedMessage,
                "Message with attachments sent successfully"
            )
        );
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
        .populate({ path: "sender", select: "name profileImage" })
        .populate({ path: "receiver", select: "name profileImage" })
        .sort({ createdAt: -1 });

    console.log("Messages:", messages);

    return res
        .status(200)
        .json(
            new ApiResponse(200, messages, "Messages retrieved successfully")
        );
});

const deleteMessage = wrapperFunction(async (req, res) => {
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

    const { messageId } = req.params;
    if (!messageId) {
        throw new ApiError(400, "Message ID is required");
    }
    const message = await Message.findById(messageId);
    if (!message) {
        throw new ApiError(404, "Message not found");
    }
    if (message.sender.toString() !== user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this message"
        );
    }
    const deletedMessage = await Message.findByIdAndDelete(messageId);
    if (!deletedMessage) {
        throw new ApiError(500, "Failed to delete message");
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, deletedMessage, "Message deleted successfully")
        );
});

const getConversationPartners = wrapperFunction(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    const messages = await Message.find({
        $or: [{ sender: user._id }, { receiver: user._id }],
    })
        .populate({ path: "sender", select: "name profileImage" })
        .populate({ path: "receiver", select: "name profileImage" });

    const partners = new Map();

    messages.forEach((message) => {
        const partnerId = message.sender._id.equals(user._id)
            ? message.receiver._id
            : message.sender._id;

        const partner = message.sender._id.equals(user._id)
            ? message.receiver
            : message.sender;

        if (!partners.has(partnerId.toString())) {
            partners.set(partnerId.toString(), {
                _id: partnerId,
                name: partner.name,
                profileImage: partner.profileImage,
                lastMessage: message.createdAt,
            });
        }
    });

    const sortedPartners = Array.from(partners.values()).sort((a, b) => {
        return new Date(b.lastMessage) - new Date(a.lastMessage);
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                sortedPartners,
                "Conversation partners retrieved successfully"
            )
        );
});

export {
    createMessageWithText,
    createMessageWithFile,
    getMessages,
    deleteMessage,
    getConversationPartners,
};
