import React, { useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    MdApartment,
    MdOutlineHouse,
    MdOutlineVilla,
    MdOutlineHouseSiding,
    MdPool,
    MdOutlineBeachAccess,
    MdOutlineCabin,
    MdOutlineCastle,
    MdKitchen,
    MdOutlineLandscape,
    MdOutlineHouseboat,
    MdOutlineWater,
    MdOutlinePark,
    MdOutlineDownhillSkiing,
    MdOutlineSurfing,
    MdOutlineCottage,
} from "react-icons/md";
import {
    FiStar,
    FiHome,
    FiUmbrella,
    FiCamera,
    FiCoffee,
    FiMusic,
    FiAward,
    FiHeart,
    FiBook,
    FiMap,
    FiGift,
    FiMoon,
} from "react-icons/fi";
import { IoIosSnow, IoIosBoat } from "react-icons/io";
import {
    GiBarn,
    GiCampingTent,
    GiCaveEntrance,
    GiDesert,
    GiLightningDome,
    GiFarmTractor,
    GiGolfFlag,
    GiGrandPiano,
    GiIsland,
    GiTreehouse,
    GiPalmTree,
    GiGrapes,
    GiMineWagon,
} from "react-icons/gi";
import { TbBeach, TbWindmill } from "react-icons/tb";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const CategorySlider = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
    const [isAnimating, setIsAnimating] = useState(false);

    const categories = [
        { name: "Apartment", icon: <MdApartment className="text-2xl md:text-3xl" /> },
        { name: "House", icon: <MdOutlineHouse className="text-2xl md:text-3xl" /> },
        { name: "Hotel", icon: <FiStar className="text-2xl md:text-3xl" /> },
        { name: "Hostel", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Resort", icon: <FiUmbrella className="text-2xl md:text-3xl" /> },
        { name: "Villa", icon: <MdOutlineVilla className="text-2xl md:text-3xl" /> },
        { name: "A-frame", icon: <MdOutlineHouseSiding className="text-2xl md:text-3xl" /> },
        { name: "Adapted", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Amazing pools", icon: <MdPool className="text-2xl md:text-3xl" /> },
        { name: "Amazing views", icon: <FiCamera className="text-2xl md:text-3xl" /> },
        { name: "Arctic", icon: <IoIosSnow className="text-2xl md:text-3xl" /> },
        { name: "Barn", icon: <GiBarn className="text-2xl md:text-3xl" /> },
        { name: "Beach", icon: <TbBeach className="text-2xl md:text-3xl" /> },
        { name: "Beachfront", icon: <MdOutlineBeachAccess className="text-2xl md:text-3xl" /> },
        { name: "Bed & breakfast", icon: <FiCoffee className="text-2xl md:text-3xl" /> },
        { name: "Boat", icon: <IoIosBoat className="text-2xl md:text-3xl" /> },
        { name: "Cabin", icon: <MdOutlineCabin className="text-2xl md:text-3xl" /> },
        { name: "Camper", icon: <GiCampingTent className="text-2xl md:text-3xl" /> },
        { name: "Camping", icon: <GiCampingTent className="text-2xl md:text-3xl" /> },
        { name: "Casas particulares", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Castle", icon: <MdOutlineCastle className="text-2xl md:text-3xl" /> },
        { name: "Cave", icon: <GiCaveEntrance className="text-2xl md:text-3xl" /> },
        { name: "Chef's kitchen", icon: <MdKitchen className="text-2xl md:text-3xl" /> },
        { name: "Container", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Countryside", icon: <MdOutlineLandscape className="text-2xl md:text-3xl" /> },
        { name: "Creative space", icon: <FiMusic className="text-2xl md:text-3xl" /> },
        { name: "Cycladic home", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Dammuso", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Desert", icon: <GiDesert className="text-2xl md:text-3xl" /> },
        { name: "Design", icon: <FiAward className="text-2xl md:text-3xl" /> },
        { name: "Dome", icon: <GiLightningDome className="text-2xl md:text-3xl" /> },
        { name: "Earth home", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Farm", icon: <GiFarmTractor className="text-2xl md:text-3xl" /> },
        { name: "Fun for kids", icon: <FiHeart className="text-2xl md:text-3xl" /> },
        { name: "Golfing", icon: <GiGolfFlag className="text-2xl md:text-3xl" /> },
        { name: "Grand piano", icon: <GiGrandPiano className="text-2xl md:text-3xl" /> },
        { name: "Hanok", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Historical home", icon: <FiBook className="text-2xl md:text-3xl" /> },
        { name: "Houseboat", icon: <MdOutlineHouseboat className="text-2xl md:text-3xl" /> },
        { name: "Iconic city", icon: <FiMap className="text-2xl md:text-3xl" /> },
        { name: "Icon", icon: <FiAward className="text-2xl md:text-3xl" /> },
        { name: "Island", icon: <GiIsland className="text-2xl md:text-3xl" /> },
        { name: "Kezhan", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Lake", icon: <MdOutlineWater className="text-2xl md:text-3xl" /> },
        { name: "Lakefront", icon: <MdOutlineWater className="text-2xl md:text-3xl" /> },
        { name: "Luxe", icon: <FiGift className="text-2xl md:text-3xl" /> },
        { name: "Mansion", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Minsu", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "National park", icon: <MdOutlinePark className="text-2xl md:text-3xl" /> },
        { name: "Off-the-grid", icon: <FiMoon className="text-2xl md:text-3xl" /> },
        { name: "OMG!", icon: <FiAward className="text-2xl md:text-3xl" /> },
        { name: "Riad", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Ryokan", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Shared home", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Shepherd's hut", icon: <MdOutlineCottage className="text-2xl md:text-3xl" /> },
        { name: "Ski-in/out", icon: <MdOutlineDownhillSkiing className="text-2xl md:text-3xl" /> },
        { name: "Skiing", icon: <MdOutlineDownhillSkiing className="text-2xl md:text-3xl" /> },
        { name: "Surfing", icon: <MdOutlineSurfing className="text-2xl md:text-3xl" /> },
        { name: "Tiny home", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Tower", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Treehouse", icon: <GiTreehouse className="text-2xl md:text-3xl" /> },
        { name: "Tropical", icon: <GiPalmTree className="text-2xl md:text-3xl" /> },
        { name: "Trullo", icon: <FiHome className="text-2xl md:text-3xl" /> },
        { name: "Vineyard", icon: <GiGrapes className="text-2xl md:text-3xl" /> },
        { name: "Windmill", icon: <TbWindmill className="text-2xl md:text-3xl" /> },
        { name: "Yurt", icon: <GiMineWagon className="text-2xl md:text-3xl" /> },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const sliderRef = useRef(null);
    const itemsPerPage = 8;

    const nextSlide = () => {
        if (currentIndex + itemsPerPage < categories.length && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => prev + itemsPerPage);
        }
    };

    const prevSlide = () => {
        if (currentIndex - itemsPerPage >= 0 && !isAnimating) {
            setIsAnimating(true);
            setCurrentIndex((prev) => prev - itemsPerPage);
        }
    };

    const visibleCategories = categories.slice(
        currentIndex,
        currentIndex + itemsPerPage
    );

    const handleSearchByCategory = (categoryName) => {
        const newSearchParams = new URLSearchParams();
        newSearchParams.set("category", categoryName);
        setSelectedCategory(categoryName);
        navigate(`/?${newSearchParams.toString()}`);
    };

    const handleClearCategory = () => {
        setSelectedCategory("");
        navigate("/");
    };

    // Animation variants for the slider
    const sliderVariants = {
        enter: (direction) => ({
            x: direction > 0 ? "100%" : "-100%",
            opacity: 0
        }),
        center: {
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            x: direction > 0 ? "-100%" : "100%",
            opacity: 0
        })
    };

    // Animation for category items
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.05,
                duration: 0.3
            }
        })
    };

    return (
        <div className="relative max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    Explore categories
                </h2>
                {selectedCategory && (
                    <motion.button
                        onClick={handleClearCategory}
                        className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Clear filter: {selectedCategory}
                    </motion.button>
                )}
            </div>

            <div className="relative overflow-hidden h-[180px] md:h-[200px]">
                <AnimatePresence 
                    custom={1} 
                    initial={false}
                    onExitComplete={() => setIsAnimating(false)}
                >
                    <motion.div
                        key={currentIndex}
                        custom={1}
                        variants={sliderVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute top-0 left-0 w-full flex"
                    >
                        {visibleCategories.map((category, index) => {
                            const isSelected = selectedCategory === category.name;
                            return (
                                <motion.div
                                    key={`${category.name}-${index}`}
                                    custom={index}
                                    initial="hidden"
                                    animate="visible"
                                    variants={itemVariants}
                                    className="flex-shrink-0 w-1/8 px-2"
                                >
                                    <motion.div
                                        onClick={() => handleSearchByCategory(category.name)}
                                        className={`flex flex-col items-center p-4 rounded-xl transition-all cursor-pointer group ${
                                            isSelected
                                                ? "bg-rose-50 border-2 border-rose-200"
                                                : "hover:bg-gray-50 border-2 border-transparent"
                                        }`}
                                        whileHover={{ y: -5 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <motion.div
                                            className={`p-3 rounded-full transition-colors mb-2 ${
                                                isSelected
                                                    ? "bg-rose-100 text-rose-600"
                                                    : "bg-gray-100 group-hover:bg-gray-200"
                                            }`}
                                            whileHover={{ rotate: isSelected ? 0 : 5 }}
                                        >
                                            {category.icon}
                                        </motion.div>
                                        <span
                                            className={`text-sm font-medium text-center ${
                                                isSelected
                                                    ? "text-rose-700 font-semibold"
                                                    : "text-gray-700"
                                            }`}
                                        >
                                            {category.name}
                                        </span>
                                    </motion.div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>
            </div>

            <motion.button
                onClick={prevSlide}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${
                    currentIndex === 0
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaChevronLeft className="text-gray-700" />
            </motion.button>

            <motion.button
                onClick={nextSlide}
                disabled={currentIndex + itemsPerPage >= categories.length}
                className={`absolute right-0 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white shadow-md hover:bg-gray-100 transition-colors ${
                    currentIndex + itemsPerPage >= categories.length
                        ? "opacity-50 cursor-not-allowed"
                        : "opacity-100"
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FaChevronRight className="text-gray-700" />
            </motion.button>

            {/* Pagination indicators */}
            <div className="flex justify-center mt-4 gap-2">
                {Array.from({ length: Math.ceil(categories.length / itemsPerPage) }).map((_, index) => (
                    <motion.div
                        key={index}
                        onClick={() => {
                            if (!isAnimating) {
                                setIsAnimating(true);
                                setCurrentIndex(index * itemsPerPage);
                            }
                        }}
                        className={`w-2 h-2 rounded-full cursor-pointer ${
                            currentIndex / itemsPerPage === index ? 'bg-rose-500' : 'bg-gray-300'
                        }`}
                        whileHover={{ scale: 1.5 }}
                        transition={{ type: 'spring', stiffness: 500 }}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategorySlider;