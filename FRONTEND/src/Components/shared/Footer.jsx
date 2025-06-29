import { Link } from "react-router-dom";
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

    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
            {/* Main Footer Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {footerSections.map((section, index) => (
                        <div key={index} className="space-y-4">
                            <h3 className="font-semibold text-gray-900 text-lg">
                                {section.title}
                            </h3>
                            <ul className="space-y-3">
                                {section.links.map((link, linkIndex) => (
                                    <li key={linkIndex}>
                                        <Link
                                            to={link.to}
                                            className="flex items-center text-gray-600 hover:text-rose-500 transition duration-200 text-sm"
                                        >
                                            <link.icon className="mr-2 text-xs" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Mobile App Section */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-4">
                            <FaMobile className="text-2xl text-gray-600" />
                            <div>
                                <h4 className="font-medium text-gray-900">Get the Roomify App</h4>
                                <p className="text-sm text-gray-600">Book your next stay on the go</p>
                            </div>
                        </div>
                        <div className="flex space-x-3">
                            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 text-sm">
                                App Store
                            </button>
                            <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-200 text-sm">
                                Google Play
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="bg-white border-t border-gray-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        {/* Logo and Copyright */}
                        <div className="flex items-center space-x-4">
                            <Link to="/" className="flex items-center text-rose-500 hover:text-rose-600 transition">
                                <FaAirbnb className="text-2xl mr-2" />
                                <span className="text-lg font-bold">Roomify</span>
                            </Link>
                            <span className="hidden md:inline text-gray-400">|</span>
                            <p className="text-sm text-gray-600">
                                © {currentYear} Roomify, Inc. All rights reserved
                            </p>
                        </div>

                        {/* Links and Social */}
                        <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                            {/* Legal Links */}
                            <div className="flex items-center space-x-4 text-sm">
                                <button className="flex items-center text-gray-600 hover:text-gray-900 transition">
                                    <FaGlobe className="mr-1" />
                                    English (US)
                                </button>
                                <span className="text-gray-300">·</span>
                                <Link to="/privacy" className="text-gray-600 hover:text-rose-500 transition">
                                    Privacy
                                </Link>
                                <span className="text-gray-300">·</span>
                                <Link to="/terms" className="text-gray-600 hover:text-rose-500 transition">
                                    Terms
                                </Link>
                                <span className="text-gray-300">·</span>
                                <Link to="/sitemap" className="text-gray-600 hover:text-rose-500 transition">
                                    Sitemap
                                </Link>
                            </div>

                            {/* Social Media */}
                            <div className="flex items-center space-x-3">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`p-2 text-gray-600 ${social.color} transition duration-200 hover:bg-gray-100 rounded-full`}
                                        aria-label={social.name}
                                    >
                                        <social.icon className="text-lg" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter Subscription */}
            <div className="bg-gray-100 border-t border-gray-200">
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Stay Updated
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Get the latest news about new features, travel inspiration, and special offers.
                        </p>
                        <div className="flex max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                            />
                            <button className="bg-rose-500 text-white px-6 py-3 rounded-r-lg hover:bg-rose-600 transition duration-200 font-medium">
                                Subscribe
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            By subscribing, you agree to our Privacy Policy and Terms of Service.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;