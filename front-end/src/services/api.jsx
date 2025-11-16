import axios from "axios";
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "../auth/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === "true",
});

// Add access token to headers
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (original?.url?.includes("/auth/login")) {
      return Promise.reject(err);
    }

    if (err.response?.status !== 401) {
      return Promise.reject(err);
    }

    if (original._retry) {
      return Promise.reject(err);
    }
    original._retry = true;

    try {
      const refreshRes = await api.post("/auth/refresh");
      const newToken = refreshRes.data.accessToken;

      setAccessToken(newToken);

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch {
      clearAccessToken();
      window.location.href = "/login";
      return Promise.reject(err);
    }
  }
);


// API functions
export const loginApi = async (payload) => {
  const res = await api.post("/auth/login", payload);
  setAccessToken(res.data.accessToken);
  return res.data;
};

export const logoutApi = async () => {
  await api.post("/auth/logout");
  clearAccessToken();
};

export const meApi = async () => {
  const res = await api.get("/user/me");
  return res.data;
};

export const registerApi = async (payload) => {
  const res = await api.post("/user/register", payload);
  return res.data;
};

export const checkEmailApi = async (email) => {
  const res = await api.get(`/user/check-email?email=${email}`);
  return res.data;
};
