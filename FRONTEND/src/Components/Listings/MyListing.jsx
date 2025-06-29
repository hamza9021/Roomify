import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../shared/navbar";
import {
    FiEdit,
    FiTrash2,
    FiEye,
    FiStar,
    FiMapPin,
    FiUsers,
    FiHome,
    FiPlus,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const MyListing = () => {
    const [listings, setListings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    "/api/v1/listings/host/listings"
                );
                setListings(response.data.data);
            } catch (error) {
                console.error("Error fetching listings:", error);
                toast.error("Failed to load listings");
            }
        };
        fetchData();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/v1/listings/${id}/delete-listing`);
            setListings(listings.filter((listing) => listing._id !== id));
            toast.success("Listing deleted successfully");
        } catch (error) {
            console.error("Error deleting listing:", error);
            toast.error("Failed to delete listing");
        }
    };

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                            <FiHome className="mr-2" /> My Listings
                        </h1>
                        <Link
                            to="/create/listing"
                            className="bg-airbnb-pink hover:bg-airbnb-pink-dark text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                        >
                            <FiPlus className="mr-2" /> Create New Listing
                        </Link>
                    </div>

                    {listings.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listings.map((listing) => (
                                <div
                                    key={listing._id}
                                    className="relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                                >
                                    {/* Image with hover overlay */}
                                    <div className="relative h-48 overflow-hidden">
                                        {listing.photos?.[0] ? (
                                            <>
                                                <img
                                                    src={listing.photos[0]}
                                                    alt={listing.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                                                    <div className="opacity-0 hover:opacity-100 flex space-x-4 transition-all duration-300">
                                                        <Link
                                                            to={`/update-listing/${listing._id}`}
                                                            className="bg-white p-2 rounded-full text-airbnb-pink hover:bg-airbnb-pink hover:text-white transition-colors"
                                                            title="Edit"
                                                        >
                                                            <FiEdit size={18} />
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    listing._id
                                                                )
                                                            }
                                                            className="bg-white p-2 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                                            title="Delete"
                                                        >
                                                            <FiTrash2
                                                                size={18}
                                                            />
                                                        </button>
                                                        <Link
                                                            to={`/listing/${listing._id}`}
                                                            className="bg-white p-2 rounded-full text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                                                            title="View"
                                                        >
                                                            <FiEye size={18} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <FiHome
                                                    size={48}
                                                    className="text-gray-400"
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Listing details */}
                                    <div className="p-4">
                                        <div className="flex justify-between items-start">
                                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                                {listing.title}
                                            </h3>
                                            <div className="flex items-center">
                                                <FiStar className="text-yellow-400 mr-1" />
                                                <span className="text-sm font-medium">
                                                    5.0
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center text-gray-600 text-sm mt-1">
                                            <FiMapPin
                                                className="mr-1"
                                                size={14}
                                            />
                                            <span className="truncate">
                                                {listing.location}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mt-3">
                                            <div className="flex items-center text-gray-600 text-sm">
                                                <FiUsers
                                                    className="mr-1"
                                                    size={14}
                                                />
                                                <span>
                                                    {listing.maxGuests} guests
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-500">
                                                    Price per night
                                                </p>
                                                <p className="font-semibold text-airbnb-pink">
                                                    ${listing.pricePerNight}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="absolute top-3 left-3 bg-white bg-opacity-90 px-2 py-1 rounded-full shadow-sm">
                                        <span className="text-xs font-medium text-green-600">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="mx-auto w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
                                <FiHome size={40} className="text-gray-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-700 mb-2">
                                No Listings Found
                            </h2>
                            <p className="text-gray-500 mb-6">
                                You haven't created any listings yet.
                            </p>
                            <Link
                                to="/create/listing"
                                className="inline-block bg-airbnb-pink hover:bg-airbnb-pink-dark text-white px-6 py-2 rounded-lg transition-colors"
                            >
                                Create Your First Listing
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default MyListing;
