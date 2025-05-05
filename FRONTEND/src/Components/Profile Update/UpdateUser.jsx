import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { HiUser, HiHome, HiLockClosed, HiCamera } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [secruityBtn, setSecruityBtn] = useState(false);
    const [updateBtn, setUpdateBtn] = useState(true);
    const [password, setPassword] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [updateUser, setUpdateUser] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        bio: "",
        roles: "",
    });
    const [profileImage, setProfileImage] = useState(null);

    const handleSectionToggle = (section) => {
        setSecruityBtn(section === "security");
        setUpdateBtn(section === "profile");
    };

    const handleFormSubmitButton = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(updateUser.email)) {
            toast.error("Invalid email format.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.patch(
                "/api/v1/users/update/profile",
                updateUser
            );
            if (response.status === 200) {
                toast.success(response.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        setUpdateUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileImageUpdate = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Please upload an image file");
            return;
        }

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            const response = await axios.patch(
                "/api/v1/users/update/profile/image",
                formData
            );
            if (response.status === 200) {
                toast.success(response.data.message);
                getUser();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Image upload failed");
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (password.newPassword !== password.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            const response = await axios.patch(
                "/api/v1/users/update/password",
                password
            );
            if (response.status === 200) {
                toast.success("Password updated successfully");
                setPassword({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                });
            }
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Password update failed"
            );
        }
    };

    const getUser = async () => {
        try {
            const response = await axios.get("/api/v1/users/get/profile");
            setUpdateUser(response.data.data);
            setProfileImage(response.data.data.profileImage);
        } catch (error) {
            navigate("/login");
            toast.error("Uauthorized Access");
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    Account Settings
                </h1>

                <div className="flex flex-col items-center mb-12">
                    <div className="relative group">
                        <img
                            src={profileImage}
                            alt="Profile"
                            className="h-32 w-32 rounded-full object-cover border-4 border-gray-100 shadow-lg"
                        />
                        <label className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md cursor-pointer hover:bg-gray-100 transition-colors">
                            <HiCamera className="w-6 h-6 text-[#FF5A5F]" />
                            <input
                                type="file"
                                name="profileImage"
                                className="hidden"
                                accept="image/*"
                                onChange={handleProfileImageUpdate}
                            />
                        </label>
                    </div>
                </div>

                <div className="flex border-b mb-8">
                    <button
                        onClick={() => handleSectionToggle("profile")}
                        className={`px-6 py-3 font-medium ${
                            updateBtn
                                ? "text-[#FF5A5F] border-b-2 border-[#FF5A5F]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Profile Settings
                    </button>
                    <button
                        onClick={() => handleSectionToggle("security")}
                        className={`px-6 py-3 font-medium ${
                            secruityBtn
                                ? "text-[#FF5A5F] border-b-2 border-[#FF5A5F]"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        Security Settings
                    </button>
                </div>

                {updateBtn && (
                    <form
                        onSubmit={handleFormSubmitButton}
                        className="space-y-6"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {["name", "email", "bio", "phoneNumber"].map(
                                (field) => (
                                    <div key={field} className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 capitalize">
                                            {field.replace(/([A-Z])/g, " $1")}
                                        </label>
                                        <input
                                            type={
                                                field === "email"
                                                    ? "email"
                                                    : field === "phoneNumber"
                                                      ? "tel"
                                                      : "text"
                                            }
                                            name={field}
                                            value={updateUser[field]}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                                            required={
                                                field === "name" ||
                                                field === "email"
                                            }
                                        />
                                    </div>
                                )
                            )}
                        </div>

                        <div className="space-y-4">
                            <p className="text-sm font-medium text-gray-700">
                                Account Type
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {["User", "Host"].map((role) => (
                                    <label
                                        key={role}
                                        className={`p-6 rounded-xl border-2 flex flex-col items-center cursor-pointer transition-all ${
                                            updateUser.roles === role
                                                ? "border-[#FF5A5F] bg-[#FF5A5F]/10"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        {role === "User" ? (
                                            <HiUser className="w-8 h-8 mb-3 text-[#FF5A5F]" />
                                        ) : (
                                            <HiHome className="w-8 h-8 mb-3 text-[#FF5A5F]" />
                                        )}
                                        <span className="font-semibold text-gray-900">
                                            {role}
                                        </span>
                                        <input
                                            type="radio"
                                            name="roles"
                                            value={role}
                                            checked={updateUser.roles === role}
                                            onChange={handleChange}
                                            className="hidden"
                                        />
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#FF5A5F] hover:bg-[#E54B50] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
                        >
                            {loading ? (
                                <ClipLoader color="white" size={25} />
                            ) : (
                                "Save Profile Changes"
                            )}
                        </button>
                    </form>
                )}

                {secruityBtn && (
                    <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-6">
                            {[
                                "currentPassword",
                                "newPassword",
                                "confirmPassword",
                            ].map((field) => (
                                <div key={field} className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700 capitalize">
                                        {field.replace(/([A-Z])/g, " $1")}
                                    </label>
                                    <input
                                        type="password"
                                        name={field}
                                        value={password[field]}
                                        onChange={(e) =>
                                            setPassword({
                                                ...password,
                                                [field]: e.target.value,
                                            })
                                        }
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF5A5F] focus:border-[#FF5A5F]"
                                        required
                                    />
                                </div>
                            ))}
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gray-800 hover:bg-gray-900 text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                        >
                            <HiLockClosed className="w-5 h-5" />
                            <span>Update Password</span>
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default UpdateUser;
