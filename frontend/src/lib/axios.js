import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://talkmate-backend.vercel.app/api",
  withCredentials: true,
});