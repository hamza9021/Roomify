import { Router } from "express";
import passport from "passport";

const authRouter = Router();


//GOOGLE OAUTH
authRouter.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

authRouter.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/auth/failure",
        session: false,
    }),
    (req, res) => {
        res.cookie("accessToken", req.user.tokens.jwtAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.cookie("refreshToken", req.user.tokens.jwtRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.redirect("http://localhost:5173/");
    }
);

//GITHUB OAUTH
authRouter.get(
    "/github",
    passport.authenticate("github", {
        scope: ["user:email"],
        session: false,
    })
);

authRouter.get(
    "/github/callback",
    passport.authenticate("github", {
        failureRedirect: "/auth/failure",
        session: false,
    }),
    (req, res) => {
        // Same token handling as Google
        res.cookie("accessToken", req.user.tokens.jwtAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.cookie("refreshToken", req.user.tokens.jwtRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        res.redirect("http://localhost:5173/");
    }
);

authRouter.get("/failure", (req, res) => {
    res.redirect("http://localhost:5173/login");
});

export { authRouter };
