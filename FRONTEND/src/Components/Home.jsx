import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";

import Navbar from "./shared/Navbar";
import Footer from "./shared/Footer";
import axiosInstance from "../utils/axios.instance";

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
    });

    useEffect(() => {
        const fetchListings = async () => {
            setIsLoading(true);
            try {
                const params = getSearchParams();
                const hasSearchParams = Object.values(params).some(
                    (val) => val !== ""
                );

                const endpoint = hasSearchParams
                    ? "/api/v1/listings/search"
                    : "/api/v1/listings";
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

    if (isLoading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="container mx-auto px-4 mt-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-8">
                    {listings.length > 0 ? (
                        listings.map((listing) => (
                            <Link
                                to={`/listing/${listing._id}`}
                                key={listing._id}
                                className="group"
                            >
                                <div className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                                    <div className="relative flex-grow">
                                        <img
                                            src={
                                                listing.photos?.[0] ||
                                                "/placeholder-airbnb.jpg"
                                            }
                                            alt={listing.title}
                                            className="w-full h-64 object-cover rounded-t-xl"
                                            loading="lazy"
                                        />
                                        <button
                                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors duration-200"
                                            onClick={(e) =>
                                                handleAddToWishList(
                                                    e,
                                                    listing._id
                                                )
                                            }
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 text-gray-700 hover:text-rose-500"
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
                                    </div>

                                    <div className="p-4 flex flex-col flex-grow">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {listing.title}
                                            </h3>
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
                                                    {listing.rating?.averageRating?.toFixed(
                                                        1
                                                    ) || "New"}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-gray-500 text-sm mb-2">
                                            {listing.location?.address ||
                                                "Address not specified"}
                                        </p>

                                        <div className="text-gray-500 text-sm mb-3">
                                            <p>
                                                {listing.distance
                                                    ? `${listing.distance} miles away`
                                                    : "Nearby"}
                                            </p>
                                            <p>
                                                {listing.availableDates ||
                                                    "Available dates not specified"}{" "}
                                                • $
                                                {listing.pricePerNight || "N/A"}{" "}
                                                night
                                            </p>
                                        </div>

                                        {listing.tags?.length > 0 && (
                                            <div className="mt-auto flex flex-wrap gap-2">
                                                {listing.tags
                                                    .slice(0, 3)
                                                    .map((tag, index) => (
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
                        ))
                    ) : (
                        <div className="col-span-full text-center py-16">
                            <h3 className="text-xl font-semibold text-gray-800">
                                No listings found
                            </h3>
                            <p className="text-gray-500 mt-2">
                                Try adjusting your search criteria
                            </p>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Home;
