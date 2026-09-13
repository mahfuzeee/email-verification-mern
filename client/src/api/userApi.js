import axios from "axios";

const baseUrl = import.meta.env.VITE_BASE_URL;

const userApi = axios.create({
  baseURL: baseUrl,
});

export default userApi;
