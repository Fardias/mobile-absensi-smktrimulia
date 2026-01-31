import { User } from "./user";

export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: {
    username: string;
    password: string;
  }) => Promise<{ success: boolean; data?: User; message?: string }>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}