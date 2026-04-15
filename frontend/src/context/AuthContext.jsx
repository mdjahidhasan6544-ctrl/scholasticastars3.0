import { createContext, startTransition, useContext, useEffect, useState } from "react";

import { api } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function hydrateSession() {
      try {
        const response = await api.getCurrentUser();
        if (isMounted) {
          startTransition(() => {
            setUser(response.user ?? null);
          });
        }
      } catch {
        if (isMounted) {
          startTransition(() => {
            setUser(null);
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    hydrateSession();

    return () => {
      isMounted = false;
    };
  }, []);

  async function login(payload) {
    const response = await api.login(payload);
    startTransition(() => {
      setUser(response.user ?? null);
    });
    return response.user;
  }

  async function register(payload) {
    return api.register(payload);
  }

  async function logout() {
    try {
      await api.logout();
    } finally {
      startTransition(() => {
        setUser(null);
      });
    }
  }

  return <AuthContext.Provider value={{ user, loading, login, logout, register }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}