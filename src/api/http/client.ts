import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from "axios";
import { STORAGE_KEYS } from "@/api/http/types";
import { adminRefreshToken } from "@/api/services/auth/admin-auth.api";

export const axiosClient: AxiosInstance = (() => {
    return axios.create({
        //baseURL: import.meta.env.VITE_BASE_URL,
        baseURL: "http://localhost:8080/",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        timeout: 10000, // 5 seconds
        withCredentials: false,
    });
})();


axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (token && config.headers) {
            config.headers.set("X-App-Authorization", "X-Auth wiaAchcHks3rBxIhJQem1nLoMDwdoQ==");
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError): Promise<AxiosError> => {
        return Promise.reject(error);
    },
);

// Track if token refresh is in progress to avoid multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axiosClient.interceptors.response.use(
    response => {
        return response;
    },
    async (error: AxiosError): Promise<any> => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // Handle 401 errors with token refresh
        if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
            // Skip refresh for auth endpoints to avoid infinite loops
            if (originalRequest.url?.includes('/admin/auth/')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue requests while refresh is in progress
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            const refreshTokenValue = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (!refreshTokenValue) {
                processQueue(error, null);
                isRefreshing = false;
                // Clear auth and redirect to login
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_INFO);
                return Promise.reject(error);
            }

            try {
                const data = await adminRefreshToken(refreshTokenValue);

                // Update tokens
                localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);
                localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
                localStorage.setItem(STORAGE_KEYS.ID_SESSION, data.idSession);

                if (data.user) {
                    localStorage.setItem(STORAGE_KEYS.ADMIN_USER_INFO, JSON.stringify(data.user));
                }

                // Update axios default headers
                if (axiosClient.defaults.headers.common) {
                    axiosClient.defaults.headers.common.Authorization = `Bearer ${data.accessToken}`;
                }

                // Update current request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                }

                processQueue(null, data.accessToken);
                isRefreshing = false;

                return axiosClient(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
                isRefreshing = false;

                // Clear tokens and redirect to login
                localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                localStorage.removeItem(STORAGE_KEYS.ADMIN_USER_INFO);

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    },
);
