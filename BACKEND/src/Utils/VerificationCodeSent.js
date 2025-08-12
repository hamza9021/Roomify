import { transporter } from "../Services/emailVerification.js";

const sendVerificationCode = async (email, otp) => {
    try {
        const emailTemplate = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Email Verification</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    padding: 20px 0;
                    background-color: #E04E54;
                    color: white;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 0 0 8px 8px;
                }
                .otp-container {
                    margin: 20px 0;
                    text-align: center;
                }
                .otp-code {
                    display: inline-block;
                    padding: 15px 25px;
                    font-size: 24px;
                    font-weight: bold;
                    background-color: #E04E54;
                    color: white;
                    border-radius: 5px;
                    letter-spacing: 3px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 12px;
                    text-align: center;
                    color: #777;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #FF5A5F;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Welcome to ROOMIFY</h1>
            </div>
            <div class="content">
                <p>Hello,</p>
                <p>Thank you for registering with ROOMIFY. To complete your registration, please verify your email address by entering the following One-Time Password (OTP):</p>
                
                <div class="otp-container">
                    <div class="otp-code">${otp}</div>
                </div>
                
                <p>This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.</p>
                
                <p>Best regards,<br>The ROOMIFY Team</p>
            </div>
            <div class="footer">
                <p>© ${new Date().getFullYear()} ROOMIFY. All rights reserved.</p>
                <p>If you're having trouble with the button above, copy and paste the OTP code directly.</p>
            </div>
        </body>
        </html>
        `;

        const response = await transporter.sendMail({
            from: `"ROOMIFY" <${process.env.AUTH_EMAIL}>`,
            to: email,
            subject: "Verify Your ROOMIFY Email Address",
            text: `Your ROOMIFY verification code is: ${otp}\n\nThis code will expire in 10 minutes.`, // plain-text fallback
            html: emailTemplate,
        });

        console.log("Email sent: ", response.messageId);
        return { success: true, message: "Verification email sent" };
    } catch (error) {
        console.error("Error sending email: ", error);
        return { success: false, message: "Failed to send verification email" };
    }
};

export { sendVerificationCode };