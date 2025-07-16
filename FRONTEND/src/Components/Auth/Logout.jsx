import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axios.instance";


const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                const response = await axiosInstance.post(
                    "/api/v1/users/logout"
                );
                // can use just in case user can log out because of bacend error
                //   document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                // document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
