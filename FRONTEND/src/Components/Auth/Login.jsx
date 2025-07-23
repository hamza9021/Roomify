import { useState } from "react";
import toast from "react-hot-toast";
import { useGoogleLogin } from "@react-oauth/google";

import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import axiosInstance from "../../utils/axios.instance";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [githubLoading, setGithubLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormData = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const response = await axiosInstance.post(
                "/api/v1/users/login",
                formData
            );
            toast.success(response.data.message);
            navigate("/");
        } catch (error) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    // const handleOAuthGoogle = async () => {
    //     try {
    //         setGoogleLoading(true);
    //         window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    //     } catch (error) {
    //         toast.error(error.response?.data?.message || "Google login failed");
    //         setGoogleLoading(false);
    //     }
    // };

    const responseGoogle = async (response) => {
        try {
            setGoogleLoading(true);
            if (response.code) {
                const result = await axiosInstance.get(
                    `api/v1/auth/google?code=${response.code}`
                );
                console.log("Login Successful:", result);
                console.log("Google Response:", response);

            }
        } catch (error) {
            console.log("Login Failed: error:", error);
            setGoogleLoading(false);
        }
        finally {
            setGoogleLoading(false);
            navigate("/");
        }
    };

    const handleOAuthGoogle = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: responseGoogle,
        flow: "auth-code",
    });

    const handleOAuthGithub = async () => {
        try {
            setGithubLoading(true);
            window.location.href = `${import.meta.env.VITE_API_URL}/auth/github`;
        } catch (error) {
            toast.error(error.response?.data?.message || "GitHub login failed");
            setGithubLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-gray-600">Sign in to your account</p>
                </div>

                <div className="space-y-4 mb-6">
                    <button
                        onClick={handleOAuthGoogle}
                        disabled={googleLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F]/50 transition-all"
                    >
                        {googleLoading ? (
                            <ClipLoader color="#4285F4" size={20} />
                        ) : (
                            <>
                                <FcGoogle className="w-5 h-5" />
                                <span className="text-gray-700 font-medium">
                                    Continue with Google
                                </span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleOAuthGithub}
                        disabled={githubLoading}
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg border border-gray-200 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF5A5F]/50 transition-all"
                    >
                        {githubLoading ? (
                            <ClipLoader color="#333" size={20} />
                        ) : (
                            <>
                                <FaGithub className="w-5 h-5 text-gray-800" />
                                <span className="text-gray-700 font-medium">
                                    Continue with GitHub
                                </span>
                            </>
                        )}
                    </button>
                </div>

                <div className="flex items-center mb-6">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="mx-4 text-gray-500 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                <form onSubmit={handleFormData} className="space-y-6">
                    <div className="relative">
                        <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-all placeholder-gray-400"
                            required
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
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:border-[#FF5A5F] focus:ring-1 focus:ring-[#FF5A5F] transition-all placeholder-gray-400"
                            required
                        />
                    </div>

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-[#FF5A5F] hover:text-[#E54B50] transition-colors"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5A5F] hover:bg-[#E54B50] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <ClipLoader color="white" size={25} />
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <p className="text-center text-gray-600">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="font-semibold text-[#FF5A5F] hover:text-[#E54B50] transition-colors"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
