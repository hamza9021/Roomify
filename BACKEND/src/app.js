import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./Routes/user.routes.js";
import { listingRouter } from "./Routes/listing.routes.js";
import { reviewRouter } from "./Routes/review.routes.js";

const corsOptions = {
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("./public"));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);

export { app };
