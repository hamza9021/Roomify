import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";

import {
    FiDroplet,
    FiUmbrella,
    FiUser,
    FiPocket,
    FiAlertTriangle,
    FiPlusSquare,
    FiThermometer,
    FiTv,
} from "react-icons/fi";
import { MdKitchen, MdLocalParking, MdPool } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";

const ListingDetail = () => {
    const [responseData, setResponseData] = useState(null);
    const { id } = useParams();
    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
        maptilersdk.config.apiKey = "JYHKuYzUBYh2Mj4qck6S"; // Move inside useEffect

        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/v1/listings/${id}`);
                if (!response.data) {
                    toast.error("No data received from server");
                    return;
                }
                setResponseData(response.data.data);
                toast.success("Data fetched successfully");
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        };

        fetchData();
    }, [id]);

    useEffect(() => {
        if (map.current || !responseData) return;

        map.current = new maptilersdk.Map({
            container: mapContainer.current,
            style: maptilersdk.MapStyle.STREETS,
            center: [
                responseData.longitude || 16.62662018,
                responseData.latitude || 49.2125578,
            ], // use listing coordinates if available
            zoom: 14,
        });

        // Add a marker if coordinates are available
        if (responseData.longitude && responseData.latitude) {
            new maptilersdk.Marker({ color: "#FF0000" })
                .setLngLat([responseData.longitude, responseData.latitude])
                .addTo(map.current);
        }

        // Cleanup function
        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [responseData]); // Re-run when responseData changes

    return (
        <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {responseData && (
                    <div className="space-y-8">
                        {/* Title and Location */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">
                                {responseData.title}
                            </h1>
                            <div className="flex items-center mt-2 text-gray-600">
                                <svg
                                    className="w-4 h-4 mr-1"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                {responseData.location}
                            </div>
                        </div>

                        {/* Main Photo */}
                        <div className="rounded-xl overflow-hidden">
                            <img
                                src={responseData.photos[0]}
                                alt={responseData.title}
                                className="w-full h-96 object-cover"
                            />
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="font-semibold text-lg mb-3">
                                    About this place
                                </h3>
                                <p className="text-gray-700">
                                    {responseData.description}
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="font-semibold text-lg mb-3">
                                    Details
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Price per night:
                                        </span>
                                        <span className="font-medium">
                                            ${responseData.pricePerNight}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Max Guests:
                                        </span>
                                        <span>{responseData.maxGuests}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Rooms:
                                        </span>
                                        <span>{responseData.rooms}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Beds:
                                        </span>
                                        <span>{responseData.beds}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Bathrooms:
                                        </span>
                                        <span>{responseData.bathrooms}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">
                                            Place Type:
                                        </span>
                                        <span>{responseData.placeType}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border">
                                <h3 className="font-semibold text-lg mb-3">
                                    Amenities
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {responseData.amenities.map(
                                        (amenity, idx) => {
                                            let icon, label;
                                            switch (amenity) {
                                                case "toilet_paper":
                                                    icon = (
                                                        <FiDroplet className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Toilet paper";
                                                    break;
                                                case "soap":
                                                    icon = (
                                                        <FiUmbrella className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Soap";
                                                    break;
                                                case "towels":
                                                    icon = (
                                                        <FiUser className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Towels";
                                                    break;
                                                case "pillows":
                                                    icon = (
                                                        <FiPocket className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Pillows";
                                                    break;
                                                case "linens":
                                                    icon = (
                                                        <GiWoodenChair className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Bed linens";
                                                    break;
                                                case "wifi":
                                                    icon = (
                                                        <CiWifiOn className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "WiFi";
                                                    break;
                                                case "kitchen":
                                                    icon = (
                                                        <MdKitchen className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Kitchen";
                                                    break;
                                                case "parking":
                                                    icon = (
                                                        <MdLocalParking className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Parking";
                                                    break;
                                                case "pool":
                                                    icon = (
                                                        <MdPool className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Pool";
                                                    break;
                                                case "tv":
                                                    icon = (
                                                        <FiTv className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "TV";
                                                    break;
                                                case "air_conditioning":
                                                    icon = (
                                                        <FiThermometer className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Air conditioning";
                                                    break;
                                                case "smoke_alarm":
                                                    icon = (
                                                        <FiAlertTriangle className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "Smoke alarm";
                                                    break;
                                                case "first_aid":
                                                    icon = (
                                                        <FiPlusSquare className="text-xl text-airbnb-pink" />
                                                    );
                                                    label = "First aid kit";
                                                    break;
                                                default:
                                                    return null;
                                            }

                                            return (
                                                <div
                                                    key={idx}
                                                    className="flex items-center space-x-2"
                                                >
                                                    {icon}
                                                    <span className="text-gray-700">
                                                        {label}
                                                    </span>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Host Card */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border">
                            <h2 className="text-2xl font-semibold mb-6">
                                About your host
                            </h2>
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-shrink-0">
                                    <img
                                        src={responseData.host.profileImage}
                                        alt={responseData.host.name}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-airbnb-pink"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <h3 className="text-xl font-semibold">
                                        {responseData.host.name}
                                    </h3>
                                    <p className="text-gray-600 mt-2">
                                        {responseData.host.bio ||
                                            "Experienced host with a passion for making guests feel at home. I love sharing local tips and ensuring your stay is comfortable and memorable."}
                                    </p>

                                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                                                Contact Email
                                            </h4>
                                            <p className="text-gray-800">
                                                {responseData.host.email}
                                            </p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-500 mb-1">
                                                Phone Number
                                            </h4>
                                            <p className="text-gray-800">
                                                {responseData.host.phoneNumber}
                                            </p>
                                        </div>
                                    </div>

                                    <button className="mt-6 px-6 py-3 bg-airbnb-pink text-white rounded-lg font-medium hover:bg-airbnb-pink-dark transition">
                                        Contact Host
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="map-container">
                <div
                    ref={mapContainer}
                    id="map"
                    style={{ width: "100%", height: "400px" }}
                />
            </div>
        </>
    );
};

export default ListingDetail;
