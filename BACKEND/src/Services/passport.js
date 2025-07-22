import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../Models/user.models.js";
import { generateAccessAndRefreshToken } from "../Utils/generateAccessAndRefreshToken.js";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:
                process.env.NODE_ENV === "development"
                    ? "https://roomify-44mj.onrender.com/auth/google/callback"
                    : "http://localhost:8080/auth/google/callback",
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
                        phoneNumber: Math.floor(Math.random() * 10000000000),
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

passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: "/auth/github/callback",
            passReqToCallback: true,
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                console.log("GitHub Profile:", profile);

                let email;
                if (profile.emails && profile.emails.length > 0) {
                    email = profile.emails[0].value;
                } else {
                    email = `${profile.username}@users.noreply.github.com`;
                }

                let user = await User.findOne({ email });

                if (!user) {
                    user = new User({
                        name: profile.displayName || profile.username,
                        email: email,
                        password: "GITHUB_OAUTH_USER",
                        profileImage: profile.photos?.[0]?.value || "",
                        phoneNumber: Math.floor(Math.random() * 10000000000),
                        bio: profile.bio || "",
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
