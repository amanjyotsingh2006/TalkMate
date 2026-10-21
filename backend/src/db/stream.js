import {StreamChat} from "stream-chat";
import "dotenv/config";

const apiKey = process.env.STREAM_API_KEY;
const apiSecret = process.env.STREAM_API_SECRET;

if(!apiKey || !apiSecret) {
    console.log("Stream API Key or Secret is missing")
}

export const streamClient = StreamChat.getInstance(apiKey, apiSecret);

export const upsertStreamUser = async function (userData) {
    try {
        await streamClient.upsertUser(userData);
        return userData;
    } catch (error) {
        console.log("Error creating Stream user:", error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString();
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.log("Error in generating stream token:", error);
    }
};