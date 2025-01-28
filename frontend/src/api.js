import axios from 'axios';
import { ACCESS_TOKEN, REFRESH_TOKEN } from './constants';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Request Interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If Unauthorized (401) and retryable, refresh the token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Prevent infinite retry loops
            const refreshToken = localStorage.getItem(REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/token/refresh/`, {
                        refresh: refreshToken,
                    });

                    // Update tokens and retry the original request
                    localStorage.setItem(ACCESS_TOKEN, data.access);
                    originalRequest.headers.Authorization = `Bearer ${data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    // Clear tokens if refresh fails
                    localStorage.removeItem(ACCESS_TOKEN);
                    localStorage.removeItem(REFRESH_TOKEN);
                }
            }
        }

        // Log other errors for debugging
        console.error('API Error:', error);

        return Promise.reject(error);
    }
);

export default api;
