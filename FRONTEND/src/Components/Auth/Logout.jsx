import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

const Logout = () => {
    const corUrl = "https://roomify-2-2y0a.onrender.com";

    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await axios.post(
                    `${corUrl}/api/v1/users/logout`
                );
                if (response) {
                    toast.success(response.data.message);
                    navigate("/");
                }
            } catch (error) {
                toast.error(error.message || "Logout failed");
            }
        };

        handleLogout();
    }, [navigate]);

    return null;
};

export default Logout;
