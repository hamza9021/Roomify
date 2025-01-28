import { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
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
            const response = await axios.post("/api/v1/users/login", {
                email,
                password,
            });
            toast.success(response.data.message);
            setTimeout(() => {
                navigate("/");
            }, 500);
            navigate("/");
        } catch (error) {
            toast.error(`${error.message}`);
        }
        setLoading(false);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                    Login
                </h1>
                <form onSubmit={handleFormData} className="space-y-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-2 mt-1 text-gray-800 bg-gray-100 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 text-white bg-red-500 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        {loading ? (
                            <div className="flex justify-center items-center">
                                <ClipLoader
                                    color="white"
                                    size={25}
                                    loading={loading}
                                />
                            </div>
                        ) : (
                            "Login"
                        )}
                    </button>
                </form>
                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link
                        to={"/register"}
                        className="text-red-500 hover:underline"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
