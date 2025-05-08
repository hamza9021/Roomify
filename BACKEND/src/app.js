import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

// ✅ Fix: Explicitly set CORS for all routes
const corsOptions = {
  origin: process.env.CORS_ORIGIN, 
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS","PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


app.use(cors(corsOptions));


app.options("*", cors(corsOptions)); // Preflight response

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cookieParser());
app.use(express.static("./public"));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/listings", listingRouter);
app.use("/api/v1/reviews", reviewRouter);

export { app };