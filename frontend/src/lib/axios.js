import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "https://talkmate-backend.vercel.app/api",
  withCredentials: true,
});