import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import {
    HiUser,
    HiMail,
    HiPhone,
    HiLockClosed,
    HiCloudUpload,
    HiHome,
} from "react-icons/hi";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        roles: "",
        profileImage: null,
    });
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleFormData = async (event) => {
        event.preventDefault();
        setLoading(true);
        const { name, email, phoneNumber, password, profileImage, roles } =
            formData;

        if (
            !name ||
            !email ||
            !phoneNumber ||
            !password ||
            !profileImage ||
            !roles
        ) {
            toast.error("Please fill all the fields.");
            setLoading(false);
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Invalid email format.");
            setLoading(false);
            return;
        }

        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("phoneNumber", formData.phoneNumber);
        form.append("password", formData.password);
        form.append("roles", formData.roles);
        form.append("profileImage", formData.profileImage);

        try {
            const response = await axios.post("/api/v1/users/register", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            toast.success(`${response.data.message}`);
            navigate("/login");
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#FF5A5F] mb-2">
                        Create Account
                    </h1>
                    <p className="text-gray-600">
                        Join our community to get started
                    </p>
                </div>

                <form onSubmit={handleFormData} className="space-y-6">
                    <div className="relative">
                        <HiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Full Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <HiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all"
                        />
                    </div>

                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#FF5A5F] transition-colors">
                        <HiCloudUpload className="w-8 h-8 mb-2 text-[#FF5A5F]" />
                        <span className="text-gray-600 text-sm">
                            {formData.profileImage?.name ||
                                "Click to upload profile photo"}
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            name="profileImage"
                            onChange={handleChange}
                            className="hidden"
                        />
                    </label>

                    <div className="grid grid-cols-2 gap-4">
                        <label
                            className={`p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer transition-all 
                            ${formData.roles === "User" ? "border-[#FF5A5F] bg-[#FF5A5F]/10" : "border-gray-200"}`}
                        >
                            <HiUser className="w-6 h-6 mb-2 text-[#FF5A5F]" />
                            <span className="font-semibold">User</span>
                            <span className="text-sm text-gray-600">
                                Join as Member
                            </span>
                            <input
                                type="radio"
                                name="roles"
                                value="User"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>

                        <label
                            className={`p-4 rounded-lg border-2 flex flex-col items-center cursor-pointer transition-all 
                            ${formData.roles === "Host" ? "border-[#FF5A5F] bg-[#FF5A5F]/10" : "border-gray-200"}`}
                        >
                            <HiHome className="w-6 h-6 mb-2 text-[#FF5A5F]" />
                            <span className="font-semibold">Host</span>
                            <span className="text-sm text-gray-600">
                                List Properties
                            </span>
                            <input
                                type="radio"
                                name="roles"
                                value="Host"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5A5F] hover:bg-[#E54B50] text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
                    >
                        {loading ? (
                            <ClipLoader color="white" size={25} />
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <p className="text-center text-gray-600">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#FF5A5F] font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;
