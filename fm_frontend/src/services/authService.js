import API from "./api";

/**
 * Authentication Service
 * Handles all auth-related API calls and session management.
 */
const authService = {
  /**
   * Log in a user and set the session.
   * @param {Object} credentials {username, password}
   */
  login: async (credentials) => {
    const response = await API.post("/login/", credentials);
    if (response.data) {
      localStorage.setItem("isLoggedIn", "true");
    }
    return response.data;
  },

  /**
   * Register a new user.
   * @param {Object} userData {username, email, password, password2}
   */
  signup: async (userData) => {
    const response = await API.post("/signup/", userData);
    return response.data;
  },

  /**
   * Log out the current user and clear the session.
   */
  logout: async () => {
    try {
      await API.post("/logout/");
    } finally {
      // Always clear local storage even if the API call fails
      localStorage.removeItem("isLoggedIn");
    }
  },

  /**
   * Check if the user is currently logged in.
   * @returns {boolean}
   */
  isAuthenticated: () => {
    return localStorage.getItem("isLoggedIn") === "true";
  },
};

export default authService;
