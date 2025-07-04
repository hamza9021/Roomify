import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./Routes/user.routes.js";
import { listingRouter } from "./Routes/listing.routes.js";
import { reviewRouter } from "./Routes/review.routes.js";
import { messageRouter } from "./Routes/message.routes.js";
import { authRouter } from "./Routes/auth.routes.js";
// import { wishListRouter } from "./Routes/wishlist.routes.js";
import { bookingRouter } from "./Routes/booking.routes.js";
import "./Services/passport.js";

app.set('trust proxy', 1);
const allowedOrigins = [
  "https://roomify-crs5.vercel.app",
  "http://localhost:3000"
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("./public"));
app.use(passport.initialize());

// Routes
app.use("/auth",authRouter);

app.get("/", (req, res) => {
  res.send(`<a href="/auth/google">Login with Google</a>`);
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
// app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/booking", bookingRouter);

export { app };
