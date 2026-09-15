import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const userApi = axios.create({
  baseURL: baseUrl,
});

userApi.defaults.withCredentials = true;
userApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default userApi;
