import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config({path: "./.env"});

const googleConfig = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  "postmessage" 
);

export { googleConfig };
