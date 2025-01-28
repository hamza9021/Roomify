import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(cors({ credentials: true, origin: process.env.CORS_ORIGIN }));
app.use(cookieParser());
app.use(express.static("./public"));

export { app };
