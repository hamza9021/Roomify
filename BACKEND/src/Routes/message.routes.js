import { Router } from "express";
const messageRouter = Router({ mergeParams: true });
import { verifyJWT } from "../Middlewares/auth.middleware.js";
import { upload } from "../Middlewares/multer.js";
import {
    createMessageWithFile,
    createMessageWithText,
    getMessages,
    deleteMessage,
    getConversationPartners
} from "../Controllers/message.controllers.js";

messageRouter
    .route("/:receiverId/create-message-with-text")
    .post(verifyJWT, createMessageWithText);

messageRouter
    .route("/:receiverId/create-message-with-file")
    .post(
        verifyJWT,
        upload.fields([{ name: "attachments", maxCount: 8 }]),
        createMessageWithFile
    );

messageRouter.route("/:receiverId/get-messages").get(verifyJWT, getMessages);

messageRouter
    .route("/:receiverId/:messageId/delete-message")
    .delete(verifyJWT, deleteMessage);

messageRouter
    .route("/conversation-partners")
    .get(verifyJWT, getConversationPartners);

export { messageRouter };
