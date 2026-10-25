import { axiosInstance } from "./axios.js"

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData)
    return response.data
};

export const login = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData)
    return response.data
}

export const logout = async () => {
    const response = await axiosInstance.post("/auth/logout")
    return response.data
}

export const getAuthUser = async () => {
    try {
        const res = await axiosInstance.get("/auth/me");
        return res.data 
    } catch (error) {
        console.log("Error in getAuthUser", error);
        return null
    }
}

export const completeOnboarding = async (userData) => {
    const res = await axiosInstance.post("/auth/onboarding", userData)
    return res.data
}

export const getUserFriends = async () => {
    try {
        const res = await axiosInstance.get("/users/friends");
        return res.data 
    } catch (error) {
        console.log("Error in getUserFriends", error);
        return []
    }
}

export const getRecommendedUser = async () => {
    try {
        const res = await axiosInstance.get("/users");
        return res.data 
    } catch (error) {
        console.log("Error in getRecommendedUser", error);
        return []
    }
}

export const getOutgoingFriendReqs = async () => {
    try {
        const res = await axiosInstance.get("/users/outgoing-friend-requests")
        return res.data
    } catch (error) {
        console.log("Error in getOutgoingFriendReqs", error);
        return []
    }
}

export const sendFriendRequest = async (userId) => {
    try {
        const res = await axiosInstance.post(`/users/friend-request/${userId}`)
        return res.data
    } catch (error) {
        console.log("Error in sendFriendRequest", error)
        return []
    }
}

export const getFriendRequests = async () => {
    try {
        const res = await axiosInstance.get("/users/friend-request")
        return res.data
    } catch (error) {
        console.log("Error in getFriendRequests", error);
        return []
    }
}

export const acceptFriendRequest = async (requestId) => {
    try {
        const res = await axiosInstance.put(`/users/friend-request/${requestId}/accept`)
        return res.data
    } catch (error) {
        console.log("Error in acceptFriendRequest", error);
        return []
    }
}

export const getStreamToken = async () => {
    const res = await axiosInstance.get("/chat/token")
    return res.data
}

export const getProfileStats = async () => {
  const res = await axiosInstance.get("/users/profile-stats");
  return res.data;
};

export const addPracticeTime = async (seconds) => {
  const res = await axiosInstance.post("/users/practice-time", { seconds });
  return res.data;
};  


export const forgotPassword = async (email) => {
  const response = await axiosInstance.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async ({ token, password }) => {
  const response = await axiosInstance.post(`/auth/reset-password/${token}`, {
    password,
  });
  return response.data;
};