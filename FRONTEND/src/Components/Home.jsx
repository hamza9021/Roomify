import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import axios from "axios";
// import Navbar from "./shared/navbar";
import Footer from "./shared/Footer";
const Home = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/v1/listings`);
                if (!response.data || !response.data.data) {
                    throw new Error("No data received from server");
                }

                setListings(response.data.data);
                toast.success("Data fetched successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        };

        fetchData();
    }, []);



    const handleAddToWishList = async (e) => {
        e.preventDefault();
        const listingId = e.currentTarget.getAttribute("data-listing-id");
        try {
            const response = await axios.post(`/api/v1/wishlist/${listingId}`);
            toast.success("Added to wishlist successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    return (
        <>
            {/* <Navbar /> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 p-4 mt-20">
                {listings.map((listing) => (
                    <Link to={`/listing/${listing._id}`} key={listing._id}>
                        <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group">
                            <div className="relative">
                                <img
                                    src={
                                        listing.photos?.[0] ||
                                        "/placeholder-airbnb.jpg"
                                    }
                                    alt={listing.title}
                                    className="w-full h-64 object-cover rounded-t-xl"
                                />
                                <button
                                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
                                    onClick={handleAddToWishList}
                                    data-listing-id={listing._id}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-gray-700"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                </button>
                                {/* </Link> */}
                            </div>

                            {/* Card Content */}
                            <div className="p-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                                            {listing.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            {listing.location.address}
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4 text-rose-500"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span className="text-gray-700 text-sm ml-1">
                                            {listing.rating?.averageRating?.toFixed(1) || "New"}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-3 text-gray-500 text-sm">
                                    <p>{listing.distance || "5 miles"} away</p>
                                    <p>
                                        {listing.availableDates || "Nov 12-17"}{" "}
                                        • ${listing.pricePerNight || "99"} night
                                    </p>
                                </div>

                                {/* Airbnb-like tags */}
                                {listing.tags && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {listing.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
            <Footer />
        </>
    );
};

export default Home;
