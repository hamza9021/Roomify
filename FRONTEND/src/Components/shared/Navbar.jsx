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
import { Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = () => {
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [wishlistDropdownOpen, setWishlistDropdownOpen] = useState(false);
    const userDropdownRef = useRef(null);
    const wishlistDropdownRef = useRef(null);

    const [user, setUser] = useState(null);
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState({
        user: true,
        wishlist: true,
    });

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
                axios
                    .get("/api/v1/users/get/profile")
                    .catch(() => ({ data: { data: null } })),
                axios
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

            await axios.delete(`/api/v1/wishlist/${listingId}`);
            toast.success("Removed from wishlist");

            const refreshResponse = await axios.get("/api/v1/wishlist");
            setWishlist(refreshResponse.data.data.listings || []);
        } catch (error) {
            const refreshResponse = await axios.get("/api/v1/wishlist");
            setWishlist(refreshResponse.data.data.listings || []);

            toast.error(
                error.response?.data?.message ||
                    "Failed to remove from wishlist"
            );
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 bg-white shadow-sm z-50">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link
                    to="/"
                    className="flex items-center text-rose-500 hover:text-rose-600 transition"
                >
                    <FaAirbnb className="text-3xl mr-1" />
                    <span className="text-xl font-bold hidden sm:inline">
                        Roomify
                    </span>
                </Link>

                {/* Search Bar - Medium screens and up */}
                <div className="hidden md:flex items-center justify-between border border-gray-300 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition duration-200">
                    <button className="font-medium px-3">Anywhere</button>
                    <span className="border-l h-5 border-gray-300"></span>
                    <button className="font-medium px-3">Any week</button>
                    <span className="border-l h-5 border-gray-300"></span>
                    <button className="text-gray-500 pl-3 pr-1">
                        Add guests
                    </button>
                    <button className="bg-rose-500 p-2 rounded-full text-white hover:bg-rose-600 transition">
                        <FaSearch className="text-sm" />
                    </button>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-4">
                    <Link
                        to="/host"
                        className="hidden md:flex items-center text-sm font-medium hover:bg-gray-100 px-4 py-2 rounded-full transition"
                    >
                        <FaPlus className="mr-2" />
                        Become a Host
                    </Link>

                    <button
                        className="hidden md:flex items-center justify-center p-2 hover:bg-gray-100 rounded-full transition"
                        aria-label="Language"
                    >
                        <FaGlobe />
                    </button>

                    {/* Wishlist Dropdown */}
                    <div className="relative" ref={wishlistDropdownRef}>
                        <button
                            className="p-2 hover:bg-gray-100 rounded-full transition relative"
                            onClick={() => {
                                setWishlistDropdownOpen(!wishlistDropdownOpen);
                                setUserDropdownOpen(false);
                            }}
                            aria-label="Wishlist"
                        >
                            <FaHeart className="text-lg text-gray-600" />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                                    {wishlist.length}
                                </span>
                            )}
                        </button>

                        {wishlistDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100 max-h-96 overflow-y-auto">
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
                                        <div
                                            key={item._id}
                                            className="group flex items-center px-4 py-3 hover:bg-gray-50 transition relative"
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
                                                <div className="relative w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0">
                                                    <img
                                                        src={
                                                            item.photos?.[0] ||
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
                                                        {item.location.address}
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
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-4 text-center text-gray-500">
                                        <FaHeart className="mx-auto text-gray-300 text-2xl mb-2" />
                                        <p>Your wishlist is empty</p>
                                        <Link
                                            to="/listings"
                                            className="text-rose-500 text-sm font-medium mt-2 inline-block hover:underline"
                                            onClick={() =>
                                                setWishlistDropdownOpen(false)
                                            }
                                        >
                                            Explore listings
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* User Dropdown */}
                    <div className="relative" ref={userDropdownRef}>
                        <div
                            className="flex items-center space-x-2 border border-gray-300 p-2 rounded-full hover:shadow-md transition cursor-pointer"
                            onClick={() => {
                                setUserDropdownOpen(!userDropdownOpen);
                                setWishlistDropdownOpen(false);
                            }}
                            aria-label="User menu"
                        >
                            <FaBars className="text-gray-600" />
                            {user ? (
                                <div className="w-8 h-8 rounded-full overflow-hidden">
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
                                <FaUserCircle className="text-gray-600 w-8 h-8" />
                            )}
                        </div>

                        {userDropdownOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-100">
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
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Search - Small screens */}
            <div className="md:hidden absolute bottom-0 left-0 right-0 flex justify-center pb-2">
                <Link
                    to="/search"
                    className="flex items-center border border-gray-300 rounded-full py-2 px-4 shadow-sm bg-white w-11/12"
                >
                    <FaSearch className="text-gray-500 mr-2" />
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">Anywhere</span>
                        <div className="flex text-xs text-gray-500">
                            <span>Any week</span>
                            <span className="mx-1">·</span>
                            <span>Add guests</span>
                        </div>
                    </div>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
