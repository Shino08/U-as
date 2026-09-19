import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import api from "@/api/client";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("lumiere_token");
    const savedUser = localStorage.getItem("lumiere_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>("/auth/login", { email, password });
    const token = res?.token;
    const user = res?.user;
    if (!token || !user) {
      throw new Error("No se recibió respuesta válida del servidor");
    }
    localStorage.setItem("lumiere_token", token);
    localStorage.setItem("lumiere_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post<{ token: string; user: User }>("/auth/register", { name, email, password });
    const token = res?.token;
    const user = res?.user;
    if (!token || !user) {
      throw new Error("No se recibió respuesta válida del servidor");
    }
    localStorage.setItem("lumiere_token", token);
    localStorage.setItem("lumiere_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("lumiere_token");
    localStorage.removeItem("lumiere_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
