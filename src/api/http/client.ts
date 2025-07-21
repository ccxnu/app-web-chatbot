import axios, { AxiosError, type AxiosInstance } from "axios";
import { STORAGE_KEYS } from "@/api/http/types";

export const axiosClient: AxiosInstance = (() => {
  return axios.create({
    //baseURL: import.meta.env.VITE_BASE_URL,
    baseURL: "http://localhost:3000/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    timeout: 5000, // 5 seconds
    withCredentials: true,
  });
})();


axiosClient.interceptors.request.use(
    (config) =>
    {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

        if (token && config.headers)
        {
            config.headers.Authorization = `Bearer ${token}`;
            config.headers.set("Authorization-Basic", "ocecuhoecuh");
        }

        return config;
    },
    (error: AxiosError): Promise<AxiosError> =>
    {
        return Promise.reject(error);
    },
);

axiosClient.interceptors.response.use(
    response =>
    {
        return response;
    },
    (error: AxiosError): Promise<AxiosError> =>
    {
        return Promise.reject(error);
    },
);
