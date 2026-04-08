import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:8001",
});

// ---------------- TOKEN HELPERS ----------------
const getAccessToken = () => localStorage.getItem("access");
const getRefreshToken = () => localStorage.getItem("refresh");

// ---------------- REQUEST INTERCEPTOR ----------------
API.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------------- RESPONSE INTERCEPTOR ----------------
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 Skip refresh logic for Login and Signup
    if (originalRequest.url.includes("/login/") || originalRequest.url.includes("/signup/")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refresh = getRefreshToken();
        if (!refresh) throw new Error("No refresh token");

        const res = await axios.post(
          "http://127.0.0.1:8001/api/token/refresh/",
          { refresh }
        );

        // ✅ Save new access token
        localStorage.setItem("access", res.data.access);

        // ✅ Retry request
        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);

      } catch (err) {
        // ❌ Refresh failed → logout
        localStorage.clear();
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

// ---------------- LOGIN ----------------
export const loginUser = async (data) => {
  const response = await API.post("/login/", data);

  if (response.data?.tokens) {
    localStorage.setItem("access", response.data.tokens.access);
    localStorage.setItem("refresh", response.data.tokens.refresh);
    localStorage.setItem("username", response.data.user.username);
  }

  return response.data;
};

// ---------------- SIGNUP ----------------
export const signupUser = async (data) => {
  const response = await API.post("/signup/", data);

  if (response.data?.tokens) {
    localStorage.setItem("access", response.data.tokens.access);
    localStorage.setItem("refresh", response.data.tokens.refresh);
  }

  return response.data;
};

// ---------------- LOGOUT ----------------
export const logoutUser = async () => {
  const refresh = localStorage.getItem("refresh");

  try {
    await API.post("/logout/", { refresh });
  } catch (err) {
    console.error(err);
  } finally {
    localStorage.clear();
  }
};

// ---------------- ADD EXPENSE ----------------
export const addExpense = async (data) => {
  const response = await API.post("/add-expense/", data);
  return response.data;
};

// ---------------- GET CATEGORIES ----------------
export const getCategories = async () => {
  const response = await API.get("/categories/");
  return response.data;
};

// ---------------- GET EXPENSES ----------------
export const getExpenses = async (params = {}) => {
  const response = await API.get("/show-expenses/", { params });
  return response.data;
};

export default API;