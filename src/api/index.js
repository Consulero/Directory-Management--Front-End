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

export const getFiles = (page = 1, archived = false) =>
  api.get(`/pdf-manuals?page=${page}&archived=${archived}`);

export const uploadFiles = (formData) => api.post(`/pdf-manuals`, formData);

export const archiveFiles = (data) => api.patch(`/pdf-manuals/archive`, data);

export const deleteFiles = (data) => api.post(`/pdf-manuals/bulk`, data);

export const dashboardData = () => api.get(`/pdf-manuals/dashboard`);

export const updateFiles = (formData, id) =>
  api.put(`/pdf-manuals/${id}`, formData);

export const getFaqs = (page = 1) => api.get(`/faqs?page=${page}`);

export const approveFaq = (data) => api.patch(`/faqs/archive`, data);

export const fineTune = () => api.get(`/faqs/finetune`);

export default api;
