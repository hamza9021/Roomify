import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { HiLockClosed, HiArrowLeft } from "react-icons/hi";
import axiosInstance from "../../utils/axios.instance";

const VerifyEmail = () => {
    const [otp, setOtp] = useState(["", "", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.substring(value.length - 1);
        setOtp(newOtp);

        // Auto focus to next input
        if (value && index < 6 && e.target.nextSibling) {
            e.target.nextSibling.focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0 && e.target.previousSibling) {
            e.target.previousSibling.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const otpString = otp.join("");
        if (otpString.length !== 7) {
            toast.error("Please enter the complete 7-digit OTP");
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post("/api/v1/users/verify/email", {
                otp: otpString
            });
            toast.success(response.data.message);
            navigate("/login");
        } catch (error) {
            toast.error(error.response?.data?.message || "Verification failed");
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#FF5A5F] hover:text-[#E54B50] mb-6 transition-all"
                >
                    <HiArrowLeft className="mr-2" />
                    Back
                </button>

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-[#FF5A5F] mb-2">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-600">
                        We've sent a 7-digit code to your email
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="flex justify-center space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                type="text"
                                maxLength="1"
                                value={digit}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                className="w-12 h-16 text-3xl text-center rounded-lg border-2 border-gray-200 focus:border-[#FF5A5F] focus:ring-2 focus:ring-[#FF5A5F]/20 transition-all"
                            />
                        ))}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#FF5A5F] hover:bg-[#E54B50] text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center"
                    >
                        {loading ? (
                            <ClipLoader color="white" size={25} />
                        ) : (
                            <>
                                <HiLockClosed className="mr-2" />
                                Verify Account
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                    <p className="text-gray-600">
                        Having trouble?{" "}
                        <Link
                            to="/contact"
                            className="text-[#FF5A5F] font-semibold hover:underline"
                        >
                            Contact Support
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmail;