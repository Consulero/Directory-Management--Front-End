import axios from "axios";

const api = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}/api`,
});

api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getFiles = (page = 1) => api.get(`/pdf-manuals?page=${page}`);
export const uploadFiles = (formData) => api.post(`/pdf-manuals`, formData);
export default api;
