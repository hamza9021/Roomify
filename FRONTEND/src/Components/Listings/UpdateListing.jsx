import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
    FiHome,
    FiMapPin,
    FiUsers,
    FiDroplet,
    FiUmbrella,
    FiUser,
    FiPocket,
    FiAlertTriangle,
    FiPlus,
    FiThermometer,
    FiTv,
    FiWifi,
    FiEdit2,
    FiTrash2,
} from "react-icons/fi";
import { MdKitchen, MdLocalParking, MdPool } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
import Navbar from "../shared/navbar";

const UpdateListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        placeType: "",
        location: "",
        pricePerNight: "",
        maxGuests: "",
        rooms: "",
        beds: "",
        bathrooms: "",
        amenities: [],
        photos: [],
        unavailableDates: [],
        policies: "",
        tags: "",
        category: "",
    });

    useEffect(() => {
        const fetchListing = async () => {
            try {
                const response = await axios.get(`/api/v1/listings/${id}`);
                setFormData(response.data.data);
            } catch (error) {
                toast.error("Failed to load listing");
                console.error(error);
            }
        };
        fetchListing();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                        ? [...prev.amenities, value]
                        : prev.amenities.filter((item) => item !== value)
                    : value,
        }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({
            ...prev,
            photos: [...prev.photos, ...files],
        }));
    };

    const removePhoto = (index) => {
        setFormData((prev) => {
            const newPhotos = [...prev.photos];
            newPhotos.splice(index, 1);
            return { ...prev, photos: newPhotos };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "photos") {
                    formData.photos.forEach((photo) => {
                        form.append("photos", photo);
                    });
                } else if (Array.isArray(formData[key])) {
                    formData[key].forEach((item) => {
                        form.append(`${key}[]`, item);
                    });
                } else {
                    form.append(key, formData[key]);
                }
            });

            await axios.patch(`/api/v1/listings/${id}/update-listing`, form);
            toast.success("Listing updated successfully");
            navigate("/my-listings");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Failed to update listing"
            );
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const amenitiesList = [
        { value: "wifi", label: "WiFi", icon: <FiWifi /> },
        { value: "kitchen", label: "Kitchen", icon: <MdKitchen /> },
        { value: "parking", label: "Parking", icon: <MdLocalParking /> },
        { value: "pool", label: "Pool", icon: <MdPool /> },
        { value: "tv", label: "TV", icon: <FiTv /> },
        {
            value: "air_conditioning",
            label: "Air Conditioning",
            icon: <FiThermometer />,
        },
        { value: "toilet_paper", label: "Toilet Paper", icon: <FiDroplet /> },
        { value: "soap", label: "Soap", icon: <FiUmbrella /> },
        { value: "towels", label: "Towels", icon: <FiUser /> },
        { value: "pillows", label: "Pillows", icon: <FiPocket /> },
        { value: "linens", label: "Linens", icon: <GiWoodenChair /> },
        {
            value: "smoke_alarm",
            label: "Smoke Alarm",
            icon: <FiAlertTriangle />,
        },
    ];

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200">
                            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                                <FiEdit2 className="mr-2" /> Edit Your Listing
                            </h1>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="Beautiful beachfront villa"
                                            required
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiMapPin className="mr-1" />{" "}
                                            Location
                                        </label>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="City, Country"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                        placeholder="Describe your property in detail..."
                                        required
                                    />
                                </div>

                                {/* Place Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Place Type
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            "Entire Place",
                                            "Private Room",
                                            "Shared Room",
                                        ].map((type) => (
                                            <label
                                                key={type}
                                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${formData.placeType === type ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-200 hover:border-gray-300"}`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="placeType"
                                                    value={type}
                                                    checked={
                                                        formData.placeType ===
                                                        type
                                                    }
                                                    onChange={handleChange}
                                                    className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink mr-3"
                                                    required
                                                />
                                                <div>
                                                    <span className="block font-medium">
                                                        {type}
                                                    </span>
                                                    <span className="block text-xs text-gray-500">
                                                        {type === "Entire Place"
                                                            ? "Guests have the whole place to themselves"
                                                            : type ===
                                                                "Private Room"
                                                              ? "Guests have their own private room"
                                                              : "Guests share common spaces with others"}
                                                    </span>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Pricing Section */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Pricing
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Price Per Night */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Price Per Night ($)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">
                                                    $
                                                </span>
                                            </div>
                                            <input
                                                type="number"
                                                name="pricePerNight"
                                                value={formData.pricePerNight}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                                placeholder="0.00"
                                                min="1"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Accommodation Details */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Accommodation Details
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                    {/* Max Guests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiUsers className="mr-1" /> Max
                                            Guests
                                        </label>
                                        <input
                                            type="number"
                                            name="maxGuests"
                                            value={formData.maxGuests}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            min="1"
                                            required
                                        />
                                    </div>

                                    {/* Bedrooms */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bedrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="rooms"
                                            value={formData.rooms}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    {/* Beds */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Beds
                                        </label>
                                        <input
                                            type="number"
                                            name="beds"
                                            value={formData.beds}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            min="0"
                                            required
                                        />
                                    </div>

                                    {/* Bathrooms */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Bathrooms
                                        </label>
                                        <input
                                            type="number"
                                            name="bathrooms"
                                            value={formData.bathrooms}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            min="0"
                                            step="0.5"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Amenities
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {amenitiesList.map((amenity) => (
                                        <label
                                            key={amenity.value}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${formData.amenities.includes(amenity.value) ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-200 hover:border-gray-300"}`}
                                        >
                                            <input
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity.value}
                                                checked={formData.amenities.includes(
                                                    amenity.value
                                                )}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink mr-3"
                                            />
                                            <div className="flex items-center">
                                                <span className="text-lg mr-2">
                                                    {amenity.icon}
                                                </span>
                                                <span>{amenity.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Photos */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Photos
                                </h2>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Existing Photos */}
                                    {formData.photos.map((photo, index) =>
                                        typeof photo === "string" ? (
                                            <div
                                                key={index}
                                                className="relative group"
                                            >
                                                <img
                                                    src={photo}
                                                    alt={`Listing ${index}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removePhoto(index)
                                                    }
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        ) : null
                                    )}

                                    {/* Upload New Photos */}
                                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer hover:border-airbnb-pink transition-colors">
                                        <FiPlus className="text-gray-400 text-2xl mb-2" />
                                        <span className="text-sm text-gray-500">
                                            Add Photos
                                        </span>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Additional Information */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Additional Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Policies */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            House Rules & Policies
                                        </label>
                                        <textarea
                                            name="policies"
                                            value={formData.policies}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                            placeholder="Check-in/out times, pet policy, smoking policy, etc."
                                        />
                                    </div>

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Category
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                        >
                                            <option value="">
                                                Select a category
                                            </option>
                                            <option value="Beach">Beach</option>
                                            <option value="Mountain">
                                                Mountain
                                            </option>
                                            <option value="City">City</option>
                                            <option value="Countryside">
                                                Countryside
                                            </option>
                                            <option value="Lakefront">
                                                Lakefront
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors flex items-center"
                                >
                                    {loading ? (
                                        "Saving..."
                                    ) : (
                                        <>
                                            <FiEdit2 className="mr-2" /> Update
                                            Listing
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default UpdateListing;
