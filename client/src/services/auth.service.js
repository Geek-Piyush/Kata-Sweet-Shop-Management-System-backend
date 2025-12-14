import axios from "../utils/axios";

const authService = {
  login: async (email, password) => {
    const response = await axios.post("/auth/login", { email, password });
    if (response.data.token) {
      localStorage.setItem("sweet_shop_token", response.data.token);
      localStorage.setItem(
        "sweet_shop_user",
        JSON.stringify({
          userId: response.data.userId,
          role: response.data.role,
        })
      );
    }
    return response.data;
  },

  register: async (name, email, password, role = "user") => {
    const response = await axios.post("/auth/register", {
      name,
      email,
      password,
      role,
    });
    if (response.data.token) {
      localStorage.setItem("sweet_shop_token", response.data.token);
      localStorage.setItem(
        "sweet_shop_user",
        JSON.stringify({
          userId: response.data.userId,
          role: response.data.role,
        })
      );
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem("sweet_shop_token");
    localStorage.removeItem("sweet_shop_user");
    localStorage.removeItem("sweet_shop_cart");
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("sweet_shop_user");
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    return localStorage.getItem("sweet_shop_token");
  },

  isAuthenticated: () => {
    return !!localStorage.getItem("sweet_shop_token");
  },

  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user?.role === "admin";
  },
};

export default authService;
