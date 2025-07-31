import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaAirbnb,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaGlobe,
    FaHeart,
    FaHome,
    FaUserTie,
    FaQuestionCircle,
    FaShieldAlt,
    FaFileAlt,
    FaMobile,
    FaGift,
} from "react-icons/fa";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerSections = [
        {
            title: "Support",
            links: [
                { name: "Help Center", to: "/help", icon: FaQuestionCircle },
                { name: "Safety Information", to: "/safety", icon: FaShieldAlt },
                { name: "Cancellation Options", to: "/cancellation", icon: FaFileAlt },
                { name: "Report a Problem", to: "/report", icon: FaFileAlt },
            ],
        },
        {
            title: "Community",
            links: [
                { name: "Airbnb.org: Disaster Relief", to: "/disaster-relief", icon: FaHeart },
                { name: "Support Afghan Refugees", to: "/afghan-refugees", icon: FaHeart },
                { name: "Combating Discrimination", to: "/anti-discrimination", icon: FaShieldAlt },
            ],
        },
        {
            title: "Hosting",
            links: [
                { name: "Try Hosting", to: "/host", icon: FaHome },
                { name: "AirCover for Hosts", to: "/aircover", icon: FaShieldAlt },
                { name: "Explore Hosting Resources", to: "/hosting-resources", icon: FaFileAlt },
                { name: "Visit our Community Forum", to: "/community", icon: FaQuestionCircle },
            ],
        },
        {
            title: "Roomify",
            links: [
                { name: "Newsroom", to: "/newsroom", icon: FaFileAlt },
                { name: "Learn about New Features", to: "/features", icon: FaGift },
                { name: "Letter from our Founders", to: "/founders", icon: FaFileAlt },
                { name: "Careers", to: "/careers", icon: FaUserTie },
                { name: "Investors", to: "/investors", icon: FaUserTie },
            ],
        },
    ];

    const socialLinks = [
        { name: "Facebook", icon: FaFacebook, url: "https://facebook.com", color: "hover:text-blue-600" },
        { name: "Twitter", icon: FaTwitter, url: "https://twitter.com", color: "hover:text-blue-400" },
        { name: "Instagram", icon: FaInstagram, url: "https://instagram.com", color: "hover:text-pink-500" },
        { name: "LinkedIn", icon: FaLinkedin, url: "https://linkedin.com", color: "hover:text-blue-700" },
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
            },
        },
    };

    return (
        <footer className="bg-gradient-to-br from-secondary-50 via-white to-primary-50 border-t border-secondary-200/50 mt-20">
            {/* Main Footer Content */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="container mx-auto px-4 py-16"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {footerSections.map((section, index) => (
                        <motion.div 
                            key={index} 
                            variants={itemVariants}
                            className="space-y-6"
                        >
                            <h3 className="font-display font-bold text-secondary-900 text-xl">
                                {section.title}
                            </h3>
                            <ul className="space-y-4">
                                {section.links.map((link, linkIndex) => (
                                    <motion.li 
                                        key={linkIndex}
                                        whileHover={{ x: 5 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <Link
                                            to={link.to}
                                            className="flex items-center text-secondary-600 hover:text-primary-500 transition-all duration-300 text-sm group"
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: 5 }}
                                                className="mr-3"
                                            >
                                                <link.icon className="text-sm group-hover:text-primary-500 transition-colors duration-300" />
                                            </motion.div>
                                            <span className="group-hover:font-medium transition-all duration-300">
                                                {link.name}
                                            </span>
                                        </Link>
                                    </motion.li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                {/* Mobile App Section */}
                <motion.div 
                    variants={itemVariants}
                    className="mt-16 pt-12 border-t border-secondary-200/50"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                        <div className="flex items-center space-x-6">
                            <motion.div
                                animate={{ y: [0, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-4 bg-gradient-to-br from-primary-100 to-accent-100 rounded-2xl"
                            >
                                <FaMobile className="text-3xl text-primary-600" />
                            </motion.div>
                            <div>
                                <h4 className="font-display font-bold text-secondary-900 text-xl">Get the Roomify App</h4>
                                <p className="text-secondary-600">Book your next stay on the go</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary text-sm font-medium"
                            >
                                App Store
                            </motion.button>
                            <motion.button 
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn-secondary text-sm font-medium"
                            >
                                Google Play
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>

            {/* Newsletter Subscription */}
            <div className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4 py-16 relative z-10"
                >
                    <div className="max-w-2xl mx-auto text-center">
                        <motion.h3 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="font-display text-3xl font-bold text-white mb-4"
                        >
                            Stay Updated
                        </motion.h3>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="text-white/90 text-lg mb-8"
                        >
                            Get the latest news about new features, travel inspiration, and special offers.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.4 }}
                            className="flex max-w-md mx-auto"
                        >
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 border-0 rounded-l-2xl focus:outline-none focus:ring-4 focus:ring-white/30 text-secondary-900 placeholder-secondary-500"
                            />
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white text-primary-600 px-8 py-4 rounded-r-2xl hover:bg-secondary-50 transition-all duration-300 font-semibold shadow-soft"
                            >
                                Subscribe
                            </motion.button>
                        </motion.div>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.5 }}
                            className="text-xs text-white/70 mt-4"
                        >
                            By subscribing, you agree to our Privacy Policy and Terms of Service.
                        </motion.p>
                    </div>
                </motion.div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-secondary-900 text-white">
                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="container mx-auto px-4 py-8"
                >
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">
                        {/* Logo and Copyright */}
                        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
                            <Link to="/" className="flex items-center group">
                                <motion.div
                                    whileHover={{ rotate: -10, scale: 1.1 }}
                                    className="relative"
                                >
                                    <FaAirbnb className="text-3xl text-primary-400 group-hover:text-primary-300 transition-colors duration-300" />
                                    <motion.div
                                        className="absolute inset-0 bg-primary-400/20 rounded-full blur-xl"
                                        animate={{ scale: [1, 1.2, 1] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </motion.div>
                                <span className="font-display text-2xl font-bold gradient-text ml-3">Roomify</span>
                            </Link>
                            <span className="hidden md:inline text-secondary-400">|</span>
                            <p className="text-sm text-secondary-300">
                                © {currentYear} Roomify, Inc. All rights reserved
                            </p>
                        </div>

                        {/* Links and Social */}
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
                            {/* Legal Links */}
                            <div className="flex items-center space-x-6 text-sm">
                                <motion.button 
                                    whileHover={{ scale: 1.05 }}
                                    className="flex items-center text-secondary-300 hover:text-white transition-colors duration-300"
                                >
                                    <FaGlobe className="mr-2" />
                                    English (US)
                                </motion.button>
                                <span className="text-secondary-600">·</span>
                                <Link to="/privacy" className="text-secondary-300 hover:text-primary-400 transition-colors duration-300">
                                    Privacy
                                </Link>
                                <span className="text-secondary-600">·</span>
                                <Link to="/terms" className="text-secondary-300 hover:text-primary-400 transition-colors duration-300">
                                    Terms
                                </Link>
                                <span className="text-secondary-600">·</span>
                                <Link to="/sitemap" className="text-secondary-300 hover:text-primary-400 transition-colors duration-300">
                                    Sitemap
                                </Link>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-center space-x-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.2, y: -2 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="p-3 text-secondary-400 hover:text-white transition-colors duration-300 hover:bg-white/10 rounded-full"
                                        aria-label={social.name}
                                    >
                                        <social.icon className="text-lg" />
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;