import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

import axiosInstance from "../api/axiosInstance.js";

const AuthContext = createContext(null);

function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  function applyUser(nextUser) {
    setUser(nextUser);
  }

  async function resolveSession() {
    const response = await axiosInstance.get("/api/auth/me");
    return response.data.user ?? null;
  }

  async function refreshSession() {
    try {
      const nextUser = await resolveSession();
      applyUser(nextUser);
      return nextUser;
    } catch {
      applyUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }

  function syncUser(nextUser) {
    applyUser(nextUser);
  }

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const nextUser = await resolveSession();

        if (!isMounted) {
          return;
        }

        applyUser(nextUser);
      } catch {
        if (!isMounted) {
          return;
        }

        applyUser(null);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    function handleUnauthorized() {
      applyUser(null);
    }

    hydrateSession();
    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  async function login(payload) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, payload, {
        withCredentials: true
      });
      applyUser(response.data.user);
      return response.data.user;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Login failed"));
    }
  }

  async function register(payload) {
    try {
      const response = await axiosInstance.post("/api/auth/register", payload);
      return response.data;
    } catch (error) {
      throw new Error(getErrorMessage(error, "Registration failed"));
    }
  }

  async function logout() {
    try {
      await axiosInstance.post("/api/auth/logout");
    } finally {
      applyUser(null);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshSession,
        register,
        syncUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
