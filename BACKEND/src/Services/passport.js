import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../Models/user.models.js";
import { generateAccessAndRefreshToken } from "../Utils/generateAccessAndRefreshToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            passReqToCallback: true, 
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails[0].value;

                let user = await User.findOne({ email });

                if (!user) {
                    user = new User({
                        name: profile.displayName,
                        email: email,
                        password: "GOOGLE_OAUTH_USER", 
                        profileImage: profile.photos?.[0]?.value || "",
                        bio: "",
                        joinedDate: new Date(),
                        isHost: false,
                        isVerified: true,
                        roles: "User",
                        listings: [],
                        savedListings: [],
                        bookings: [],
                        reviews: [],
                        messages: [],
                        notifications: [],
                        preferredLanguages: [],
                        paymentMethods: [],
                        verificationDocuments: [],
                    });
                    await user.save();
                }

                const {
                    accessToken: jwtAccessToken,
                    refreshToken: jwtRefreshToken,
                } = await generateAccessAndRefreshToken(user._id);

                user.tokens = { jwtAccessToken, jwtRefreshToken };

                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);
