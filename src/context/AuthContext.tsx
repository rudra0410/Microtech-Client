import { createContext } from "react";
import type { User } from "firebase/auth";
import type { Admin } from "../data/mock";

interface AuthContextType {
  user: Admin | null;
  firebaseUser: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  hasPermission: (module: string, action: string) => boolean;
  isOwner: boolean;
  isAdmin: boolean;
  isSupport: boolean;
  isAuthenticated: boolean;
  tokenExpiresAt: number | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);
