import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import { userRouter } from "./Routes/user.routes.js";
import { listingRouter } from "./Routes/listing.routes.js";
import { reviewRouter } from "./Routes/review.routes.js";
import { messageRouter } from "./Routes/message.routes.js";
import { authRouter } from "./Routes/auth.routes.js";
import { wishListRouter } from "./Routes/wishlist.route.js";
import { bookingRouter } from "./Routes/booking.routes.js";
import "./Services/passport.js";




app.set("trust proxy", 1);
// const sessionData = session({
//   name: "accessToken",
//   secret: process.env.ACCESS_TOKEN_SECRET || "default_secret",
//   resave: process.env.RESAVE === "true",
//   saveUninitialized: process.env.SAVE_UNINTIALIZED === "true", // should be false otherwise empty sessions wil be stored in database
//   cookie: {
//     maxAge: 140 * 24 * 60 * 60 * 1000, // 140 days
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production", // true if HTTPS in production
//     sameSite: process.env.NODE_ENV === "production" && "lax",
//     domain: process.env.COOKIE_DOMAIN || undefined,
//   },
//   rolling: process.env.ROLLING === "true",
//   store: MongoStore.create({
//     mongoUrl: process.env.MONGODB_URL,
//     collectionName: "user-sessions",
//     ttl: 14 * 24 * 60 * 60, // 14 days
//   }),
// });

// app.use(sessionData);


const corsOptions = {
    origin: [process.env.CORS_ORIGIN, process.env.CORS_LOCAL], //never add / after domain if not set
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
// app.use(passport.session());

// Routes
app.use("/auth", authRouter);

app.get("/", (req, res) => {
    res.send(`<a href="/auth/google">Login with Google</a>`);
});

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/wishlist", wishListRouter);
app.use("/api/v1/booking", bookingRouter);

export { app };
