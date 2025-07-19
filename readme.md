# 🏠 Roomify - Your Home Away From Home

<div align="center">

![Roomify Logo](https://img.shields.io/badge/Roomify-🏠-blue?style=for-the-badge&logo=home&logoColor=white)

**A modern, full-stack accommodation booking platform inspired by Airbnb**

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[🚀 Live Demo](#) • [📖 Documentation](#installation) • [🐛 Report Bug](#contributing) • [💡 Request Feature](#contributing)

</div>

---

## ✨ Features

### 🏡 **Property Management**
- **Create & Manage Listings** - Hosts can create detailed property listings with photos, amenities, and pricing
- **30+ Property Categories** - From apartments and houses to unique stays like treehouses, castles, and boats
- **Advanced Search & Filtering** - Search by location, price, guests, property type, and amenities
- **Interactive Maps** - MapTiler integration for location visualization
- **Photo Gallery** - Upload up to 8 high-quality images per listing

### 👥 **User Experience**
- **Dual Role System** - Users can be both guests and hosts
- **Secure Authentication** - Email/password login with Google & GitHub OAuth integration
- **Profile Management** - Comprehensive user profiles with verification system
- **Wishlist & Favorites** - Save and organize favorite properties
- **Booking Management** - Track past, current, and upcoming reservations

### 💬 **Communication & Reviews**
- **Real-time Messaging** - Direct communication between hosts and guests
- **Review System** - Rate and review properties and experiences
- **Notifications** - Stay updated with booking confirmations and messages
- **Host Dashboard** - Manage all listings, bookings, and guest communications

### 🔒 **Security & Trust**
- **JWT Authentication** - Secure token-based authentication
- **Password Encryption** - Bcrypt hashing for password security
- **User Verification** - Document upload for identity verification
- **Secure File Upload** - Cloudinary integration for image management

---

## 🛠️ Tech Stack

### **Frontend**
- **React 18.3.1** - Modern UI library with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Material-UI** - React component library
- **Vite** - Fast build tool and development server
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Comprehensive icon library
- **MapTiler SDK** - Interactive maps and geolocation

### **Backend**
- **Node.js & Express** - Server-side JavaScript runtime and framework
- **MongoDB & Mongoose** - NoSQL database with ODM
- **JWT** - JSON Web Tokens for authentication
- **Passport.js** - Authentication middleware with OAuth strategies
- **Bcrypt** - Password hashing
- **Cloudinary** - Cloud-based image and video management
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

### **Development Tools**
- **ESLint** - Code linting and formatting
- **Prettier** - Code formatting
- **Nodemon** - Development server auto-restart
- **dotenv** - Environment variable management

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud instance)
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/roomify.git
   cd roomify
   ```

2. **Backend Setup**
   ```bash
   cd BACKEND
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend Setup**
   ```bash
   cd ../FRONTEND
   npm install
   ```

4. **Environment Configuration**
   
   Update `BACKEND/.env` with your credentials:
   ```env
   CORS_ORIGIN="http://localhost:5173"
   PORT=8080
   
   MONGODB_URL="mongodb://localhost:27017/roomify"
   
   ACCESS_TOKEN_SECRET=your_access_token_secret
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   REFRESH_TOKEN_EXPIRY=10d
   
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

5. **Start the Application**
   
   **Backend** (Terminal 1):
   ```bash
   cd BACKEND
   npm run start
   ```
   
   **Frontend** (Terminal 2):
   ```bash
   cd FRONTEND
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

---

## 📁 Project Structure

```
Roomify/
├── FRONTEND/                 # React frontend application
│   ├── src/
│   │   ├── Components/       # React components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Listings/     # Property listing components
│   │   │   ├── Messages/     # Messaging components
│   │   │   ├── Profile Update/ # User profile components
│   │   │   └── shared/       # Shared components (Navbar, Footer)
│   │   ├── utils/            # Utility functions and configurations
│   │   ├── App.jsx           # Main application component
│   │   └── main.jsx          # Application entry point
│   ├── public/               # Static assets
│   └── package.json          # Frontend dependencies
│
├── BACKEND/                  # Node.js backend application
│   ├── src/
│   │   ├── Controllers/      # Request handlers
│   │   ├── Models/           # MongoDB schemas
│   │   ├── Routes/           # API route definitions
│   │   ├── Middlewares/      # Custom middleware functions
│   │   ├── Services/         # Business logic and external services
│   │   ├── Utils/            # Utility functions
│   │   ├── app.js            # Express application setup
│   │   └── index.js          # Server entry point
│   ├── Public/               # Static file serving
│   └── package.json          # Backend dependencies
│
└── README.md                 # Project documentation
```

---

## 🔧 API Endpoints

### **Authentication**
- `POST /auth/google` - Google OAuth login
- `POST /auth/github` - GitHub OAuth login

### **Users**
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/update` - Update user profile
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login

### **Listings**
- `GET /api/v1/listings` - Get all listings
- `GET /api/v1/listings/search` - Search listings
- `GET /api/v1/listings/:id` - Get listing details
- `POST /api/v1/listings` - Create new listing
- `PUT /api/v1/listings/:id` - Update listing
- `DELETE /api/v1/listings/:id` - Delete listing

### **Bookings**
- `GET /api/v1/booking` - Get user bookings
- `POST /api/v1/booking` - Create booking
- `PUT /api/v1/booking/:id` - Update booking
- `DELETE /api/v1/booking/:id` - Cancel booking

### **Reviews**
- `GET /api/v1/reviews/:listingId` - Get listing reviews
- `POST /api/v1/reviews` - Create review
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

### **Messages**
- `GET /api/v1/messages` - Get user messages
- `POST /api/v1/messages` - Send message

### **Wishlist**
- `GET /api/v1/wishlist` - Get user wishlist
- `POST /api/v1/wishlist` - Add to wishlist
- `DELETE /api/v1/wishlist/:id` - Remove from wishlist

---

## 🎨 Key Features Showcase

### **Property Categories**
Roomify supports 30+ unique property categories including:
- 🏠 Traditional: Apartment, House, Hotel, Hostel, Resort, Villa
- 🏰 Unique: Castle, Cave, Treehouse, Windmill, Yurt, Dome
- 🏖️ Location-based: Beach, Lakefront, Desert, Island, Tropical
- 🎯 Special: OMG!, Luxe, Design, Off-the-grid, Tiny home

### **Advanced Search**
- Location-based search with map integration
- Price range filtering
- Guest capacity filtering
- Property type and amenities filtering
- Date availability checking

### **User Roles**
- **Guests**: Browse, book, review properties
- **Hosts**: Create listings, manage bookings, communicate with guests
- **Dual Role**: Users can seamlessly switch between guest and host modes

---

## 🤝 Contributing

We welcome contributions to Roomify! Here's how you can help:

### **Getting Started**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### **Development Guidelines**
- Follow the existing code style and conventions
- Write clear, descriptive commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

### **Areas for Contribution**
- 🐛 Bug fixes and improvements
- ✨ New features and enhancements
- 📚 Documentation improvements
- 🎨 UI/UX enhancements
- 🔧 Performance optimizations
- 🧪 Test coverage improvements

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Hamza Riaz**
- GitHub: [@hamzariaz](https://github.com/hamzariaz)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Inspired by Airbnb's innovative platform
- Built with modern web technologies
- Thanks to the open-source community for amazing tools and libraries

---

## 📞 Support

If you have any questions or need help getting started:

- 📧 Email: support@roomify.com
- 💬 Create an issue on GitHub
- 📖 Check the documentation

---

<div align="center">

**⭐ Star this repository if you found it helpful!**

Made with ❤️ by [Hamza Riaz](https://github.com/hamzariaz)

</div>