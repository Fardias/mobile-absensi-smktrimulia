import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../lib/api/auth";
import { router } from "expo-router";
import { storage } from "@/lib/storage";
import { User } from "../types/user";

import { AuthContextType } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = await storage.get("token");
      const storedUser = await storage.get("user");

      if (storedToken && storedUser) {
        try {
          const response = await authAPI.profile();
          if (response.data.responseStatus) {
            const freshUser: User = response.data.responseData;
            if (freshUser?.role === "siswa") {
              setUser(freshUser);
              setToken(storedToken);
              await storage.set("user", freshUser);
            } else {
              await storage.remove("token");
              await storage.remove("user");
            }
          } else {
            await storage.remove("token");
            await storage.remove("user");
          }
        } catch {
          await storage.remove("token");
          await storage.remove("user");
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: { username: string; password: string }) => {
    try {
      const response = await authAPI.login(credentials);
      console.log("login response:", response);
      
      const data = response.data;
      console.log("login data:", data);

      if (data.responseStatus) {
        const access_token = data?.responseData?.access_token;
        console.log("access_token:", access_token);
        
        const userData: User = data?.responseData?.user;
        console.log("userData:", userData);

        if (userData?.role !== "siswa") {
          return { success: false, message: "Aplikasi ini khusus untuk siswa" };
        }

        await storage.set("token", access_token);
        await storage.set("user", userData);

        setToken(access_token);
        setUser(userData);

        return { success: true, data: userData };
      } else {
        return { success: false, message: data.responseMessage };
      }
    } catch (error: any) {
      return {
        success: false,
        message:
          error.response?.data?.responseMessage ||
          "Terjadi kesalahan pada server",
      };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      await storage.remove("token");
      await storage.remove("user");
      setToken(null);
      setUser(null);
      router.replace("/login");
    }
  };


  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
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
