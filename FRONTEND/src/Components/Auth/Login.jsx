import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";
import { HiMail, HiLockClosed } from "react-icons/hi";

const Login = () => {
    const corUrl = "https://roomify-2-2y0a.onrender.com";

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
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
        const { email, password } = formData;
        if (!email || !password) {
            toast.error("Please fill all the fields.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(`${corUrl}/api/v1/users/login`, {
                email,
                password,
            }, {withCredentials: true});
            toast.success(response.data.message);
            navigate("/");
        } catch (error) {
            toast.error(error.message);
        }
        setLoading(false);
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
