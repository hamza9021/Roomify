import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiHome, FiMapPin, FiUsers, FiDroplet, FiUmbrella, FiUser, FiPocket, 
         FiAlertTriangle, FiPlus, FiThermometer, FiTv, FiWifi, FiEdit2, FiTrash2 } from "react-icons/fi";
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
        let isMounted = true;
        const fetchListing = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/v1/listings/${id}`);
                if (isMounted) {
                    const listing = response.data.data;
                    
                    setFormData({
                        ...listing,
                        tags: listing.tags?.join(", ") || "",
                        photos: listing.photos || [],
                        amenities: listing.amenities || []
                    });
                }
            } catch (error) {
                if (isMounted) {
                    toast.error(error.response?.data?.message || "Failed to load listing");
                    console.error("Fetch error:", error);
                    navigate("/my-listings");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        fetchListing();
        
        return () => {
            isMounted = false;
            // Clean up object URLs
            formData.photos.forEach(photo => {
                if (typeof photo !== 'string') {
                    URL.revokeObjectURL(URL.createObjectURL(photo));
                }
            });
        };
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (type === "checkbox") {
            setFormData(prev => ({
                ...prev,
                amenities: checked
                    ? [...prev.amenities, value]
                    : prev.amenities.filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + formData.photos.length > 10) {
            toast.error("You can upload a maximum of 10 photos");
            return;
        }
        
        const validFiles = files.filter(file => {
            const isValidType = file.type.match("image.*");
            const isValidSize = file.size <= 5 * 1024 * 1024;
            
            if (!isValidType) {
                toast.error(`Invalid file type: ${file.name}. Only images are allowed.`);
                return false;
            }
            if (!isValidSize) {
                toast.error(`File too large: ${file.name}. Maximum size is 5MB.`);
                return false;
            }
            return true;
        });
        
        if (validFiles.length > 0) {
            setFormData(prev => ({
                ...prev,
                photos: [...prev.photos, ...validFiles]
            }));
        }
    };

    const removePhoto = (index) => {
        if (formData.photos.length <= 1) {
            toast.error("At least one photo is required");
            return;
        }
        
        const photoToRemove = formData.photos[index];
        
        setFormData(prev => {
            const newPhotos = [...prev.photos];
            newPhotos.splice(index, 1);
            return { ...prev, photos: newPhotos };
        });
        
        // Clean up object URL if it's not a string (i.e., a new file)
        if (typeof photoToRemove !== 'string') {
            URL.revokeObjectURL(URL.createObjectURL(photoToRemove));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const form = new FormData();
            
            // Append all fields
            Object.keys(formData).forEach(key => {
                if (key !== "photos") {
                    if (Array.isArray(formData[key])) {
                        // Handle array fields
                        formData[key].forEach(item => form.append(key, item));
                    } else {
                        form.append(key, formData[key]);
                    }
                }
            });
            
            // Separate existing photos (URLs) and new photos (Files)
            const existingPhotos = formData.photos
                .filter(photo => typeof photo === 'string')
                .map(photo => photo);
            
            const newPhotos = formData.photos
                .filter(photo => typeof photo !== 'string');
            
            // Append existing photos
            existingPhotos.forEach(photo => form.append('existingPhotos', photo));
            
            // Append new photos
            newPhotos.forEach(photo => form.append('photos', photo));
            
            const response = await axios.patch(
                `/api/v1/listings/${id}/update-listing`,
                form,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                }
            );
            
            toast.success("Listing updated successfully");
            navigate(`/listing/${id}`);
        } catch (error) {
            console.error("Update error:", error);
            toast.error(
                error.response?.data?.message || 
                error.message || 
                "Failed to update listing"
            );
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
        { value: "air_conditioning", label: "Air Conditioning", icon: <FiThermometer /> },
        { value: "toilet_paper", label: "Toilet Paper", icon: <FiDroplet /> },
        { value: "soap", label: "Soap", icon: <FiUmbrella /> },
        { value: "towels", label: "Towels", icon: <FiUser /> },
        { value: "pillows", label: "Pillows", icon: <FiPocket /> },
        { value: "linens", label: "Linens", icon: <GiWoodenChair /> },
        { value: "smoke_alarm", label: "Smoke Alarm", icon: <FiAlertTriangle /> },
    ];

    if (loading && !formData.title) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-airbnb-pink mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading listing details...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 pt-24 pb-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-airbnb-pink to-airbnb-pink-dark">
                            <h1 className="text-3xl font-bold text-white flex items-center">
                                <FiEdit2 className="mr-2" /> Edit Your Listing
                            </h1>
                            <p className="text-white opacity-90 mt-1">
                                Update your property details to attract more guests
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-8">
                            {/* Basic Information Section */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2 flex items-center">
                                    <FiHome className="mr-2" /> Basic Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Title */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Title*
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
                                            <FiMapPin className="mr-1" /> Location*
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
                                        Description*
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
                                    <p className="text-xs text-gray-500 mt-1">
                                        Tell guests what makes your place special
                                    </p>
                                </div>

                                {/* Place Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Place Type*
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {["Entire Place", "Private Room", "Shared Room"].map((type) => (
                                            <label
                                                key={type}
                                                className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                                    formData.placeType === type
                                                        ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10"
                                                        : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            >
                                                <input
                                                    type="radio"
                                                    name="placeType"
                                                    value={type}
                                                    checked={formData.placeType === type}
                                                    onChange={handleChange}
                                                    className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink mr-3"
                                                    required
                                                />
                                                <div>
                                                    <span className="block font-medium">{type}</span>
                                                    <span className="block text-xs text-gray-500">
                                                        {type === "Entire Place"
                                                            ? "Guests have the whole place to themselves"
                                                            : type === "Private Room"
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
                                            Price Per Night ($)*
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                name="pricePerNight"
                                                value={formData.pricePerNight}
                                                onChange={handleChange}
                                                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                                placeholder="0.00"
                                                min="1"
                                                step="0.01"
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

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    {/* Max Guests */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                                            <FiUsers className="mr-1" /> Max Guests*
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
                                            Bedrooms*
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
                                            Beds*
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
                                            Bathrooms*
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

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {amenitiesList.map((amenity) => (
                                        <label
                                            key={amenity.value}
                                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all ${
                                                formData.amenities.includes(amenity.value)
                                                    ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10"
                                                    : "border-gray-200 hover:border-gray-300"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                name="amenities"
                                                value={amenity.value}
                                                checked={formData.amenities.includes(amenity.value)}
                                                onChange={handleChange}
                                                className="h-5 w-5 text-airbnb-pink focus:ring-airbnb-pink mr-3"
                                            />
                                            <div className="flex items-center">
                                                <span className="text-lg mr-2">{amenity.icon}</span>
                                                <span>{amenity.label}</span>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Photos */}
                            <div className="space-y-6">
                                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                                    Photos*
                                </h2>
                                <p className="text-sm text-gray-500">
                                    Upload high-quality photos to showcase your space (minimum 1, maximum 10)
                                </p>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {/* Existing Photos */}
                                    {formData.photos.map((photo, index) => (
                                        <div key={index} className="relative group h-48">
                                            <img
                                                src={typeof photo === 'string' ? photo : URL.createObjectURL(photo)}
                                                alt={`Listing ${index}`}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removePhoto(index)}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                            >
                                                <FiTrash2 size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {/* Upload New Photos */}
                                    {formData.photos.length < 10 && (
                                        <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-48 cursor-pointer hover:border-airbnb-pink transition-colors">
                                            <div className="text-center p-4">
                                                <FiPlus className="text-gray-400 text-2xl mb-2 mx-auto" />
                                                <span className="block text-sm text-gray-500">
                                                    Add Photos
                                                </span>
                                                <span className="block text-xs text-gray-400 mt-1">
                                                    JPEG, PNG (max 5MB each)
                                                </span>
                                            </div>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/jpeg, image/png, image/webp"
                                                onChange={handlePhotoChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
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

                                    <div className="space-y-4">
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
                                                <option value="">Select a category</option>
                                                <option value="Beach">Beach</option>
                                                <option value="Mountain">Mountain</option>
                                                <option value="City">City</option>
                                                <option value="Countryside">Countryside</option>
                                                <option value="Lakefront">Lakefront</option>
                                                <option value="Cabin">Cabin</option>
                                                <option value="Luxury">Luxury</option>
                                            </select>
                                        </div>

                                        {/* Tags */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tags
                                            </label>
                                            <input
                                                type="text"
                                                name="tags"
                                                value={formData.tags}
                                                onChange={handleChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent"
                                                placeholder="family-friendly, pet-friendly, etc."
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Separate tags with commas
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors flex items-center disabled:opacity-70"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiEdit2 className="mr-2" /> Update Listing
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