import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: ["https://talkmate-backend.vercel.app/api", "https://talkmate-backend-9mpuqmj5k-grace-2362.vercel.app/"],
  withCredentials: true,
});