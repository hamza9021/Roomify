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
import "./Services/passport.js";

const corsOptions = {
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
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

export { app };
