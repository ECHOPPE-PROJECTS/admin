"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

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
        const res = await api.get("/api/users/me/");
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
    const attempts = [
      { email, password },
      { username: email, password },
    ];

    let lastError: unknown = null;

    for (const payload of attempts) {
      try {
        const { data } = await api.post("/api/auth/login/", payload);
        const accessToken = data.access ?? data.token;
        const refreshToken = data.refresh ?? data.refresh_token ?? null;

        if (!accessToken) {
          continue;
        }

        localStorage.setItem("access_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("refresh_token", refreshToken);
        }

        const me = await api.get("/api/users/me/");
        setUser(me.data);
        router.push("/");
        return;
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError ?? new Error("Échec de la connexion.");
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
