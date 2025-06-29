import React, { useState } from "react";
import { CiWifiOn } from "react-icons/ci";
import Navbar from "../shared/navbar";
import { ClipLoader } from "react-spinners";
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

import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateListing = () => {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        placeType: "",
        host: "",
        location: "",
        pricePerNight: "",
        maxGuests: "",
        rooms: "",
        beds: "",
        bathrooms: "",
        amenities: [],
        unavailableDates: "",
        tags: "",
        category: "",
        photos: [],
    });

    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        console.log(files);

        if (type === "file") {
            const filesArray = Array.from(files);
            setFormData((prevData) => ({
                ...prevData,
                [name]: filesArray,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.photos || formData.photos.length === 0) {
            toast.error("Please upload at least one photo");
            return;
        }

        const form = new FormData();

        // Append all non-file fields
        form.append("title", formData.title);
        form.append("description", formData.description);
        form.append("placeType", formData.placeType);
        form.append("location", formData.location);
        form.append("pricePerNight", formData.pricePerNight);
        form.append("maxGuests", formData.maxGuests);
        form.append("rooms", formData.rooms);
        form.append("beds", formData.beds);
        form.append("bathrooms", formData.bathrooms);
        // form.append("unavailableDates", formData.unavailableDates);
        // form.append("tags", formData.tags);
        form.append("category", formData.category);

        // Special handling for arrays/objects
        if (formData.amenities) {
            formData.amenities.forEach((amenity) => {
                form.append("amenities[]", amenity);
            });
        }

        // Append each photo file individually
        formData.photos.forEach((file, index) => {
            form.append("photos", file); // Note: same field name for all files
        });

        try {
            setLoading(true);
            const response = await axios.post(
                "/api/v1/listings/create-listing",
                form,
                {
                    // Let the browser set the Content-Type header automatically
                    // It will include the boundary parameter
                }
            );
            setLoading(false);
            navigate("/host/listings");
            toast.success("Listing created successfully");
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
            toast.error(
                error.response?.data?.message ||
                    "An error occurred. Please try again."
            );
        }
    };

    return (
        <>
            <Navbar />
            <form id="listingForm" className="pt-24" onSubmit={handleSubmit}>
                {step === 1 && (
                    <>
                        <div className="max-w-4xl mx-auto p-8 bg-white rounded-xl shadow-md">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                                Create a new listing
                            </h2>

                            <div className="space-y-8">
                                {/* Title Section */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="title"
                                        className="block text-lg font-medium text-gray-700"
                                    >
                                        Title
                                    </label>
                                    <p className="text-gray-500 text-sm">
                                        Give your place a catchy title
                                    </p>
                                    <input
                                        id="title"
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                        placeholder="e.g., Beautiful beachfront villa with pool"
                                    />
                                </div>

                                {/* Description Section */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="description"
                                        className="block text-lg font-medium text-gray-700"
                                    >
                                        Description
                                    </label>
                                    <p className="text-gray-500 text-sm">
                                        Describe what makes your place special
                                    </p>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                        placeholder="Tell guests about your space, amenities, neighborhood..."
                                    />
                                </div>

                                {/* Place Type Section */}
                                <div className="space-y-4">
                                    <h4 className="text-lg font-medium text-gray-700">
                                        Place Type
                                    </h4>
                                    <p className="text-gray-500 text-sm">
                                        What kind of place are you listing?
                                    </p>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Entire Place Option */}
                                        <label
                                            htmlFor="entire place"
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.placeType === "Entire Place" ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-300 hover:border-gray-400"}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    id="entire place"
                                                    type="radio"
                                                    name="placeType"
                                                    value="Entire Place"
                                                    onChange={handleChange}
                                                    required
                                                    className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink"
                                                    checked={
                                                        formData.placeType ===
                                                        "Entire Place"
                                                    }
                                                />
                                                <div>
                                                    <span className="block font-medium text-gray-800">
                                                        Entire Place
                                                    </span>
                                                    <span className="block text-sm text-gray-500">
                                                        Guests have the whole
                                                        place to themselves
                                                    </span>
                                                </div>
                                            </div>
                                        </label>

                                        {/* Private Room Option */}
                                        <label
                                            htmlFor="private room"
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.placeType === "Private Room" ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-300 hover:border-gray-400"}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    id="private room"
                                                    type="radio"
                                                    name="placeType"
                                                    value="Private Room"
                                                    onChange={handleChange}
                                                    required
                                                    className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink"
                                                    checked={
                                                        formData.placeType ===
                                                        "Private Room"
                                                    }
                                                />
                                                <div>
                                                    <span className="block font-medium text-gray-800">
                                                        Private Room
                                                    </span>
                                                    <span className="block text-sm text-gray-500">
                                                        Guests have their own
                                                        room, but some areas may
                                                        be shared
                                                    </span>
                                                </div>
                                            </div>
                                        </label>

                                        {/* Shared Room Option */}
                                        <label
                                            htmlFor="shared room"
                                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.placeType === "Shared Room" ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-300 hover:border-gray-400"}`}
                                        >
                                            <div className="flex items-center space-x-3">
                                                <input
                                                    id="shared room"
                                                    type="radio"
                                                    name="placeType"
                                                    value="Shared Room"
                                                    onChange={handleChange}
                                                    required
                                                    className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink"
                                                    checked={
                                                        formData.placeType ===
                                                        "Shared Room"
                                                    }
                                                />
                                                <div>
                                                    <span className="block font-medium text-gray-800">
                                                        Shared Room
                                                    </span>
                                                    <span className="block text-sm text-gray-500">
                                                        Guests sleep in a room
                                                        or common area that may
                                                        be shared with others
                                                    </span>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <label htmlFor="location">Location:</label>
                        <input
                            id="location"
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="border border-gray-400"
                        />
                    </>
                )}

                {/* Price Section */}

                {step === 3 && (
                    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-start p-6 pt-12">
                        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Set Your Price
                            </h2>

                            <div className="space-y-6">
                                <div className="text-center">
                                    <label
                                        htmlFor="pricePerNight"
                                        className="block text-xl font-medium text-gray-700 mb-1"
                                    >
                                        Nightly Rate
                                    </label>
                                    <p className="text-gray-500">
                                        What will you charge per night?
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative w-full max-w-md">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                            <span className="text-gray-500 text-xl">
                                                $
                                            </span>
                                        </div>
                                        <input
                                            id="pricePerNight"
                                            type="number"
                                            name="pricePerNight"
                                            value={formData.pricePerNight}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            step="1"
                                            className="w-full py-4 pl-12 pr-16 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span className="text-gray-500 text-xl">
                                                USD
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-500 mt-2">
                                    <p>
                                        This is what you'll earn for each night
                                        before service fees
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Guest Section */}

                {step === 4 && (
                    <div className="flex-1 flex flex-col items-center justify-centerp-6">
                        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 mx-auto my-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                                Guest Capacity
                            </h2>

                            <div className="space-y-6">
                                <div className="text-center">
                                    <label
                                        htmlFor="maxGuests"
                                        className="block text-xl font-medium text-gray-700 mb-1"
                                    >
                                        Maximum Number of Guests
                                    </label>
                                    <p className="text-gray-500">
                                        How many guests can your place
                                        accommodate?
                                    </p>
                                </div>

                                <div className="flex justify-center">
                                    <div className="relative w-full max-w-md">
                                        <input
                                            id="maxGuests"
                                            type="number"
                                            name="maxGuests"
                                            value={formData.maxGuests}
                                            onChange={handleChange}
                                            required
                                            min="1"
                                            step="1"
                                            className="w-full py-4 px-6 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                            <span className="text-gray-500 text-xl">
                                                guests
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-center text-sm text-gray-500">
                                    <p>
                                        Include all guests, including infants
                                        and children
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/*  Room Configuration Section */}

                {step === 5 && (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
                        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md p-8 mx-auto my-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
                                Room Configuration
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Rooms Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="rooms"
                                        className="block text-lg font-medium text-gray-700"
                                    >
                                        Bedrooms
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="rooms"
                                            type="number"
                                            name="rooms"
                                            value={formData.rooms}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="1"
                                            className="w-full py-3 px-4 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-3 top-3 text-gray-500 text-xl">
                                            {formData.rooms === "1"
                                                ? "room"
                                                : "rooms"}
                                        </div>
                                    </div>
                                </div>

                                {/* Beds Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="beds"
                                        className="block text-lg font-medium text-gray-700"
                                    >
                                        Beds
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="beds"
                                            type="number"
                                            name="beds"
                                            value={formData.beds}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="1"
                                            className="w-full py-3 px-4 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-3 top-3 text-gray-500 text-xl">
                                            {formData.beds === "1"
                                                ? "bed"
                                                : "beds"}
                                        </div>
                                    </div>
                                </div>

                                {/* Bathrooms Input */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="bathrooms"
                                        className="block text-lg font-medium text-gray-700"
                                    >
                                        Bathrooms
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="bathrooms"
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.5"
                                            className="w-full py-3 px-4 text-xl border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="absolute right-3 top-3 text-gray-500 text-xl">
                                            {formData.bathrooms === "1"
                                                ? "bathroom"
                                                : "bathrooms"}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        Half baths can be entered as 0.5
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {step === 6 && (
                    <div className="flex-1 flex flex-col items-center justify-start bg-gray-50 p-6 pt-12">
                        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-8 mx-auto">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                                Amenities
                            </h2>

                            {/* Basic Amenities */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Basic Amenities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Toilet paper */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="toilet_paper"
                                            id="toilet_paper"
                                            checked={formData.amenities.includes(
                                                "toilet_paper"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="toilet_paper"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiDroplet className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Toilet paper
                                            </span>
                                        </label>
                                    </div>

                                    {/* Hand soap */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="soap"
                                            id="soap"
                                            checked={formData.amenities.includes(
                                                "soap"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="soap"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiUmbrella className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Hand and body soap
                                            </span>
                                        </label>
                                    </div>

                                    {/* Towels */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="towels"
                                            id="towels"
                                            checked={formData.amenities.includes(
                                                "towels"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="towels"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiUser className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                One towel per guest
                                            </span>
                                        </label>
                                    </div>

                                    {/* Pillows */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="pillows"
                                            id="pillows"
                                            checked={formData.amenities.includes(
                                                "pillows"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="pillows"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiPocket className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                One pillow per guest
                                            </span>
                                        </label>
                                    </div>

                                    {/* Linens */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="linens"
                                            id="linens"
                                            checked={formData.amenities.includes(
                                                "linens"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="linens"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <GiWoodenChair className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Linens for each bed
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Top Amenities */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Top Amenities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* WiFi */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="wifi"
                                            id="wifi"
                                            checked={formData.amenities.includes(
                                                "wifi"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="wifi"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <CiWifiOn className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                WiFi
                                            </span>
                                        </label>
                                    </div>

                                    {/* Kitchen */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="kitchen"
                                            id="kitchen"
                                            checked={formData.amenities.includes(
                                                "kitchen"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="kitchen"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <MdKitchen className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Kitchen
                                            </span>
                                        </label>
                                    </div>

                                    {/* Parking */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="parking"
                                            id="parking"
                                            checked={formData.amenities.includes(
                                                "parking"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="parking"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <MdLocalParking className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Free Parking
                                            </span>
                                        </label>
                                    </div>

                                    {/* Pool */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="pool"
                                            id="pool"
                                            checked={formData.amenities.includes(
                                                "pool"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="pool"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <MdPool className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Pool
                                            </span>
                                        </label>
                                    </div>

                                    {/* TV */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="tv"
                                            id="tv"
                                            checked={formData.amenities.includes(
                                                "tv"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="tv"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiTv className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                TV
                                            </span>
                                        </label>
                                    </div>

                                    {/* AC */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="air_conditioning"
                                            id="air_conditioning"
                                            checked={formData.amenities.includes(
                                                "air_conditioning"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="air_conditioning"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiThermometer className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Air Conditioning
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Safety Amenities */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                                    Safety Amenities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {/* Smoke alarm */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="smoke_alarm"
                                            id="smoke_alarm"
                                            checked={formData.amenities.includes(
                                                "smoke_alarm"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="smoke_alarm"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiAlertTriangle className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                Smoke alarm
                                            </span>
                                        </label>
                                    </div>

                                    {/* First aid */}
                                    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="amenities"
                                            value="first_aid"
                                            id="first_aid"
                                            checked={formData.amenities.includes(
                                                "first_aid"
                                            )}
                                            onChange={(e) => {
                                                const { value, checked } =
                                                    e.target;
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    amenities: checked
                                                        ? [
                                                              ...prev.amenities,
                                                              value,
                                                          ]
                                                        : prev.amenities.filter(
                                                              (item) =>
                                                                  item !== value
                                                          ),
                                                }));
                                            }}
                                            className="hidden peer"
                                        />
                                        <label
                                            htmlFor="first_aid"
                                            className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                                        >
                                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10">
                                                <FiPlusSquare className="text-xl peer-checked:text-airbnb-pink" />
                                            </div>
                                            <span className="font-medium">
                                                First aid kit
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 7 && (
                    <div className="flex flex-col items-center justify-center p-6">
                        <label className="block text-lg font-medium text-gray-700 mb-4">
                            Upload Property Photos (Multiple)
                        </label>
                        <input
                            type="file"
                            name="photos"
                            multiple
                            accept="image/*"
                            onChange={handleChange}
                            className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-airbnb-pink file:text-white
                hover:file:bg-airbnb-pink-dark"
                        />
                        {formData.photos.length > 0 && (
                            <div className="mt-4 text-sm text-gray-600">
                                Selected {formData.photos.length} file(s)
                            </div>
                        )}
                    </div>
                )}

                {step === 8 && (
                    <>
                        <label htmlFor="catogeroy">catogeroy :</label>
                        <input
                            id="catogeroy"
                            type="text"
                            name="catogeroy"
                            value={formData.catogeroy}
                            onChange={handleChange}
                            required
                            className="border border-gray-400"
                        />
                    </>
                )}

                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg">
                    <div className="max-w-4xl mx-auto flex justify-between items-center">
                        {step > 1 && step <= 8 && (
                            <button
                                onClick={() => setStep(step - 1)}
                                className="px-6 py-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Back
                            </button>
                        )}

                        {step >= 1 && step <= 7 ? (
                            <button
                                onClick={() => setStep(step + 1)}
                                className="ml-auto px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors"
                            >
                                Next
                            </button>
                        ) : (
                            step === 8 && (
                                <button
                                    type="submit"
                                    className="ml-auto px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ClipLoader color="#fff" size={20} />
                                    ) : (
                                        "Create listing"
                                    )}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </form>
        </>
    );
};

export default CreateListing;
