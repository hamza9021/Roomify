import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FiPaperclip, FiSend, FiX, FiZoomIn } from "react-icons/fi";

const Messages = () => {
    const [loading, setLoading] = useState(true);
    const [conversationPartners, setConversationPartners] = useState([]);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [isSending, setIsSending] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Fetch conversation partners
    useEffect(() => {
        const fetchConversationPartners = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    "/api/v1/messages/conversation-partners"
                );
                setConversationPartners(response.data.data);
            } catch (error) {
                console.error("Error fetching conversation partners:", error);
                toast.error("Failed to load conversations");
            } finally {
                setLoading(false);
            }
        };

        fetchConversationPartners();
    }, []);

    // Fetch messages when partner is selected
    useEffect(() => {
        if (selectedPartner) {
            const fetchMessages = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get(
                        `/api/v1/messages/${selectedPartner._id}/get-messages`
                    );
                    setMessages(response.data.data.reverse());
                } catch (error) {
                    console.error("Error fetching messages:", error);
                    toast.error("Failed to load messages");
                } finally {
                    setLoading(false);
                }
            };
            fetchMessages();
        }
    }, [selectedPartner]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle file selection
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + attachments.length > 8) {
            toast.error("You can only attach up to 8 files");
            return;
        }
        setAttachments((prev) => [...prev, ...files.slice(0, 8 - prev.length)]);
    };

    // Remove attachment
    const removeAttachment = (index) => {
        setAttachments((prev) => prev.filter((_, i) => i !== index));
    };

    // Send message handler
    const handleSendMessage = async () => {
        if (!content.trim() && attachments.length === 0) {
            toast.error("Please enter a message or select an attachment");
            return;
        }

        try {
            setIsSending(true);
            let newMessages = [];

            // Send text message if content exists
            if (content.trim()) {
                const textResponse = await axios.post(
                    `/api/v1/messages/${selectedPartner._id}/create-message-with-text`,
                    { content }
                );
                newMessages.push(textResponse.data.data);
            }

            // Send attachments if any
            if (attachments.length > 0) {
                const formData = new FormData();
                attachments.forEach((file) => {
                    formData.append("attachments", file);
                });

                const fileResponse = await axios.post(
                    `/api/v1/messages/${selectedPartner._id}/create-message-with-file`,
                    formData,
                    { headers: { "Content-Type": "multipart/form-data" } }
                );
                newMessages.push(fileResponse.data.data);
            }

            // Update messages and clear inputs

            setMessages((prev) => [...prev, ...newMessages]);
            setContent("");
            setAttachments([]);
        } catch (error) {
            console.error("Error sending message:", error);
            toast.error(
                error.response?.data?.message || "Failed to send message"
            );
        } finally {
            setIsSending(false);
        }
    };

    if (loading && !selectedPartner) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#FF5A5F" size={50} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white">
            {/* Sidebar - Conversation Partners */}
            <div className="w-1/4 border-r border-gray-200 bg-white p-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 text-gray-800">
                    Conversations
                </h2>

                {conversationPartners.length === 0 ? (
                    <p className="text-gray-500">No conversations yet</p>
                ) : (
                    <div className="space-y-2">
                        {conversationPartners.map((partner) => (
                            <button
                                key={partner._id}
                                onClick={() => setSelectedPartner(partner)}
                                className={`flex items-center p-3 rounded-lg hover:bg-gray-100 w-full text-left transition-colors ${
                                    selectedPartner?._id === partner._id
                                        ? "bg-gray-100"
                                        : ""
                                }`}
                            >
                                <img
                                    src={
                                        partner.profileImage ||
                                        "/default-avatar.png"
                                    }
                                    alt={partner.name}
                                    className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                                />
                                <div className="overflow-hidden">
                                    <p className="font-medium truncate text-gray-800">
                                        {partner.name}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {partner.lastMessageContent ||
                                            "No messages yet"}
                                    </p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedPartner ? (
                    <>
                        {/* Chat Header */}
                        <div className="border-b border-gray-200 bg-white p-4 flex items-center">
                            <img
                                src={
                                    selectedPartner.profileImage ||
                                    "/default-avatar.png"
                                }
                                alt={selectedPartner.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover border border-gray-200"
                            />
                            <h2 className="text-xl font-semibold text-gray-800">
                                {selectedPartner.name}
                            </h2>
                        </div>

                        {/* Messages Container */}

                        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <ClipLoader color="#FF5A5F" size={30} />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-gray-500">
                                        No messages yet. Start the conversation!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {messages.map((message) => (
                                        <div
                                            key={message._id}
                                            className={`flex ${
                                                message.sender._id ===
                                                selectedPartner._id
                                                    ? "justify-start"
                                                    : "justify-end"
                                            } items-end gap-2`}
                                        >
                                            {console.log(message)}
                                            {message.sender._id ===
                                                selectedPartner._id && (
                                                <img
                                                    src={
                                                        message.sender
                                                            .profileImage ||
                                                        "/default-avatar.png"
                                                    }
                                                    alt={message.sender.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}

                                            <div className="flex flex-col max-w-xs lg:max-w-md">
                                                <div
                                                    className={`rounded-2xl p-3 ${
                                                        message.sender._id ===
                                                        selectedPartner._id
                                                            ? "bg-white border border-gray-200 rounded-tl-none"
                                                            : "bg-airbnb-pink text-white rounded-tr-none"
                                                    } shadow-sm`}
                                                >
                                                    {message.content && (
                                                        <p
                                                            className={`mb-2 ${message.sender._id !== selectedPartner._id ? "text-white" : "text-gray-800"}`}
                                                        >
                                                            {message.content}
                                                        </p>
                                                    )}
                                                    {message.attachments
                                                        ?.length > 0 && (
                                                        <div className="mt-2 grid grid-cols-2 gap-2">
                                                            {message.attachments.map(
                                                                (
                                                                    attachment,
                                                                    index
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="relative group bg-white p-1 rounded-lg overflow-hidden"
                                                                    >
                                                                        <img
                                                                            src={
                                                                                attachment
                                                                            }
                                                                            alt="Attachment"
                                                                            className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                                                            onClick={() =>
                                                                                setPreviewImage(
                                                                                    attachment
                                                                                )
                                                                            }
                                                                        />
                                                                        <button
                                                                            className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                            onClick={() =>
                                                                                setPreviewImage(
                                                                                    attachment
                                                                                )
                                                                            }
                                                                        >
                                                                            <FiZoomIn
                                                                                size={
                                                                                    16
                                                                                }
                                                                            />
                                                                        </button>
                                                                    </div>
                                                                )
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <p
                                                    className={`text-xs mt-1 px-2 ${
                                                        message.sender._id ===
                                                        selectedPartner._id
                                                            ? "text-gray-500 text-left"
                                                            : "text-gray-500 text-right"
                                                    }`}
                                                >
                                                    {new Date(
                                                        message.createdAt
                                                    ).toLocaleString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                        day: "numeric",
                                                        month: "short",
                                                    })}
                                                </p>
                                            </div>

                                            {message.sender._id !==
                                                selectedPartner._id && (
                                                <img
                                                    src={
                                                        message.sender
                                                            .profileImage ||
                                                        "/default-avatar.png"
                                                    }
                                                    alt={message.sender.name}
                                                    className="w-8 h-8 rounded-full object-cover"
                                                />
                                            )}
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                            )}
                        </div>

                        {/* Image Preview Modal */}
                        {previewImage && (
                            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                                <div className="relative max-w-4xl max-h-screen bg-white rounded-lg p-4">
                                    <img
                                        src={previewImage}
                                        alt="Preview"
                                        className="max-w-full max-h-screen object-contain rounded-lg"
                                    />
                                    <button
                                        onClick={() => setPreviewImage(null)}
                                        className="absolute top-4 right-4 bg-airbnb-pink text-white p-2 rounded-full hover:bg-airbnb-pink-dark transition-colors"
                                    >
                                        <FiX size={24} />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Message Input Area */}
                        <div className="border-t border-gray-200 bg-white p-4">
                            {/* Attachment preview */}
                            {attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={index}
                                            className="relative group"
                                        >
                                            {file.type.startsWith("image/") ? (
                                                <div className="relative">
                                                    <img
                                                        src={URL.createObjectURL(
                                                            file
                                                        )}
                                                        alt="Preview"
                                                        className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            removeAttachment(
                                                                index
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-airbnb-pink text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <FiX size={10} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative w-16 h-16 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                                    <div className="text-center px-1">
                                                        <div className="text-xs text-gray-500 mb-1">
                                                            {file.name
                                                                .split(".")
                                                                .pop()}
                                                        </div>
                                                        <p className="text-xs text-gray-700 truncate w-full px-1">
                                                            {
                                                                file.name.split(
                                                                    "."
                                                                )[0]
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() =>
                                                            removeAttachment(
                                                                index
                                                            )
                                                        }
                                                        className="absolute -top-2 -right-2 bg-airbnb-pink text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                    >
                                                        <FiX size={10} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Input area */}
                            <div className="flex items-center rounded-full bg-white border border-gray-200 px-3 py-2">
                                {/* File attachment button */}
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={attachments.length >= 8}
                                    className="p-2 rounded-full text-gray-500 hover:text-airbnb-pink hover:bg-gray-100 transition-colors mr-1"
                                    title={
                                        attachments.length >= 8
                                            ? "Maximum 8 attachments"
                                            : "Add attachments"
                                    }
                                >
                                    <FiPaperclip size={20} />
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        multiple
                                        accept="*"
                                    />
                                </button>

                                {/* Message input */}
                                <input
                                    type="text"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyPress={(e) =>
                                        e.key === "Enter" && handleSendMessage()
                                    }
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 px-2"
                                    disabled={isSending}
                                />

                                {/* Send button */}
                                <button
                                    onClick={handleSendMessage}
                                    disabled={
                                        isSending ||
                                        (!content.trim() &&
                                            attachments.length === 0)
                                    }
                                    className={`p-2 rounded-full transition-colors ${
                                        content.trim() || attachments.length > 0
                                            ? "bg-airbnb-pink text-white hover:bg-airbnb-pink-dark"
                                            : "text-gray-400 cursor-not-allowed"
                                    }`}
                                >
                                    <FiSend size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-gray-50">
                        <p className="text-gray-500">
                            Select a conversation to start chatting
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
