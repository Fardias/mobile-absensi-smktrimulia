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
    // Inisialisasi auth dari storage dan verifikasi ke server
    const initAuth = async () => {
      const storedToken = await storage.get("token");
      const storedUser = await storage.get("user");

      if (storedToken && storedUser) {
        try {
          const response = await authAPI.me();
          if (response.data.responseStatus) {
            // Aplikasi mobile difokuskan untuk role 'siswa'
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
      // Kirim JSON langsung; backend mengembalikan user + access_token
      const response = await authAPI.login(credentials);
      
      const data = response.data;

      if (data.responseStatus) {
        const { access_token } = data.responseHeader;
        const userData: User = data.responseData;
        // Hanya izinkan login jika role siswa
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

  const refreshToken = async () => {
    try {
      // Refresh token akses jika tersedia
      const response = await authAPI.refresh();
      const data = response.data;

      if (data.responseStatus) {
        const { access_token } = data.responseHeader;
        await storage.set("token", access_token);
        setToken(access_token);
        return true;
      }
      return false;
    } catch (error) {
      // Bila gagal refresh, lakukan logout agar sesi bersih
      logout();
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    logout,
    refreshToken,
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
