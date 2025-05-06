import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { ClipLoader } from "react-spinners";

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
} from "react-icons/fi";
import { MdKitchen, MdLocalParking, MdPool } from "react-icons/md";
import { GiWoodenChair } from "react-icons/gi";
import { CiWifiOn } from "react-icons/ci";

const ListingDetail = () => {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reviewLoading, setReviewLoading] = useState(false);
  const [rating, setRating] = useState(2);
  const [comment, setComment] = useState("");
  const { id } = useParams();
  const mapContainer = useRef(null);
  const map = useRef(null);

  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/listings/${id}`);
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

  // Initialize map
  useEffect(() => {
    if (map.current || !listing) return;

    maptilersdk.config.apiKey = "JYHKuYzUBYh2Mj4qck6S";

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [listing.longitude || 16.62662018, listing.latitude || 49.2125578],
      zoom: 14,
    });

    if (listing.longitude && listing.latitude) {
      new maptilersdk.Marker({ color: "#FF0000" })
        .setLngLat([listing.longitude, listing.latitude])
        .addTo(map.current);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [listing]);

  const handleReviewSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please enter a comment");
      return;
    }

    setReviewLoading(true);
    try {
      const response = await axios.post(`/api/v1/reviews/${id}/create-review`, {
        rating,
        comment,
      });
      if (response) {
        toast.success("Review submitted successfully");
        setComment("");
        setRating(2);
        // Optionally refresh the listing data to show the new review
        const updatedListing = await axios.get(`/api/v1/listings/${id}`);
        setListing(updatedListing.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setReviewLoading(false);
    }
  };

  const getAmenityIcon = (amenity) => {
    switch (amenity) {
      case "toilet_paper":
        return <FiDroplet className="text-xl text-airbnb-pink" />;
      case "soap":
        return <FiUmbrella className="text-xl text-airbnb-pink" />;
      case "towels":
        return <FiUser className="text-xl text-airbnb-pink" />;
      case "pillows":
        return <FiPocket className="text-xl text-airbnb-pink" />;
      case "linens":
        return <GiWoodenChair className="text-xl text-airbnb-pink" />;
      case "wifi":
        return <CiWifiOn className="text-xl text-airbnb-pink" />;
      case "kitchen":
        return <MdKitchen className="text-xl text-airbnb-pink" />;
      case "parking":
        return <MdLocalParking className="text-xl text-airbnb-pink" />;
      case "pool":
        return <MdPool className="text-xl text-airbnb-pink" />;
      case "tv":
        return <FiTv className="text-xl text-airbnb-pink" />;
      case "air_conditioning":
        return <FiThermometer className="text-xl text-airbnb-pink" />;
      case "smoke_alarm":
        return <FiAlertTriangle className="text-xl text-airbnb-pink" />;
      case "first_aid":
        return <FiPlusSquare className="text-xl text-airbnb-pink" />;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">{listing.title}</h1>
        <div className="flex items-center mt-2 text-gray-600">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-lg">{listing.location}</span>
        </div>
      </div>

      {/* Main Image */}
      <div className="rounded-xl overflow-hidden shadow-lg mb-8">
        <img
          src={listing.photos[0]}
          alt={listing.title}
          className="w-full h-96 object-cover"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column - About and Amenities */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </section>

          {/* Amenities Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-6">Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  {getAmenityIcon(amenity)}
                  <span className="text-gray-700">{getAmenityLabel(amenity)}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Map Section */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Location</h2>
            <div
              ref={mapContainer}
              className="w-full h-80 rounded-lg overflow-hidden"
            />
          </section>
        </div>

        {/* Right Column - Details and Host */}
        <div className="space-y-8">
          {/* Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Price per night:</span>
                <span className="font-medium text-gray-900">
                  ${listing.pricePerNight}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Max Guests:</span>
                <span className="font-medium">{listing.maxGuests}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Rooms:</span>
                <span className="font-medium">{listing.rooms}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Beds:</span>
                <span className="font-medium">{listing.beds}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Bathrooms:</span>
                <span className="font-medium">{listing.bathrooms}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Place Type:</span>
                <span className="font-medium capitalize">
                  {listing.placeType}
                </span>
              </div>
            </div>
          </div>

          {/* Host Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold mb-4">About your host</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={listing.host.profileImage}
                alt={listing.host.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-airbnb-pink"
              />
              <div>
                <h3 className="text-lg font-semibold">{listing.host.name}</h3>
                <p className="text-gray-600 text-sm">
                  Joined in {new Date(listing.host.createdAt).getFullYear()}
                </p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              {listing.host.bio ||
                "Experienced host with a passion for hospitality."}
            </p>
            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-24">Email:</span>
                <span className="font-medium">{listing.host.email}</span>
              </div>
              <div className="flex items-center text-sm">
                <span className="text-gray-600 w-24">Phone:</span>
                <span className="font-medium">{listing.host.phoneNumber}</span>
              </div>
            </div>
            <button className="w-full py-2 bg-airbnb-pink text-white rounded-lg font-medium hover:bg-airbnb-pink-dark transition">
              Contact Host
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-2xl font-semibold mb-6">Guest Reviews</h2>

        {/* Review Form */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium mb-4">Write a Review</h3>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-airbnb-pink focus:border-transparent mb-3"
            rows="4"
            placeholder="Share your experience..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex items-center mb-4">
            <span className="mr-2 text-gray-700">Rating:</span>
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              precision={0.5}
            />
          </div>
          <button
            onClick={handleReviewSubmit}
            disabled={reviewLoading}
            className="px-6 py-2 bg-airbnb-pink text-white rounded-lg font-medium hover:bg-airbnb-pink-dark transition disabled:opacity-50 flex items-center"
          >
            {reviewLoading ? (
              <>
                <ClipLoader color="white" size={20} className="mr-2" />
                Submitting...
              </>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>

        {/* Reviews List */}
        {listing.reviews.length > 0 ? (
          <div className="space-y-6">
            {listing.reviews.map((review) => (
              <div
                key={review._id}
                className="border-b border-gray-100 pb-6 last:border-0"
              >
                <div className="flex items-center mb-3">
                  <img
                    src={review.user.profileImage}
                    alt={review.user.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-medium">{review.user.name}</h4>
                    <p className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="mb-2">
                  <Rating value={review.rating} precision={0.5} readOnly />
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first to review!</p>
        )}
      </div>
    </div>
  );
};

export default ListingDetail;