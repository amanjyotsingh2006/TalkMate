import jwt from "jsonwebtoken";

export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            userId: user._id
        },
        process.env.JWT_SECRET_KEY,
        {
            expiresIn: "7d"
        }
    );
};