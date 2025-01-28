import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        password: "",
        profileImage: null,
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === "file" ? files[0] : value,
        }));
    };

    const handleFormData = async (event) => {
        event.preventDefault();
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
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Invalid email format.");
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
            toast.success(response.data.message);
            setTimeout(() => {
                navigate("/");
            }, 1000);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
            <h1 className="text-4xl font-bold mb-8 text-[#FF5A5F]">Register</h1>
            <form
                onSubmit={handleFormData}
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg"
            >
                <label
                    htmlFor="name"
                    className="block text-gray-800 text-sm font-semibold mb-2"
                >
                    Name
                </label>
                <input
                    type="text"
                    placeholder="Hamza Riaz"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />

                <label
                    htmlFor="email"
                    className="block text-gray-800 text-sm font-semibold mt-4 mb-2"
                >
                    Email
                </label>
                <input
                    type="text"
                    placeholder="hriaz9803@gmail.com"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />

                <label
                    htmlFor="phoneNumber"
                    className="block text-gray-800 text-sm font-semibold mt-4 mb-2"
                >
                    Phone Number
                </label>
                <input
                    type="number"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />

                <label
                    htmlFor="password"
                    className="block text-gray-800 text-sm font-semibold mt-4 mb-2"
                >
                    Password
                </label>
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />

                <label
                    htmlFor="profileImage"
                    className="block text-gray-800 text-sm font-semibold mt-4 mb-2"
                >
                    Profile Image
                </label>
                <input
                    type="file"
                    accept="image/*"
                    name="profileImage"
                    id="profileImage"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg py-2 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
                />
                <div className="mt-4 mb-2">
                    <label
                        htmlFor="roles"
                        className="block text-gray-800 text-sm font-semibold"
                    >
                        Roles
                    </label>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="roles"
                            value="User"
                            className="mr-2"
                            onChange={handleChange}
                        />
                        <span className="text-gray-700 text-sm">User</span>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            name="roles"
                            value="Host"
                            className="mr-2"
                            onChange={handleChange}
                        />
                        <span className="text-gray-700 text-sm">Host</span>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-6 w-full bg-[#FF5A5F] hover:bg-[#e04a4f] text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F]"
                >
                    Register
                </button>
            </form>
            <Toaster position="bottom-right" reverseOrder={false} />
        </div>
    );
};

export default Register;
