import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const loginDetails = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const logout = async () =>{
    const response = await axiosInstance.post("/auth/logout");
    return response.data;
}

export const getAuthUser = async () =>{
    try{
    const res = await axiosInstance.get("/auth/me");
    return res.data;
    }catch(error){
        console.log("Error in getAuthUser API", error);
        return null;
    }
}

export const completeOnboarding = async (onboardingData) => {
    const response = await axiosInstance.post("/auth/onboarding", onboardingData);
    return response.data;
}

export const getUserFriendList = async()=>{
    const response = await axiosInstance.get("/users/friends")
    return response.data;
}

export const getUserRecommendList = async()=>{
    const response = await axiosInstance.get("/users/")
    return response.data.recommendedUsers;
}

export const getOutgoingFriendRequest = async()=>{
    const response = await axiosInstance.get("/users/outgoing-friend-request")
    return response.data;
}

export const sendFriendRequest = async (userId) =>{
    const response = await axiosInstance.post(`/users/friend-request/${userId}`);
    return response.data;   
}

export const getFriendRequest = async()=>{
    const response = await axiosInstance.get("/users/friend-request")
    return response.data;
}

export const acceptFriendRequest = async (reqId)=>{
    const response = await axiosInstance.put(`/users/friend-request/${reqId}/accept`);
    return response.data;   
}

export const getStreamToken = async()=>{
    const response = await axiosInstance.get("/chat/token")
    return response.data;
}