import { useState, useEffect, useRef, useCallback } from "react";
import { CiWifiOn } from "react-icons/ci";
import Navbar from "../shared/Navbar";
import { ClipLoader } from "react-spinners";
import {
  FiDroplet, FiUmbrella, FiUser, FiPocket, FiAlertTriangle, 
  FiPlusSquare, FiThermometer, FiTv, FiHome, FiStar, 
  FiCamera, FiMusic, FiHeart, FiGift, FiAward, 
  FiBook, FiMap, FiMoon, FiCoffee, FiUpload, FiX
} from "react-icons/fi";
import { 
  MdKitchen, MdLocalParking, MdPool, MdApartment, MdOutlineVilla,
  MdOutlineHouseSiding, MdOutlineCabin, MdOutlineCastle, MdOutlineHouseboat,
  MdOutlineCottage, MdOutlineSurfing, MdOutlineDownhillSkiing, MdOutlineLandscape,
  MdOutlineWater, MdOutlinePark, MdOutlineHouse, MdOutlineBeachAccess
} from "react-icons/md";
import { 
  GiWoodenChair, GiIsland, GiCampingTent, GiBarn, GiCaveEntrance,
  GiDesert, GiPalmTree, GiGolfFlag, GiGrandPiano, GiFarmTractor,
  GiMineWagon, GiLightningDome, GiTreehouse, GiGrapes
} from "react-icons/gi";
import { IoIosSnow, IoIosBoat } from "react-icons/io";
import { TbBeach, TbWindmill } from "react-icons/tb";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';

// Set up MapTiler SDK
maptilersdk.config.apiKey = 'JYHKuYzUBYh2Mj4qck6S';

// Debounce function to limit API calls
const debounce = (func, delay) => {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func.apply(this, args), delay);
  };
};

const CreateListing = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);
  const suggestionRef = useRef(null);
  
  // Flat form data structure
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    placeType: "",
    host: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    latitude: 0,
    longitude: 0,
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

  // Initialize map when step 2 is active
  useEffect(() => {
    if (step === 2 && mapContainer.current) {
      const centerLng = typeof formData.longitude === 'number' ? formData.longitude : -122.4194;
      const centerLat = typeof formData.latitude === 'number' ? formData.latitude : 37.7749;
      
      map.current = new maptilersdk.Map({
        container: mapContainer.current,
        style: maptilersdk.MapStyle.STREETS,
        center: [centerLng, centerLat],
        zoom: 12
      });

      map.current.addControl(new maptilersdk.NavigationControl());

      if (formData.latitude && formData.longitude) {
        createMarker(
          formData.longitude,
          formData.latitude
        );
      }

      return () => {
        if (map.current) map.current.remove();
        if (marker.current) marker.current.remove();
      };
    }
  }, [step]);

  // Update marker when coordinates change
  useEffect(() => {
    if (step === 2 && map.current && 
        typeof formData.latitude === 'number' && 
        typeof formData.longitude === 'number') {
      
      if (marker.current) {
        marker.current.setLngLat([
          formData.longitude,
          formData.latitude
        ]);
      } else {
        createMarker(
          formData.longitude,
          formData.latitude
        );
      }
      
      map.current.setCenter([
        formData.longitude,
        formData.latitude
      ]);
    }
  }, [formData.latitude, formData.longitude, step]);

  // Create draggable marker
  const createMarker = (lng, lat) => {
    if (map.current) {
      marker.current = new maptilersdk.Marker({
        draggable: true,
        color: "#FF385C"
      })
      .setLngLat([lng, lat])
      .addTo(map.current);

      marker.current.on('dragend', (e) => {
        const lngLat = marker.current.getLngLat();
        setFormData(prev => ({
          ...prev,
          latitude: lngLat.lat,
          longitude: lngLat.lng
        }));
      });
    }
  };

  // Handle address suggestions
  const fetchAddressSuggestions = useCallback(debounce(async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }
    
    try {
      const response = await maptilersdk.geocoding.forward(query, { 
        limit: 5,
        autocomplete: true
      });
      
      if (response.features && response.features.length > 0) {
        setAddressSuggestions(response.features);
        setShowSuggestions(true);
      } else {
        setAddressSuggestions([]);
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      setAddressSuggestions([]);
    }
  }, 300), []);

  // Handle input changes
  const handleChange = (event) => {
    const { name, value, type, files } = event.target;
    
    // Convert coordinates to numbers
    let finalValue = value;
    if (name === 'latitude' || name === 'longitude') {
      finalValue = value === '' ? 0 : parseFloat(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue,
    }));

    // Fetch address suggestions when typing in address field
    if (name === "address") {
      fetchAddressSuggestions(value);
    }
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion) => {
    const [longitude, latitude] = suggestion.geometry.coordinates;
    let city = '';
    let state = '';
    let country = '';
    let zipCode = '';

    // Extract address components from suggestion
    if (suggestion.context) {
      suggestion.context.forEach(item => {
        if (item.id.includes('place')) city = item.text;
        if (item.id.includes('region')) state = item.text;
        if (item.id.includes('country')) country = item.text;
        if (item.id.includes('postcode')) zipCode = item.text;
      });
    }

    setFormData(prev => ({
      ...prev,
      address: suggestion.place_name,
      city: city,
      state: state,
      country: country,
      zipCode: zipCode,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }));

    setAddressSuggestions([]);
    setShowSuggestions(false);
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Geocode address using MapTiler
  const handleGeocode = async () => {
    try {
      const query = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}, ${formData.country}`;
      const response = await maptilersdk.geocoding.forward(query, { limit: 1 });
      
      if (response.features?.length > 0) {
        const [longitude, latitude] = response.features[0].geometry.coordinates;
        
        setFormData(prev => ({
          ...prev,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        }));
        
        toast.success("Location found!");
      } else {
        toast.error("Location not found");
      }
    } catch (error) {
      toast.error("Geocoding failed");
      console.error("Geocoding error:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photos || formData.photos.length === 0) {
      toast.error("Please upload at least one photo");
      return;
    }

    const form = new FormData();
    form.append("title", formData.title);
    form.append("description", formData.description);
    form.append("placeType", formData.placeType);
    form.append("pricePerNight", formData.pricePerNight);
    form.append("maxGuests", formData.maxGuests);
    form.append("rooms", formData.rooms);
    form.append("beds", formData.beds);
    form.append("bathrooms", formData.bathrooms);
    form.append("category", formData.category);

    form.append("location[address]", formData.address);
    form.append("location[city]", formData.city);
    form.append("location[state]", formData.state);
    form.append("location[country]", formData.country);
    form.append("location[zipCode]", formData.zipCode);
    form.append("location[coordinates][latitude]", formData.latitude);
    form.append("location[coordinates][longitude]", formData.longitude);

    if (formData.amenities) {
      formData.amenities.forEach((amenity) => {
        form.append("amenities[]", amenity);
      });
    }

    formData.photos.forEach((file) => {
      form.append("photos", file);
    });

    try {
      setLoading(true);
      
      await axios.post(
        "/api/v1/listings/create-listing",
        form,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setLoading(false);
      navigate("/host/listings");
      toast.success("Listing created successfully");
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
      toast.error(
        error.response?.data?.message || "An error occurred. Please try again."
      );
    }
  };

  // Handle checkbox changes
  const handleAmenityChange = (value) => {
    setFormData(prev => {
      if (prev.amenities.includes(value)) {
        return {
          ...prev,
          amenities: prev.amenities.filter(item => item !== value)
        };
      } else {
        return {
          ...prev,
          amenities: [...prev.amenities, value]
        };
      }
    });
  };

  // Handle file changes
  const handleFileChange = (event) => {
    const { files } = event.target;
    const filesArray = Array.from(files);
    setFormData(prev => ({
      ...prev,
      photos: filesArray,
    }));
    
    // Create preview URLs
    const previews = filesArray.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Remove image from preview
  const removeImage = (index) => {
    const newPreviews = [...previewImages];
    newPreviews.splice(index, 1);
    setPreviewImages(newPreviews);
    
    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);
    setFormData(prev => ({...prev, photos: newPhotos}));
  };

  // Category options with icons
  const categories = [
    { name: "Apartment", icon: <MdApartment className="text-2xl" /> },
    { name: "House", icon: <MdOutlineHouse className="text-2xl" /> },
    { name: "Hotel", icon: <FiStar className="text-2xl" /> },
    { name: "Hostel", icon: <FiHome className="text-2xl" /> },
    { name: "Resort", icon: <FiUmbrella className="text-2xl" /> },
    { name: "Villa", icon: <MdOutlineVilla className="text-2xl" /> },
    { name: "A-frame", icon: <MdOutlineHouseSiding className="text-2xl" /> },
    { name: "Adapted", icon: <FiHome className="text-2xl" /> },
    { name: "Amazing pools", icon: <MdPool className="text-2xl" /> },
    { name: "Amazing views", icon: <FiCamera className="text-2xl" /> },
    { name: "Arctic", icon: <IoIosSnow className="text-2xl" /> },
    { name: "Barn", icon: <GiBarn className="text-2xl" /> },
    { name: "Beach", icon: <TbBeach className="text-2xl" /> },
    { name: "Beachfront", icon: <MdOutlineBeachAccess className="text-2xl" /> },
    { name: "Bed & breakfast", icon: <FiCoffee className="text-2xl" /> },
    { name: "Boat", icon: <IoIosBoat className="text-2xl" /> },
    { name: "Cabin", icon: <MdOutlineCabin className="text-2xl" /> },
    { name: "Camper", icon: <GiCampingTent className="text-2xl" /> },
    { name: "Camping", icon: <GiCampingTent className="text-2xl" /> },
    { name: "Casas particulares", icon: <FiHome className="text-2xl" /> },
    { name: "Castle", icon: <MdOutlineCastle className="text-2xl" /> },
    { name: "Cave", icon: <GiCaveEntrance className="text-2xl" /> },
    { name: "Chef's kitchen", icon: <MdKitchen className="text-2xl" /> },
    { name: "Container", icon: <FiHome className="text-2xl" /> },
    { name: "Countryside", icon: <MdOutlineLandscape className="text-2xl" /> },
    { name: "Creative space", icon: <FiMusic className="text-2xl" /> },
    { name: "Cycladic home", icon: <FiHome className="text-2xl" /> },
    { name: "Dammuso", icon: <FiHome className="text-2xl" /> },
    { name: "Desert", icon: <GiDesert className="text-2xl" /> },
    { name: "Design", icon: <FiAward className="text-2xl" /> },
    { name: "Dome", icon: <GiLightningDome className="text-2xl" /> },
    { name: "Earth home", icon: <FiHome className="text-2xl" /> },
    { name: "Farm", icon: <GiFarmTractor className="text-2xl" /> },
    { name: "Fun for kids", icon: <FiHeart className="text-2xl" /> },
    { name: "Golfing", icon: <GiGolfFlag className="text-2xl" /> },
    { name: "Grand piano", icon: <GiGrandPiano className="text-2xl" /> },
    { name: "Hanok", icon: <FiHome className="text-2xl" /> },
    { name: "Historical home", icon: <FiBook className="text-2xl" /> },
    { name: "Houseboat", icon: <MdOutlineHouseboat className="text-2xl" /> },
    { name: "Iconic city", icon: <FiMap className="text-2xl" /> },
    { name: "Icon", icon: <FiAward className="text-2xl" /> },
    { name: "Island", icon: <GiIsland className="text-2xl" /> },
    { name: "Kezhan", icon: <FiHome className="text-2xl" /> },
    { name: "Lake", icon: <MdOutlineWater className="text-2xl" /> },
    { name: "Lakefront", icon: <MdOutlineWater className="text-2xl" /> },
    { name: "Luxe", icon: <FiGift className="text-2xl" /> },
    { name: "Mansion", icon: <FiHome className="text-2xl" /> },
    { name: "Minsu", icon: <FiHome className="text-2xl" /> },
    { name: "National park", icon: <MdOutlinePark className="text-2xl" /> },
    { name: "Off-the-grid", icon: <FiMoon className="text-2xl" /> },
    { name: "OMG!", icon: <FiAward className="text-2xl" /> },
    { name: "Riad", icon: <FiHome className="text-2xl" /> },
    { name: "Ryokan", icon: <FiHome className="text-2xl" /> },
    { name: "Shared home", icon: <FiHome className="text-2xl" /> },
    { name: "Shepherd's hut", icon: <MdOutlineCottage className="text-2xl" /> },
    { name: "Ski-in/out", icon: <MdOutlineDownhillSkiing className="text-2xl" /> },
    { name: "Skiing", icon: <MdOutlineDownhillSkiing className="text-2xl" /> },
    { name: "Surfing", icon: <MdOutlineSurfing className="text-2xl" /> },
    { name: "Tiny home", icon: <FiHome className="text-2xl" /> },
    { name: "Tower", icon: <FiHome className="text-2xl" /> },
    { name: "Treehouse", icon: <GiTreehouse className="text-2xl" /> },
    { name: "Tropical", icon: <GiPalmTree className="text-2xl" /> },
    { name: "Trullo", icon: <FiHome className="text-2xl" /> },
    { name: "Vineyard", icon: <GiGrapes className="text-2xl" /> },
    { name: "Windmill", icon: <TbWindmill className="text-2xl" /> },
    { name: "Yurt", icon: <GiMineWagon className="text-2xl" /> }
  ];

  // Progress bar percentage
  const progressPercentage = ((step - 1) / 7) * 100;

  return (
    <>
      <Navbar />
      <div className="pt-24 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          {/* Progress Bar */}
          <div className="mb-10">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-airbnb-pink transition-all duration-500 ease-in-out"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-sm text-gray-500 font-medium">
              Step {step} of 8
            </div>
          </div>

          <form id="listingForm" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Create your listing
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Start by giving your place a title and description
                  </p>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div className="space-y-8">
                      {/* Title Section */}
                      <div className="space-y-4">
                        <label
                          htmlFor="title"
                          className="block text-lg font-medium text-gray-700"
                        >
                          Listing Title
                        </label>
                        <input
                          id="title"
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="e.g., Beautiful beachfront villa with pool"
                        />
                      </div>

                      {/* Description Section */}
                      <div className="space-y-4">
                        <label
                          htmlFor="description"
                          className="block text-lg font-medium text-gray-700"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="Describe your space, amenities, and what makes it special..."
                        />
                      </div>

                      {/* Place Type Section */}
                      <div className="space-y-4">
                        <h4 className="text-lg font-medium text-gray-700">
                          Place Type
                        </h4>
                        <p className="text-gray-500 text-sm">
                          What kind of place will guests have?
                        </p>

                        <div className="grid grid-cols-1 gap-4">
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
                                checked={formData.placeType === "Entire Place"}
                              />
                              <div>
                                <span className="block font-medium text-gray-800">
                                  Entire Place
                                </span>
                                <span className="block text-sm text-gray-500">
                                  Guests have the whole place to themselves
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
                                checked={formData.placeType === "Private Room"}
                              />
                              <div>
                                <span className="block font-medium text-gray-800">
                                  Private Room
                                </span>
                                <span className="block text-sm text-gray-500">
                                  Guests have their own room in a shared space
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
                                checked={formData.placeType === "Shared Room"}
                              />
                              <div>
                                <span className="block font-medium text-gray-800">
                                  Shared Room
                                </span>
                                <span className="block text-sm text-gray-500">
                                  Guests share a common sleeping area
                                </span>
                              </div>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center">
                      <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-auto max-h-[500px] object-cover"
                        >
                          <source 
                            src="https://stream.media.muscache.com/zFaydEaihX6LP01x8TSCl76WHblb01Z01RrFELxyCXoNek.mp4?v_q=high" 
                            type="video/mp4" 
                          />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                      <div className="mt-4 text-center">
                        <h3 className="text-xl font-semibold text-gray-800">3D Tour Preview</h3>
                        <p className="text-gray-600">This is how your listing could appear to guests</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Where's your place located?
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Help guests find your property
                  </p>
                  
                  <div className="space-y-6">
                    {/* Address with Autocomplete */}
                    <div className="relative" ref={suggestionRef}>
                      <label className="block text-lg font-medium text-gray-700 mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                        placeholder="Start typing your address..."
                        autoComplete="off"
                      />
                      
                      {/* Address Suggestions Dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {addressSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="px-4 py-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                              onClick={() => handleSuggestionSelect(suggestion)}
                            >
                              <div className="font-medium text-gray-800">{suggestion.place_name}</div>
                              <div className="text-sm text-gray-500 mt-1">
                                {suggestion.context?.map(ctx => ctx.text).join(', ')}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* City */}
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="City"
                        />
                      </div>
                      
                      {/* State */}
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="State"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Country */}
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="Country"
                        />
                      </div>
                      
                      {/* Zip Code */}
                      <div>
                        <label className="block text-lg font-medium text-gray-700 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="Zip code"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Coordinates */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">
                            Latitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="latitude"
                            value={formData.latitude}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                            placeholder="Latitude"
                          />
                        </div>
                        <div>
                          <label className="block text-lg font-medium text-gray-700 mb-2">
                            Longitude
                          </label>
                          <input
                            type="number"
                            step="any"
                            name="longitude"
                            value={formData.longitude}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                            placeholder="Longitude"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Map Section */}
                    <div className="mt-6">
                      <div className="flex justify-between items-center mb-3">
                        <label className="block text-lg font-medium text-gray-700">
                          Location Map
                        </label>
                        <button
                          type="button"
                          onClick={handleGeocode}
                          className="px-4 py-2 bg-airbnb-pink text-white rounded-lg hover:bg-airbnb-pink-dark transition-colors"
                        >
                          Find on Map
                        </button>
                      </div>
                      
                      <div 
                        ref={mapContainer} 
                        className="h-[500px] rounded-lg overflow-hidden border border-gray-300"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Drag the marker to adjust your exact location
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Set Your Price
                  </h2>
                  <p className="text-gray-600 mb-8">
                    How much will you charge per night?
                  </p>

                  <div className="space-y-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <label
                        htmlFor="pricePerNight"
                        className="block text-xl font-medium text-gray-700 mb-1"
                      >
                        Nightly Rate
                      </label>
                      <p className="text-gray-500">
                        This will be your base price per night
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative w-full">
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
                          className="w-full py-4 pl-12 pr-16 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500 text-xl">
                            USD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <h4 className="font-medium text-blue-800 flex items-center">
                        <FiStar className="mr-2" /> Pricing Tip
                      </h4>
                      <p className="text-blue-600 mt-1">
                        Competitive pricing in your area starts around $120-$180 per night
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Guest Capacity
                  </h2>
                  <p className="text-gray-600 mb-8">
                    How many guests can your place accommodate?
                  </p>

                  <div className="space-y-8 max-w-2xl mx-auto">
                    <div className="text-center">
                      <label
                        htmlFor="maxGuests"
                        className="block text-xl font-medium text-gray-700 mb-1"
                      >
                        Maximum Number of Guests
                      </label>
                      <p className="text-gray-500">
                        Include all guests, including infants and children
                      </p>
                    </div>

                    <div className="flex justify-center">
                      <div className="relative w-full">
                        <input
                          id="maxGuests"
                          type="number"
                          name="maxGuests"
                          value={formData.maxGuests}
                          onChange={handleChange}
                          required
                          min="1"
                          step="1"
                          className="w-full py-4 px-6 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500 text-xl">
                            guests
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                      <h4 className="font-medium text-yellow-800 flex items-center">
                        <FiAlertTriangle className="mr-2" /> Important
                      </h4>
                      <p className="text-yellow-600 mt-1">
                        You'll be charged extra for exceeding your guest limit
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Room Configuration
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Tell us about the rooms in your property
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {/* Bedrooms */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label
                        htmlFor="rooms"
                        className="block text-lg font-medium text-gray-700 mb-4 text-center"
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
                          className="w-full py-4 px-6 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500 text-xl">
                            {formData.rooms === "1" ? "room" : "rooms"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Beds */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label
                        htmlFor="beds"
                        className="block text-lg font-medium text-gray-700 mb-4 text-center"
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
                          className="w-full py-4 px-6 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500 text-xl">
                            {formData.beds === "1" ? "bed" : "beds"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bathrooms */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                      <label
                        htmlFor="bathrooms"
                        className="block text-lg font-medium text-gray-700 mb-4 text-center"
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
                          className="w-full py-4 px-6 text-2xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                          <span className="text-gray-500 text-xl">
                            {formData.bathrooms === "1" ? "bath" : "baths"}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2 text-center">
                        Half baths can be entered as 0.5
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {step === 6 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Amenities
                  </h2>
                  <p className="text-gray-600 mb-8">
                    What amenities do you offer?
                  </p>

                  {/* Basic Amenities */}
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
                      Essentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Toilet paper */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="toilet_paper"
                          id="toilet_paper"
                          checked={formData.amenities.includes("toilet_paper")}
                          onChange={() => handleAmenityChange("toilet_paper")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="toilet_paper"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiDroplet className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Toilet paper
                          </span>
                        </label>
                      </div>

                      {/* Hand soap */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="soap"
                          id="soap"
                          checked={formData.amenities.includes("soap")}
                          onChange={() => handleAmenityChange("soap")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="soap"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiUmbrella className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Hand & body soap
                          </span>
                        </label>
                      </div>

                      {/* Towels */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="towels"
                          id="towels"
                          checked={formData.amenities.includes("towels")}
                          onChange={() => handleAmenityChange("towels")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="towels"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiUser className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Towels per guest
                          </span>
                        </label>
                      </div>

                      {/* Pillows */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="pillows"
                          id="pillows"
                          checked={formData.amenities.includes("pillows")}
                          onChange={() => handleAmenityChange("pillows")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="pillows"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiPocket className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Pillows per guest
                          </span>
                        </label>
                      </div>

                      {/* Linens */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="linens"
                          id="linens"
                          checked={formData.amenities.includes("linens")}
                          onChange={() => handleAmenityChange("linens")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="linens"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <GiWoodenChair className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Bed linens
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Top Amenities */}
                  <div className="mb-12">
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
                      Popular Amenities
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* WiFi */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="wifi"
                          id="wifi"
                          checked={formData.amenities.includes("wifi")}
                          onChange={() => handleAmenityChange("wifi")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="wifi"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <CiWifiOn className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            WiFi
                          </span>
                        </label>
                      </div>

                      {/* Kitchen */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="kitchen"
                          id="kitchen"
                          checked={formData.amenities.includes("kitchen")}
                          onChange={() => handleAmenityChange("kitchen")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="kitchen"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <MdKitchen className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Kitchen
                          </span>
                        </label>
                      </div>

                      {/* Parking */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="parking"
                          id="parking"
                          checked={formData.amenities.includes("parking")}
                          onChange={() => handleAmenityChange("parking")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="parking"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <MdLocalParking className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Free Parking
                          </span>
                        </label>
                      </div>

                      {/* Pool */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="pool"
                          id="pool"
                          checked={formData.amenities.includes("pool")}
                          onChange={() => handleAmenityChange("pool")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="pool"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <MdPool className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Pool
                          </span>
                        </label>
                      </div>

                      {/* TV */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="tv"
                          id="tv"
                          checked={formData.amenities.includes("tv")}
                          onChange={() => handleAmenityChange("tv")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="tv"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiTv className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            TV
                          </span>
                        </label>
                      </div>

                      {/* AC */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="air_conditioning"
                          id="air_conditioning"
                          checked={formData.amenities.includes("air_conditioning")}
                          onChange={() => handleAmenityChange("air_conditioning")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="air_conditioning"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
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
                    <h3 className="text-xl font-semibold text-gray-700 mb-6 pb-2 border-b border-gray-200">
                      Safety Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Smoke alarm */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="smoke_alarm"
                          id="smoke_alarm"
                          checked={formData.amenities.includes("smoke_alarm")}
                          onChange={() => handleAmenityChange("smoke_alarm")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="smoke_alarm"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
                            <FiAlertTriangle className="text-xl peer-checked:text-airbnb-pink" />
                          </div>
                          <span className="font-medium">
                            Smoke alarm
                          </span>
                        </label>
                      </div>

                      {/* First aid */}
                      <div className="flex items-center space-x-3 p-4 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors border border-gray-200">
                        <input
                          type="checkbox"
                          name="amenities"
                          value="first_aid"
                          id="first_aid"
                          checked={formData.amenities.includes("first_aid")}
                          onChange={() => handleAmenityChange("first_aid")}
                          className="hidden peer"
                        />
                        <label
                          htmlFor="first_aid"
                          className="flex items-center space-x-3 cursor-pointer peer-checked:text-airbnb-pink w-full"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 peer-checked:bg-airbnb-pink peer-checked:bg-opacity-10 transition-colors">
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
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Add Photos
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Show guests what your place looks like
                  </p>

                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-airbnb-pink transition-colors group relative">
                    <input
                      type="file"
                      name="photos"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center justify-center">
                      <FiUpload className="text-4xl text-gray-400 group-hover:text-airbnb-pink transition-colors mb-4" />
                      <h3 className="text-xl font-medium text-gray-700">
                        Upload Photos
                      </h3>
                      <p className="text-gray-500 mt-2">
                        Drag & drop images or click to browse
                      </p>
                      <p className="text-sm text-gray-400 mt-4">
                        Recommended size: 1200x800 pixels or larger
                      </p>
                    </label>
                  </div>

                  {previewImages.length > 0 && (
                    <div className="mt-12">
                      <h3 className="text-xl font-medium text-gray-700 mb-6">
                        Selected Photos ({previewImages.length})
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {previewImages.map((src, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-video overflow-hidden rounded-xl border border-gray-200">
                              <img 
                                src={src} 
                                alt={`Preview ${index}`} 
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md hover:bg-gray-100 transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <FiX className="text-gray-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 8 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    Categorize Your Listing
                  </h2>
                  <p className="text-gray-600 mb-8">
                    Help guests find your property by selecting the right category
                  </p>
                  
                  <div className="space-y-10">
                    <div>
                      <label className="block text-xl font-medium text-gray-700 mb-6">
                        Property Type
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {categories.map((category) => (
                          <label
                            key={category.name}
                            htmlFor={`category-${category.name}`}
                            className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex flex-col items-center group ${formData.category === category.name ? "border-airbnb-pink bg-airbnb-pink bg-opacity-10" : "border-gray-300 hover:border-airbnb-pink"}`}
                          >
                            <input
                              id={`category-${category.name}`}
                              type="radio"
                              name="category"
                              value={category.name}
                              onChange={handleChange}
                              required
                              className="hidden peer"
                              checked={formData.category === category.name}
                            />
                            <div className="text-3xl mb-3 text-gray-600 group-hover:text-airbnb-pink peer-checked:text-airbnb-pink transition-colors">
                              {category.icon}
                            </div>
                            <span className="font-medium text-center text-gray-800 group-hover:text-airbnb-pink peer-checked:text-airbnb-pink transition-colors">
                              {category.name}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xl font-medium text-gray-700 mb-4">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent transition-colors"
                        placeholder="e.g., pet-friendly, pool, wifi, family-friendly"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Add tags that describe unique features of your property
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-4 px-6 shadow-lg z-50">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 text-gray-800 font-medium rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
                    type="button"
                  >
                    Back
                  </button>
                )}

                {step < 8 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="ml-auto px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors flex items-center"
                    type="button"
                  >
                    Continue
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="ml-auto px-6 py-3 bg-airbnb-pink text-white font-medium rounded-lg hover:bg-airbnb-pink-dark transition-colors flex items-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <ClipLoader color="#fff" size={20} className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Publish Listing
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};



export default CreateListing;