import nodemailer from "nodemailer";
// Create a test account or replace with real credentials.
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: `${process.env.AUTH_EMAIL}`,
        pass: `${process.env.AUTH_PASS}`,
    },
});

export { transporter };



//---------------------------FOR GETTING AUTH_PASSWORD 1. GO TO GOOGLE ACCOUNT MANANGER 2. SEARCH APP PASSWORDS THERE 4. SETUP APP NAME 5. IT WILL GENERATE A CODE FOR YOU TO USE AS YOUR AUTH_PASSWORD------------------------