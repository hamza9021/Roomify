import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiHeart, FiStar, FiMapPin, FiUsers } from "react-icons/fi";

import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import axiosInstance from "../utils/axios.instance";

import CategorySlider from "../utils/CategorySlider";

const Home = () => {
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();

    const getSearchParams = () => ({
        title: searchParams.get("title") || "",
        address: searchParams.get("address") || "",
        city: searchParams.get("city") || "",
        pricePerNight: searchParams.get("pricePerNight") || "",
        maxGuests: searchParams.get("maxGuests") || "",
        placeType: searchParams.get("placeType") || "",
        category: searchParams.get("category") || "",
    });

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const params = getSearchParams();
                const hasSearchParams = Object.values(params).some(
                    (val) => val !== ""
                );
                
                let endpoint = `/api/v1/listings`;
                if(hasSearchParams){
                    endpoint = `${endpoint}/search`;
                }else if(searchParams.get(`category`)){
                    endpoint = `/api/v1/listings/category`;
                }
                const { data } = await axiosInstance.get(endpoint, { params });

                if (!data?.data) {
                    throw new Error("No data received from server");
                }

                setListings(data.data);
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
                setListings([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchListings();
    }, [searchParams]); // Only searchParams as dependency

    const handleAddToWishList = async (e, listingId) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await axiosInstance.post(`/api/v1/wishlist/${listingId}`);
            toast.success("Added to wishlist successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const cardVariants = {
        hidden: { 
            opacity: 0, 
            y: 50,
            scale: 0.9,
        },
        visible: { 
            opacity: 1, 
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
        hover: {
            y: -8,
            scale: 1.02,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 10,
            },
        },
    };

    const heartVariants = {
        initial: { scale: 1 },
        hover: { scale: 1.2 },
        tap: { scale: 0.9 },
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen flex justify-center items-center">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-16 h-16 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto mb-4"
                        />
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-secondary-600 font-medium"
                        >
                            Finding amazing places for you...
                        </motion.p>
                    </motion.div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen"
            >
                <div className="container mx-auto px-4 pt-24 pb-12">
                    {/* Hero Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-center mb-12"
                    >
                        <h1 className="font-display text-4xl md:text-6xl font-bold gradient-text mb-4">
                            Find Your Perfect Stay
                        </h1>
                        <p className="text-secondary-600 text-lg md:text-xl max-w-2xl mx-auto">
                            Discover unique accommodations around the world, from cozy apartments to luxury villas
                        </p>
                    </motion.div>

                    {/* Category Slider */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="mb-12"
                    >
                        <CategorySlider/>
                    </motion.div>

                    {/* Listings Grid */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8"
                    >
                        <AnimatePresence>
                            {listings.length > 0 ? (
                                listings.map((listing, index) => (
                                    <motion.div
                                        key={listing._id}
                                        variants={cardVariants}
                                        whileHover="hover"
                                        layout
                                        className="group"
                                    >
                                        <Link
                                            to={`/listing/${listing._id}`}
                                            className="block h-full"
                                        >
                                            <div className="card card-hover h-full flex flex-col overflow-hidden">
                                                <div className="relative flex-grow">
                                                    <motion.img
                                                        src={
                                                            listing.photos?.[0] ||
                                                            "/placeholder-airbnb.jpg"
                                                        }
                                                        alt={listing.title}
                                                        className="w-full h-64 object-cover"
                                                        loading="lazy"
                                                        whileHover={{ scale: 1.05 }}
                                                        transition={{ duration: 0.3 }}
                                                    />
                                                    
                                                    {/* Gradient overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    
                                                    {/* Wishlist button */}
                                                    <motion.button
                                                        variants={heartVariants}
                                                        initial="initial"
                                                        whileHover="hover"
                                                        whileTap="tap"
                                                        className="absolute top-4 right-4 p-2 rounded-full glass backdrop-blur-md hover:bg-white/20 transition-all duration-200 group"
                                                        onClick={(e) =>
                                                            handleAddToWishList(
                                                                e,
                                                                listing._id
                                                            )
                                                        }
                                                    >
                                                        <FiHeart className="w-5 h-5 text-white group-hover:text-primary-500 transition-colors duration-200" />
                                                    </motion.button>

                                                    {/* Price badge */}
                                                    <div className="absolute bottom-4 left-4">
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: index * 0.1 }}
                                                            className="glass backdrop-blur-md rounded-full px-3 py-1"
                                                        >
                                                            <span className="text-white font-semibold text-sm">
                                                                ${listing.pricePerNight || "N/A"}/night
                                                            </span>
                                                        </motion.div>
                                                    </div>
                                                </div>

                                                <div className="p-6 flex flex-col flex-grow">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-display text-lg font-semibold text-secondary-900 truncate flex-1 mr-2">
                                                            {listing.title}
                                                        </h3>
                                                        <div className="flex items-center bg-secondary-100 rounded-full px-2 py-1">
                                                            <FiStar className="w-3 h-3 text-primary-500 mr-1" />
                                                            <span className="text-secondary-700 text-sm font-medium">
                                                                {listing.rating?.averageRating?.toFixed(1) || "New"}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center text-secondary-500 text-sm mb-3">
                                                        <FiMapPin className="w-4 h-4 mr-1" />
                                                        <span className="truncate">
                                                            {listing.location?.address || "Address not specified"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center text-secondary-500 text-sm mb-4">
                                                        <FiUsers className="w-4 h-4 mr-1" />
                                                        <span>
                                                            Up to {listing.maxGuests || "N/A"} guests
                                                        </span>
                                                    </div>

                                                    {listing.tags?.length > 0 && (
                                                        <div className="mt-auto flex flex-wrap gap-2">
                                                            {listing.tags
                                                                .slice(0, 2)
                                                                .map((tag, tagIndex) => (
                                                                    <motion.span
                                                                        key={tagIndex}
                                                                        initial={{ opacity: 0, scale: 0.8 }}
                                                                        animate={{ opacity: 1, scale: 1 }}
                                                                        transition={{ delay: (index * 0.1) + (tagIndex * 0.05) }}
                                                                        className="px-3 py-1 bg-gradient-to-r from-primary-100 to-accent-100 text-primary-700 text-xs rounded-full font-medium"
                                                                    >
                                                                        {tag}
                                                                    </motion.span>
                                                                ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="col-span-full text-center py-20"
                                >
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="text-6xl mb-6"
                                    >
                                        🏠
                                    </motion.div>
                                    <h3 className="font-display text-2xl font-semibold text-secondary-800 mb-2">
                                        No listings found
                                    </h3>
                                    <p className="text-secondary-500 text-lg">
                                        Try adjusting your search criteria or explore different categories
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </motion.div>
            <Footer />
        </>
    );
};

export default Home;
