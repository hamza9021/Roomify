import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import Rating from "@mui/material/Rating";
import { ClipLoader } from "react-spinners";
import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangeCalendar } from "@mui/x-date-pickers-pro/DateRangeCalendar";
import Footer from "../shared/Footer";
import Navbar from "../shared/Navbar";

// Icons
import {
    FiDroplet,
    FiUmbrella,
    FiUser,
    FiPocket,
    FiAlertTriangle,
    FiPlusSquare,
    FiThermometer,
    FiTv,
    FiMapPin,
    FiCalendar,
    FiHome,
    FiUsers,
    FiStar,
    FiPlus,
    FiMinus,
    FiHeart,
    FiChevronDown,
    FiChevronUp,
    FiTrash2,
} from "react-icons/fi";
import { MdKitchen, MdLocalParking, MdPool } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
import { CiWifiOn } from "react-icons/ci";
import axiosInstance from "../../utils/axios.instance";

// Animation variants
const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
};

const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 },
};

const scaleUp = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
};

function DateRangeCalendarValue({
    onChange,
    initialStartDate,
    initialEndDate,
}) {
    const [value, setValue] = React.useState([
        initialStartDate ? dayjs(initialStartDate) : null,
        initialEndDate ? dayjs(initialEndDate) : null,
    ]);

    const handleChange = (newValue) => {
        setValue(newValue);
        if (newValue[0] && newValue[1]) {
            onChange({
                startDate: newValue[0].toDate(),
                endDate: newValue[1].toDate(),
            });
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="z-50">
                <DateRangeCalendar
                    value={value}
                    onChange={handleChange}
                    calendars={2}
                />
            </div>
        </LocalizationProvider>
    );
}

const ListingDetail = () => {
    // State management
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [reviewLoading, setReviewLoading] = useState(false);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [user, setUser] = useState(null);
    const [selectedDates, setSelectedDates] = useState({
        startDate: null,
        endDate: null,
    });
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [guests, setGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0,
    });
    const [showGuestPicker, setShowGuestPicker] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    // Router and refs
    const { id } = useParams();
    const mapContainer = useRef(null);
    const map = useRef(null);
    const guestPickerRef = useRef(null);
    const descriptionRef = useRef(null);
    const [showReadMore, setShowReadMore] = useState(false);

    // Check if description is long enough to need "Read more"
    useEffect(() => {
        if (descriptionRef.current && listing?.description) {
            const lineHeight = parseInt(
                window.getComputedStyle(descriptionRef.current).lineHeight
            );
            const descriptionHeight = descriptionRef.current.clientHeight;
            const lines = descriptionHeight / lineHeight;
            setShowReadMore(lines > 5);
        }
    }, [listing]);

    // Close guest picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                guestPickerRef.current &&
                !guestPickerRef.current.contains(event.target)
            ) {
                setShowGuestPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Fetch current user profile
    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const response = await axiosInstance.get(
                    "/api/v1/users/get/profile"
                );
                setUser(response.data.data);
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    // Fetch listing data
    useEffect(() => {
        const fetchListing = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(
                    `/api/v1/listings/${id}`
                );
                if (!response.data) {
                    toast.error("No data received from server");
                    return;
                }
                setListing(response.data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchListing();
    }, [id]);

    // Map Initialization
    useEffect(() => {
        if (map.current || !listing) return;

        maptilersdk.config.apiKey = "JYHKuYzUBYh2Mj4qck6S";

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [
                listing.location.coordinates.longitude || 16.62662018,
                listing.location.coordinates.latitude || 49.2125578,
            ],
            zoom: 14,
        });

        if (
            listing.location.coordinates.latitude &&
            listing.location.coordinates.longitude
        ) {
            new maptilersdk.Marker({ color: "#FF0000" })
                .setLngLat([
                    listing.location.coordinates.longitude,
                    listing.location.coordinates.latitude,
                ])
                .addTo(map.current);
        }

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [listing]);

    // Handle booking date change
    const handleDateChange = (dates) => {
        setSelectedDates(dates);
        setShowDatePicker(false);
    };

    // Handle guest count changes
    const handleGuestChange = (type, operation) => {
        setGuests((prev) => {
            const newValue =
                operation === "increase" ? prev[type] + 1 : prev[type] - 1;

            // Validation rules
            if (type === "adults" && newValue < 1) return prev;
            if (type !== "adults" && newValue < 0) return prev;
            if (type === "adults" && newValue > 16) return prev;
            if (type === "children" && newValue > 5) return prev;
            if (type === "infants" && newValue > 5) return prev;

            return {
                ...prev,
                [type]: newValue,
            };
        });
    };

    // Calculate total guests
    const totalGuests = guests.adults + guests.children;

    const calculateTotalPrice = () => {
        if (!selectedDates.startDate || !selectedDates.endDate)
            return listing.pricePerNight;

        const diffTime = Math.abs(
            selectedDates.endDate - selectedDates.startDate
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays * listing.pricePerNight + 10 * totalGuests + 50 + 25;
    };

    const totalDays = () => {
        if (!selectedDates.startDate || !selectedDates.endDate) return 0;

        const diffTime = Math.abs(
            selectedDates.endDate - selectedDates.startDate
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleReserveButton = async () => {
        try {
            const response = await axiosInstance.post(
                `/api/v1/booking/${id}/create-booking`,
                {
                    checkInDate: selectedDates.startDate,
                    checkOutDate: selectedDates.endDate,
                    Guests: guests,
                    totalPrice: calculateTotalPrice(),
                }
            );
            toast.success("Booking created successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const handleReviewSubmit = async () => {
        if (!comment.trim()) {
            toast.error("Please enter a comment");
            return;
        }

        setReviewLoading(true);
        try {
            const response = await axiosInstance.post(
                `/api/v1/reviews/${id}/create-review`,
                { rating, comment }
            );
            if (response) {
                toast.success("Review submitted successfully");
                setComment("");
                setRating(5);
                const updatedListing = await axiosInstance.get(
                    `/api/v1/listings/${id}`
                );
                setListing(updatedListing.data.data);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setReviewLoading(false);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        setReviewLoading(true);
        try {
            await axiosInstance.delete(
                `/api/v1/reviews/${id}/${reviewId}/delete-review`
            );
            toast.success("Review deleted successfully");
            const updatedListing = await axiosInstance.get(
                `/api/v1/listings/${id}`
            );
            setListing(updatedListing.data.data);
            setShowDeleteConfirm(null);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setReviewLoading(false);
        }
    };

    const getAmenityIcon = (amenity) => {
        switch (amenity) {
            case "toilet_paper":
                return <FiDroplet className="text-xl text-black" />;
            case "soap":
                return <FiUmbrella className="text-xl text-black" />;
            case "towels":
                return <FiUser className="text-xl text-black" />;
            case "pillows":
                return <FiPocket className="text-xl text-black" />;
            case "linens":
                return <GiWoodenChair className="text-xl text-black" />;
            case "wifi":
                return <CiWifiOn className="text-xl text-black" />;
            case "kitchen":
                return <MdKitchen className="text-xl text-black" />;
            case "parking":
                return <MdLocalParking className="text-xl text-black" />;
            case "pool":
                return <MdPool className="text-xl text-black" />;
            case "tv":
                return <FiTv className="text-xl text-black" />;
            case "air_conditioning":
                return <FiThermometer className="text-xl text-black" />;
            case "smoke_alarm":
                return <FiAlertTriangle className="text-xl text-black" />;
            case "first_aid":
                return <FiPlusSquare className="text-xl text-black" />;
            default:
                return null;
        }
    };

    const getAmenityLabel = (amenity) => {
        const labels = {
            toilet_paper: "Toilet paper",
            soap: "Soap",
            towels: "Towels",
            pillows: "Pillows",
            linens: "Bed linens",
            wifi: "WiFi",
            kitchen: "Kitchen",
            parking: "Parking",
            pool: "Pool",
            tv: "TV",
            air_conditioning: "Air conditioning",
            smoke_alarm: "Smoke alarm",
            first_aid: "First aid kit",
        };
        return labels[amenity] || amenity;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader color="#FF5A5F" size={50} />
            </div>
        );
    }

    if (!listing) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-500">No listing found</p>
            </div>
        );
    }

    return (
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-10">
            <Navbar />

            {/* Header Section */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.5 }}
                className="mb-8 flex flex-col sm:flex-row justify-between items-start gap-4"
            >
                <div>
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        {listing.title}
                    </h1>
                    <div className="flex items-center mt-2 text-gray-600">
                        <FiMapPin className="w-5 h-5 mr-2" />
                        <span className="text-base sm:text-lg">
                            {listing.location.address}
                        </span>
                    </div>
                </div>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full hover:bg-gray-100 self-end sm:self-auto"
                >
                    <FiHeart
                        className={`w-6 h-6 ${isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-600"}`}
                    />
                </motion.button>
            </motion.div>

            {/* Image Gallery */}
            <motion.div
                initial="hidden"
                animate="visible"
                variants={slideUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-8 rounded-xl overflow-hidden"
            >
                <div className="md:col-span-2 row-span-2">
                    <img
                        src={listing.photos[0]}
                        alt={listing.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                {listing.photos.slice(1, 5).map((photo, index) => (
                    <div key={index}>
                        <img
                            src={photo}
                            alt={`${listing.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Listing Details */}
                <div className="lg:col-span-2">
                    {/* About Section */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="mb-12 pb-8 border-b border-gray-200"
                    >
                        <div className="flex flex-col md:flex-row md:items-start gap-8">
                            <div className="flex-1">
                                <h2 className="text-2xl font-semibold mb-4">
                                    About this place
                                </h2>
                                <div className="relative">
                                    <p
                                        ref={descriptionRef}
                                        className={`text-gray-700 leading-relaxed whitespace-pre-line ${showFullDescription ? "" : "line-clamp-5"}`}
                                    >
                                        {listing.description}
                                    </p>
                                    {showReadMore && (
                                        <button
                                            onClick={() =>
                                                setShowFullDescription(
                                                    !showFullDescription
                                                )
                                            }
                                            className="text-rose-500 hover:text-rose-700 font-medium mt-2 flex items-center"
                                        >
                                            {showFullDescription ? (
                                                <>
                                                    Show less{" "}
                                                    <FiChevronUp className="ml-1" />
                                                </>
                                            ) : (
                                                <>
                                                    Read more{" "}
                                                    <FiChevronDown className="ml-1" />
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="hidden md:block w-64">
                                <div className="p-6 border border-gray-200 rounded-xl">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <FiHome className="text-2xl text-rose-500" />
                                        <div>
                                            <h3 className="font-medium">
                                                Entire home
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                You'll have the place to
                                                yourself
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <FiUsers className="text-2xl text-rose-500" />
                                        <div>
                                            <h3 className="font-medium">
                                                Enhanced cleaning
                                            </h3>
                                            <p className="text-gray-500 text-sm">
                                                This host committed to Airbnb's
                                                cleaning process
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Amenities Section */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mb-12 pb-8 border-b border-gray-200"
                    >
                        <h2 className="text-2xl font-semibold mb-6">
                            What this place offers
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {listing.amenities.map((amenity, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 5 }}
                                    className="flex items-center space-x-3"
                                >
                                    {getAmenityIcon(amenity)}
                                    <span className="text-gray-700">
                                        {getAmenityLabel(amenity)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Reviews Section */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mb-12 pb-8 border-b border-gray-200"
                    >
                        <h2 className="text-2xl font-semibold mb-6 flex items-center">
                            <FiStar className="mr-2 text-rose-500" />
                            {listing.rating?.averageRating?.toFixed(1) ||
                                listing.averageRating?.toFixed(1) ||
                                "New"}{" "}
                            · {listing.reviews?.length || 0} reviews
                        </h2>

                        {/* Review Form */}
                        {user && (
                            <motion.div
                                whileHover={{ scale: 1.01 }}
                                className="mb-8 p-6 bg-gray-50 rounded-xl"
                            >
                                <h3 className="text-lg font-medium mb-4">
                                    Write a Review
                                </h3>
                                <Rating
                                    value={rating}
                                    onChange={(event, newValue) =>
                                        setRating(newValue)
                                    }
                                    precision={1}
                                    className="mb-4"
                                />
                                <textarea
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-4"
                                    rows="4"
                                    placeholder="Share your experience..."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleReviewSubmit}
                                    disabled={reviewLoading}
                                    className="px-6 py-3 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition disabled:opacity-50 flex items-center"
                                >
                                    {reviewLoading ? (
                                        <>
                                            <ClipLoader
                                                color="white"
                                                size={20}
                                                className="mr-2"
                                            />
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Review"
                                    )}
                                </motion.button>
                            </motion.div>
                        )}

                        {/* Reviews List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {listing.reviews?.length > 0 ? (
                                listing.reviews.map((review) => (
                                    <motion.div
                                        key={review._id}
                                        initial="hidden"
                                        animate="visible"
                                        variants={fadeIn}
                                        className="border-b border-gray-200 pb-8"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start space-x-4">
                                                <img
                                                    src={
                                                        review.user.profileImage
                                                    }
                                                    alt={review.user.name}
                                                    className="w-10 h-10 rounded-full"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start">
                                                        <h4 className="font-bold text-sm">
                                                            {review.user.name}
                                                        </h4>
                                                        {user &&
                                                            (user._id ===
                                                                review.user
                                                                    ._id ||
                                                                user.role ===
                                                                    "admin") && (
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() =>
                                                                            setShowDeleteConfirm(
                                                                                review._id
                                                                            )
                                                                        }
                                                                        className="text-gray-400 hover:text-rose-500 transition"
                                                                        disabled={
                                                                            reviewLoading
                                                                        }
                                                                    >
                                                                        <FiTrash2 className="w-4 h-4" />
                                                                    </button>
                                                                    <AnimatePresence>
                                                                        {showDeleteConfirm ===
                                                                            review._id && (
                                                                            <motion.div
                                                                                initial="hidden"
                                                                                animate="visible"
                                                                                exit="exit"
                                                                                variants={
                                                                                    scaleUp
                                                                                }
                                                                                className="absolute right-0 top-6 bg-white p-2 rounded shadow-lg border border-gray-200 z-10"
                                                                            >
                                                                                <p className="text-xs text-gray-600 mb-2">
                                                                                    Delete
                                                                                    this
                                                                                    review?
                                                                                </p>
                                                                                <div className="flex space-x-2">
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            handleDeleteReview(
                                                                                                review._id
                                                                                            )
                                                                                        }
                                                                                        className="px-2 py-1 text-xs bg-rose-500 text-white rounded hover:bg-rose-600"
                                                                                    >
                                                                                        Yes
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            setShowDeleteConfirm(
                                                                                                null
                                                                                            )
                                                                                        }
                                                                                        className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                                                                                    >
                                                                                        No
                                                                                    </button>
                                                                                </div>
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            )}
                                                    </div>
                                                    <div className="flex items-center text-xs text-gray-500 mb-1">
                                                        <span>
                                                            {new Date(
                                                                review.createdAt
                                                            ).toLocaleDateString(
                                                                "en-US",
                                                                {
                                                                    year: "numeric",
                                                                    month: "short",
                                                                    day: "numeric",
                                                                }
                                                            )}
                                                        </span>
                                                        <span className="mx-1">
                                                            ·
                                                        </span>
                                                        <span>
                                                            Stayed 1 night
                                                        </span>
                                                    </div>
                                                    <Rating
                                                        value={review.rating}
                                                        precision={0.5}
                                                        readOnly
                                                        size="small"
                                                        className="mb-1"
                                                    />
                                                    <p className="text-gray-700 text-sm">
                                                        {review.comment}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <p className="text-gray-500">
                                    No reviews yet. Be the first to review!
                                </p>
                            )}
                        </div>
                    </motion.section>

                    {/* Host Section */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mb-12"
                    >
                        <div className="flex flex-col sm:flex-row items-start gap-6">
                            <motion.img
                                whileHover={{ scale: 1.05 }}
                                src={listing.host.profileImage}
                                alt={listing.host.name}
                                className="w-14 h-14 rounded-full object-cover border-2 border-rose-500"
                            />
                            <div className="flex-1">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div>
                                        <h2 className="text-xl font-semibold mb-1">
                                            Hosted by {listing.host.name}
                                        </h2>
                                        <p className="text-gray-600 text-sm mb-2">
                                            Joined in{" "}
                                            {new Date(
                                                listing.host.createdAt
                                            ).getFullYear()}
                                        </p>
                                    </div>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-4 py-1 border border-gray-300 rounded-lg text-sm font-medium hover:border-gray-400 transition"
                                    >
                                        Contact
                                    </motion.button>
                                </div>
                                <div className="flex flex-wrap gap-4 mb-3">
                                    <div className="flex items-center text-sm">
                                        <FiStar className="text-rose-500 mr-1" />
                                        <span>
                                            {listing.host.ratingCount || 0}{" "}
                                            reviews
                                        </span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <FiUser className="text-rose-500 mr-1" />
                                        <span>Verified</span>
                                    </div>
                                </div>
                                <p className="text-gray-700 text-sm mb-3">
                                    {listing.host.bio ||
                                        "Experienced host with a passion for hospitality."}
                                </p>
                            </div>
                        </div>
                    </motion.section>

                    {/* Map Section */}
                    <motion.section
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="mb-12"
                    >
                        <h2 className="text-2xl font-semibold mb-4">
                            Where you'll be
                        </h2>
                        <div
                            ref={mapContainer}
                            className="w-full h-80 sm:h-96 rounded-xl overflow-hidden"
                        />
                        <p className="mt-4 text-gray-700">
                            {listing.location.address}
                        </p>
                    </motion.section>
                </div>

                {/* Right Column - Sticky Booking Card */}
                <div className="relative">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideUp}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="sticky top-6"
                    >
                        <div className="border border-gray-200 rounded-xl shadow-lg p-4 w-full sm:w-80">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold">
                                    ${listing.pricePerNight}{" "}
                                    <span className="text-gray-600 font-normal">
                                        night
                                    </span>
                                </h3>
                                <div className="flex items-center">
                                    <FiStar className="text-rose-500 mr-1" />
                                    <span className="font-medium">
                                        {listing.rating?.averageRating?.toFixed(
                                            1
                                        ) ||
                                            listing.averageRating?.toFixed(1) ||
                                            "New"}
                                    </span>
                                    <span className="text-gray-500 ml-1">
                                        ({listing.reviews?.length || 0})
                                    </span>
                                </div>
                            </div>

                            {/* Date Picker */}
                            <div className="mb-4">
                                <div className="grid grid-cols-2 gap-2">
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-gray-400 transition"
                                        onClick={() => setShowDatePicker(true)}
                                    >
                                        <div className="text-xs font-medium text-gray-500">
                                            CHECK-IN
                                        </div>
                                        <div className="font-medium text-sm">
                                            {selectedDates.startDate ? (
                                                selectedDates.startDate.toLocaleDateString()
                                            ) : (
                                                <span className="text-gray-400">
                                                    Add date
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                    <motion.div
                                        whileHover={{ scale: 1.02 }}
                                        className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-gray-400 transition"
                                        onClick={() => setShowDatePicker(true)}
                                    >
                                        <div className="text-xs font-medium text-gray-500">
                                            CHECKOUT
                                        </div>
                                        <div className="font-medium text-sm">
                                            {selectedDates.endDate ? (
                                                selectedDates.endDate.toLocaleDateString()
                                            ) : (
                                                <span className="text-gray-400">
                                                    Add date
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>

                            {/* Guest Picker */}
                            <div className="mb-4 relative">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    className="border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-gray-400 transition"
                                    onClick={() =>
                                        setShowGuestPicker(!showGuestPicker)
                                    }
                                >
                                    <div className="text-xs font-medium text-gray-500">
                                        GUESTS
                                    </div>
                                    <div className="font-medium text-sm">
                                        {totalGuests === 1
                                            ? "1 guest"
                                            : `${totalGuests} guests`}
                                        {guests.infants > 0 &&
                                            `, ${guests.infants} infant${guests.infants > 1 ? "s" : ""}`}
                                    </div>
                                </motion.div>

                                <AnimatePresence>
                                    {showGuestPicker && (
                                        <motion.div
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            variants={scaleUp}
                                            ref={guestPickerRef}
                                            className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4"
                                        >
                                            <div className="flex justify-between items-center py-3">
                                                <div>
                                                    <h4 className="font-medium text-sm">
                                                        Adults
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Ages 13+
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "adults",
                                                                "decrease"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.adults <= 1
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.adults <= 1 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiMinus className="text-sm" />
                                                    </motion.button>
                                                    <span className="w-6 text-center text-sm">
                                                        {guests.adults}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "adults",
                                                                "increase"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.adults >= 16
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.adults >= 16 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiPlus className="text-sm" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                                <div>
                                                    <h4 className="font-medium text-sm">
                                                        Children
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Ages 2-12
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "children",
                                                                "decrease"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.children <= 0
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.children <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiMinus className="text-sm" />
                                                    </motion.button>
                                                    <span className="w-6 text-center text-sm">
                                                        {guests.children}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "children",
                                                                "increase"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.children >= 5
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.children >= 5 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiPlus className="text-sm" />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-center py-3 border-t border-gray-200">
                                                <div>
                                                    <h4 className="font-medium text-sm">
                                                        Infants
                                                    </h4>
                                                    <p className="text-xs text-gray-500">
                                                        Under 2
                                                    </p>
                                                </div>
                                                <div className="flex items-center space-x-3">
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "infants",
                                                                "decrease"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.infants <= 0
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.infants <= 0 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiMinus className="text-sm" />
                                                    </motion.button>
                                                    <span className="w-6 text-center text-sm">
                                                        {guests.infants}
                                                    </span>
                                                    <motion.button
                                                        whileHover={{
                                                            scale: 1.1,
                                                        }}
                                                        whileTap={{
                                                            scale: 0.9,
                                                        }}
                                                        onClick={() =>
                                                            handleGuestChange(
                                                                "infants",
                                                                "increase"
                                                            )
                                                        }
                                                        disabled={
                                                            guests.infants >= 5
                                                        }
                                                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${guests.infants >= 5 ? "border-gray-200 text-gray-300" : "border-gray-400 text-gray-700"}`}
                                                    >
                                                        <FiPlus className="text-sm" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 mb-3"
                                disabled={
                                    !selectedDates.startDate ||
                                    !selectedDates.endDate
                                }
                                onClick={handleReserveButton}
                            >
                                Reserve
                            </motion.button>

                            <div className="text-center text-xs text-gray-500 mb-3">
                                You won't be charged yet
                            </div>

                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        ${listing.pricePerNight} x {totalDays()}
                                    </span>
                                    <span>
                                        ${listing.pricePerNight * totalDays()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Cleaning fee
                                    </span>
                                    <span>$50</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        Service fee
                                    </span>
                                    <span>$25</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">
                                        One Guest Cost
                                    </span>
                                    <span>$10</span>
                                </div>
                                <div className="border-t border-gray-200 pt-2 flex justify-between font-bold mt-2">
                                    <span>Total</span>
                                    <span>${calculateTotalPrice()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Date Picker Modal */}
            <AnimatePresence>
                {showDatePicker && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                        >
                            <DateRangeCalendarValue
                                onChange={handleDateChange}
                                initialStartDate={selectedDates.startDate}
                                initialEndDate={selectedDates.endDate}
                            />
                            <div className="flex justify-end mt-4">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDatePicker(false)}
                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition mr-2"
                                >
                                    Cancel
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowDatePicker(false)}
                                    className="px-4 py-2 bg-rose-500 text-white rounded-lg font-medium hover:bg-rose-600 transition"
                                >
                                    Confirm Dates
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
};

export default ListingDetail;
