import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRouter } from "./Routes/user.routes.js";
import { listingRouter } from "./Routes/listing.routes.js";
import { reviewRouter } from "./Routes/review.routes.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(cookieParser());
app.use(express.static("./public"));

//ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);
export { app };
