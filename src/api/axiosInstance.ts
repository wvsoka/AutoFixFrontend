import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:8000";

const axiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const { exp } = jwtDecode<{ exp: number }>(accessToken);
                const now = Date.now() / 1000;
                if (exp && exp - now < 60) {
                    const refreshToken = localStorage.getItem("refreshToken");
                    if (refreshToken) {
                        const response = await axios.post(
                            `${API_URL}/api/auth/refresh/`,
                            { refresh: refreshToken }
                        );
                        const newAccess = response.data.access;
                        localStorage.setItem("accessToken", newAccess);
                        config.headers.Authorization = `Bearer ${newAccess}`;
                        return config;
                    }
                }
            } catch {}
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refreshToken");
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        `${API_URL}/api/auth/refresh/`,
                        { refresh: refreshToken }
                    );
                    const newAccess = response.data.access;
                    localStorage.setItem("accessToken", newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return axiosInstance(originalRequest);
                } catch {
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
