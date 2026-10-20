import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../db/stream.js"

import { OAuth2Client } from "google-auth-library";
import { generateAccessToken } from "../utils/generateToken.js";

const googleClient = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID
);



// SignUp Logic
export async function signup(req, res) {
    const { fullName, email, password } = req.body;

    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be atleast 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid Email Format" });
        }

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            return res.status(400).json({ message: "Email already exist, please use a different one" });
        }

        const idx = Math.floor(Math.random() * 1000) + 1;
        const randomAvatar = `https://api.dicebear.com/9.x/adventurer/svg?seed=${idx}`

        const newUser = await User.create({
            email,
            fullName,
            password,
            profilePic: randomAvatar
        });

        try {
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                profilePic: newUser.profilePic || ""
            });
            console.log(`Stream user created for ${newUser.fullName}`);
        } catch (error) {
            console.log("Error creating stream user", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: "7d"
        })

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === "production"
        })

        res.status(201).json({ success: true, user: newUser })
    } catch (error) {
        console.log("Error is signup controller: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


// Login Logic
export async function login(req, res) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid email or password" });

        if (!user.password) {
            return res.status(400).json({ message: "This account uses Google Login. Please continue with Google." })
        }

        const isPasswordCorrect = await user.matchPassword(password)
        if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: true,
            secure: process.env.NODE_ENV === "production"
        });

        res.status(200).json({ success: true, user });

    } catch (error) {
        console.log("Error in login controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }

}



// Logout Logic
export function logout(req, res) {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: "Logout Successfully" })
}



// Google Login Logic
export const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        if (!credential) {
            return res.status(400).json({
                success: false,
                message: "Google credential is required"
            });
        }

        // Verify Google credential
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();

        const {
            sub,
            email,
            name,
            picture
        } = payload;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Google email not available"
            });
        }

        // Find existing user
        let user = await User.findOne({ email });

        // Create user if not found
        if (!user) {
            user = await User.create({
                fullName: name || "Google User",
                email: email,
                password: null,
                googleId: sub,
                profilePic: picture || "",
                isOnboarded: false
            });
        } else {
            // Link Google account if user already exists
            if (!user.googleId) {
                user.googleId = sub;
                await user.save({
                    validateBeforeSave: false
                });
            }
        }

        // Generate access token
        const accessToken = generateAccessToken(user);

        // Store JWT in cookie
        res.cookie("jwt", accessToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax",
            secure: false
        });

        // Remove password before sending user
        const loggedInUser = await User.findById(user._id)
            .select("-password");

        return res.status(200).json({
            success: true,
            message: "Google login successful",
            user: loggedInUser
        });

    } catch (error) {
        console.error("GOOGLE LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Google login failed",
            error: error.message
        });
    }
};


// Onboard Logic
export async function onboard(req, res) {
    try {
        const userId = req.user._id;

        const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

        if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
            return res.status(400).json({
                message: "All fields are required",
                missingFields: [
                    !fullName && "fullName",
                    !bio && "bio",
                    !nativeLanguage && "nativeLanguage",
                    !learningLanguage && "learningLanguage",
                    !location && "location"
                ].filter(Boolean)
            })
        }

        const updatedUser = await User.findByIdAndUpdate(userId, {
            ...req.body,
            isOnboarded: true
        }, { new: true })

        if (!updatedUser) return res.status(404).json({ message: "User not found" })

        res.status(200).json({ success: true, user: updatedUser })

        try {
            await upsertStreamUser({
                id: updatedUser._id.toString(),
                name: updatedUser.fullName,
                image: updatedUser.profilePic
            })
            console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
        } catch (streamError) {
            console.log("Error updating Stream user during onboarding:", streamError.message);
        }
    } catch (error) {

    }
}