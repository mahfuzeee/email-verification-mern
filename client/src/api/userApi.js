import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const userApi = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

// Force headers on every single request type
api.defaults.withCredentials = true;

userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default userApi;
