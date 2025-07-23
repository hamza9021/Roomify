import { useState, useRef, useEffect, useCallback } from "react";
import {
    FaAirbnb,
    FaSearch,
    FaGlobe,
    FaBars,
    FaUserCircle,
    FaHeart,
    FaHome,
    FaSignOutAlt,
    FaCog,
    FaList,
    FaPlus,
    FaSignInAlt,
    FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axiosInstance from "../../utils/axios.instance";

const Navbar = () => {
    const navigate = useNavigate();
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false);
    const [searchDropdownOpen, setSearchDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const wishlistDropdownRef = useRef(null);
    const searchDropdownRef = useRef(null);

    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState({
        user: true,
        wishlist: true,
    });

    const [searchParams, setSearchParams] = useState({
        title: "",
        placeType: "",
        address: "",
        city: "",
        pricePerNight: "",
        maxGuests: "",
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                userDropdownRef.current &&
                !userDropdownRef.current.contains(event.target)
            ) {
                setUserDropdownOpen(false);
            }
            if (
                wishlistDropdownRef.current &&
                !wishlistDropdownRef.current.contains(event.target)
            ) {
                setWishlistDropdownOpen(false);
            }
            if (
                searchDropdownRef.current &&
                !searchDropdownRef.current.contains(event.target)
            ) {
                setSearchDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchData = useCallback(async () => {
        try {
            setLoading((prev) => ({ ...prev, user: true, wishlist: true }));

            const [userResponse, wishlistResponse] = await Promise.all([
                axiosInstance
                    .get("/api/v1/users/get/profile")
                    .catch(() => ({ data: { data: null } })),
                axiosInstance
                    .get("/api/v1/wishlist")
                    .catch(() => ({ data: { data: { listings: [] } } })),
            ]);

            setUser(userResponse.data.data);
            setWishlist(wishlistResponse.data.data.listings || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading({ user: false, wishlist: false });
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteFromWishList = async (e, listingId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!listingId) return;

        try {
            setWishlist((prev) =>
                prev.filter((item) => item._id !== listingId)
            );
            await axiosInstance.delete(`/api/v1/wishlist/${listingId}`);
            toast.success("Removed from wishlist");
            const refreshResponse = await axiosInstance.get("/api/v1/wishlist");
            setWishlist(refreshResponse.data.data.listings || []);
        } catch (error) {
            const refreshResponse = await axiosInstance.get("/api/v1/wishlist");
            setWishlist(refreshResponse.data.data.listings || []);
            toast.error(
                error.response?.data?.message ||
                    "Failed to remove from wishlist"
            );
        }
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchParams((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();

        if (searchParams.address)
            queryParams.append("address", searchParams.address);
        if (searchParams.city) queryParams.append("city", searchParams.city);
        if (searchParams.pricePerNight)
            queryParams.append("pricePerNight", searchParams.pricePerNight);
        if (searchParams.maxGuests)
            queryParams.append("maxGuests", searchParams.maxGuests);
        if (searchParams.title) queryParams.append("title", searchParams.title);
        if (searchParams.placeType)
            queryParams.append("placeType", searchParams.placeType);

        navigate(`/search?${queryParams.toString()}`);
        setSearchDropdownOpen(false);
    };

    // Animation variants
    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-50 border-b border-gray-100">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo with animation */}
                <Link
                    to="/"
                    className="flex items-center text-rose-500 hover:text-rose-600 transition transform hover:scale-105"
                >
                    <motion.div whileHover={{ rotate: -10 }}>
                        <FaAirbnb className="text-2xl sm:text-3xl" />
                    </motion.div>
                    <span className="text-xl font-bold hidden sm:inline ml-1">
                        Roomify
                    </span>
                </Link>

                {/* Search Bar - Medium screens and up */}
                <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="hidden md:flex items-center justify-between border border-gray-200 rounded-full py-1 px-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer mx-4 flex-1 max-w-[450px]"
                    onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                >
                    <div className="font-medium px-2 text-sm truncate">
                        {searchParams.address ||
                            searchParams.city ||
                            "Anywhere"}
                    </div>
                    <span className="border-l h-4 border-gray-200"></span>
                    <div className="font-medium px-2 text-sm">Any week</div>
                    <span className="border-l h-4 border-gray-200"></span>
                    <div className="text-gray-500 px-2 text-sm">
                        {searchParams.maxGuests
                            ? `${searchParams.maxGuests} guests`
                            : "Add guests"}
                    </div>
                    <button className="bg-rose-500 p-2 rounded-full text-white hover:bg-rose-600 transition ml-2">
                        <FaSearch className="text-xs" />
                    </button>
                </motion.div>

                {/* Mobile Search Button */}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="md:hidden flex items-center justify-center p-2 rounded-full bg-rose-500 text-white shadow-md"
                    onClick={() => setSearchDropdownOpen(!searchDropdownOpen)}
                    aria-label="Search"
                >
                    <FaSearch className="text-sm" />
                </motion.button>

                {/* User Menu */}
                <div className="flex items-center space-x-2 ml-2">
                    {/* Mobile Host Button */}
                    <Link
                        to="/host"
                        className="md:hidden flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition"
                        aria-label="Become a Host"
                    >
                        <FaPlus className="text-gray-600" />
                    </Link>

                    {/* Wishlist Dropdown */}
                    <div className="relative" ref={wishlistDropdownRef}>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 hover:bg-gray-100 rounded-full transition relative"
                            onClick={() => {
                                setWishlistDropdownOpen(!wishlistDropdownOpen);
                                setUserDropdownOpen(false);
                                setSearchDropdownOpen(false);
                            }}
                            aria-label="Wishlist"
                        >
                            <FaHeart className="text-lg text-gray-600" />
                            {wishlist.length > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                                >
                                    {wishlist.length}
                                </motion.span>
                            )}
                        </motion.button>

                        <AnimatePresence>
                            {wishlistDropdownOpen && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto"
                                >
                                    <div className="px-4 py-2 font-medium border-b border-gray-100 flex justify-between items-center">
                                        <span>Your Wishlist</span>
                                        {wishlist.length > 0 &&
                                            !loading.wishlist && (
                                                <span className="text-xs text-gray-500">
                                                    {wishlist.length}{" "}
                                                    {wishlist.length === 1
                                                        ? "item"
                                                        : "items"}
                                                </span>
                                            )}
                                    </div>

                                    {loading.wishlist ? (
                                        <div className="px-4 py-4 text-center text-gray-500">
                                            <div className="animate-pulse flex flex-col space-y-3">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center"
                                                    >
                                                        <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                                                        <div className="flex-1 space-y-2">
                                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : wishlist.length > 0 ? (
                                        wishlist.map((item) => (
                                            <motion.div
                                                key={item._id}
                                                whileHover={{
                                                    backgroundColor: "#f9fafb",
                                                }}
                                                className="group flex items-center px-4 py-3 transition relative"
                                            >
                                                <Link
                                                    to={`/listing/${item._id}`}
                                                    className="flex items-center flex-1"
                                                    onClick={() =>
                                                        setWishlistDropdownOpen(
                                                            false
                                                        )
                                                    }
                                                >
                                                    <div className="relative w-12 h-12 rounded-lg overflow-hidden mr-3 flex-shrink-0">
                                                        <img
                                                            src={
                                                                item
                                                                    .photos?.[0] ||
                                                                "/placeholder-airbnb.jpg"
                                                            }
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-sm font-medium truncate">
                                                            {item.title}
                                                        </span>
                                                        <span className="text-xs text-gray-500 truncate">
                                                            {
                                                                item.location
                                                                    .address
                                                            }
                                                        </span>
                                                        <span className="text-xs font-semibold text-rose-500 mt-1">
                                                            $
                                                            {item.pricePerNight?.toLocaleString() ||
                                                                "N/A"}{" "}
                                                            night
                                                        </span>
                                                    </div>
                                                </Link>

                                                <button
                                                    onClick={(e) =>
                                                        handleDeleteFromWishList(
                                                            e,
                                                            item._id
                                                        )
                                                    }
                                                    className="opacity-0 group-hover:opacity-100 absolute right-3 p-1 text-gray-400 hover:text-rose-500 transition"
                                                    aria-label="Remove from wishlist"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M6 18L18 6M6 6l12 12"
                                                        />
                                                    </svg>
                                                </button>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-4 text-center text-gray-500">
                                            <FaHeart className="mx-auto text-gray-300 text-2xl mb-2" />
                                            <p>Your wishlist is empty</p>
                                            <Link
                                                to="/listings"
                                                className="text-rose-500 text-sm font-medium mt-2 inline-block hover:underline"
                                                onClick={() =>
                                                    setWishlistDropdownOpen(
                                                        false
                                                    )
                                                }
                                            >
                                                Explore listings
                                            </Link>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="flex items-center space-x-1 border border-gray-200 p-1 rounded-full hover:shadow-md transition cursor-pointer"
                            onClick={() => {
                                setUserDropdownOpen(!userDropdownOpen);
                                setWishlistDropdownOpen(false);
                                setSearchDropdownOpen(false);
                            }}
                            aria-label="User menu"
                        >
                            <FaBars className="text-gray-600 text-sm" />
                            {user ? (
                                <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-200">
                                    <img
                                        src={
                                            user.profileImage ||
                                            "/default-profile.png"
                                        }
                                        alt="User Avatar"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <FaUserCircle className="text-gray-600 w-7 h-7" />
                            )}
                        </motion.div>

                        <AnimatePresence>
                            {userDropdownOpen && (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    variants={dropdownVariants}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100"
                                >
                                    {user ? (
                                        <>
                                            <div className="px-4 py-3 border-b border-gray-100">
                                                <h3 className="font-medium">
                                                    Hello, {user.name || "User"}
                                                </h3>
                                                <p className="text-xs text-gray-500">
                                                    {user.email}
                                                </p>
                                            </div>
                                            <Link
                                                to="/trips"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaHome className="mr-3 text-gray-500" />
                                                <span>My Trips</span>
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaHeart className="mr-3 text-gray-500" />
                                                <span>Wishlist</span>
                                            </Link>
                                            <Link
                                                to="/host/listings"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaList className="mr-3 text-gray-500" />
                                                <span>My Listings</span>
                                            </Link>
                                            <Link
                                                to="/u/update"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaCog className="mr-3 text-gray-500" />
                                                <span>Account Settings</span>
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <Link
                                                to="/logout"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition text-rose-500"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaSignOutAlt className="mr-3" />
                                                <span>Logout</span>
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/login"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaSignInAlt className="mr-3 text-gray-500" />
                                                <span>Login</span>
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaUserPlus className="mr-3 text-gray-500" />
                                                <span>Register</span>
                                            </Link>
                                            <div className="border-t border-gray-100"></div>
                                            <Link
                                                to="/host"
                                                className="flex items-center px-4 py-3 hover:bg-gray-50 transition"
                                                onClick={() =>
                                                    setUserDropdownOpen(false)
                                                }
                                            >
                                                <FaPlus className="mr-3 text-gray-500" />
                                                <span>Become a Host</span>
                                            </Link>
                                        </>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Search Dropdown - Mobile & Desktop */}
            <AnimatePresence>
                {searchDropdownOpen && (
                    <motion.div
                        ref={searchDropdownRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-16 bg-white shadow-lg rounded-b-lg mx-0 p-4 z-50 border-t border-gray-100 overflow-hidden"
                    >
                        <form
                            onSubmit={handleSearchSubmit}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Location Fields */}
                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="address"
                                            placeholder="Address"
                                            value={searchParams.address}
                                            onChange={handleSearchChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            placeholder="City"
                                            value={searchParams.city}
                                            onChange={handleSearchChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>

                                {/* Other Fields */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Property title"
                                        value={searchParams.title}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Place Type
                                    </label>
                                    <select
                                        name="placeType"
                                        value={searchParams.placeType}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    >
                                        <option value="">Any type</option>
                                        <option value="Entire Place">
                                            Entire Place
                                        </option>
                                        <option value="Private Room">
                                            Private Room
                                        </option>
                                        <option value="Shared Room">
                                            Shared Room
                                        </option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Max Price
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-2 text-gray-500">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            name="pricePerNight"
                                            placeholder="Max price per night"
                                            value={searchParams.pricePerNight}
                                            onChange={handleSearchChange}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Guests
                                    </label>
                                    <input
                                        type="number"
                                        name="maxGuests"
                                        placeholder="Number of guests"
                                        value={searchParams.maxGuests}
                                        onChange={handleSearchChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setSearchDropdownOpen(false)}
                                    className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="bg-rose-500 text-white px-4 py-2 rounded-lg hover:bg-rose-600 transition flex items-center"
                                >
                                    <FaSearch className="mr-2" />
                                    Search
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
