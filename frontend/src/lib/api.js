import { axiosInstance } from "./axios";

export const signup = async (signupData) => {
    const response = await axiosInstance.post("/auth/signup", signupData);
    return response.data;
}

export const loginDetails = async (loginData) => {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
}

export const getAuthUser = async () =>{
    const res = await axiosInstance.get("/auth/me");
    return res.data;
}

export const completeOnboarding = async (onboardingData) => {
    const response = await axiosInstance.post("/auth/onboarding", onboardingData);
    return response.data;
}