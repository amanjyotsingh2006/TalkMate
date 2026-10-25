import mongoose from "mongoose";

const cached = global._mongoose || (global._mongoose = { conn: null, promise: null });

export const connectDB = async () => {
    if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(process.env.MONGO_URL, {
                serverSelectionTimeoutMS: 8000,
                maxPoolSize: 5,
            })
            .catch((err) => {
                cached.promise = null; // allow retry on next request
                throw err;
            });
    }

    cached.conn = await cached.promise;
    return cached.conn;
};