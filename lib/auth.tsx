"use client";

import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: { id: number; name: string } | null;
  department: { id: number; name: string } | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://backend-t8k0.onrender.com";

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined" && config.headers) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosClient.get("/api/users/me/");
        setUser(res.data);
      } catch {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await axiosClient.post("/api/auth/login/", { email, password });
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);

    const me = await axiosClient.get("/api/users/me/");
    setUser(me.data);
    router.push("/");
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
