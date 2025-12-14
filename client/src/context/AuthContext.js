import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser({
      userId: data.userId,
      role: data.role,
      name: data.name,
      email: data.email,
      profilePhoto: data.profilePhoto,
      createdAt: data.createdAt,
    });
    return data;
  };

  const register = async (name, email, password, role = "user") => {
    const data = await authService.register(name, email, password, role);
    setUser({
      userId: data.userId,
      role: data.role,
      name: data.name,
      email: data.email,
      profilePhoto: data.profilePhoto,
      createdAt: data.createdAt,
    });
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const isAdmin = () => {
    return user?.role === "admin";
  };

  const isAuthenticated = () => {
    return !!user && !!authService.getToken();
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    const storedUser = authService.getCurrentUser();
    if (storedUser) {
      localStorage.setItem(
        "sweet_shop_user",
        JSON.stringify({
          ...storedUser,
          ...updatedUser,
        })
      );
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
