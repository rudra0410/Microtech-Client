import React, {
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { rolePermissions, type Admin } from "../data/mock";
import { AuthContext } from "./AuthContext";
import { adminService } from "../services/adminService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Admin | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpiresAt, setTokenExpiresAt] = useState<number | null>(null);

  // Fetch user profile from backend API
  const fetchUserProfile = async (uid: string): Promise<Admin | null> => {
    try {
      // Try to get user profile from backend
      const userProfile = await adminService.getAdminById(uid);
      return userProfile;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Update token expiration time
  const updateTokenExpiration = useCallback(async (user: User) => {
    try {
      const tokenResult = await user.getIdTokenResult();
      const expirationTime = new Date(tokenResult.expirationTime).getTime();
      setTokenExpiresAt(expirationTime);
    } catch (error) {
      console.error("Error getting token expiration:", error);
      setTokenExpiresAt(null);
    }
  }, []);

  // Refresh token function
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      if (!firebaseUser) {
        throw new Error("No authenticated user");
      }
      
      console.log("Refreshing authentication token...");
      await firebaseUser.getIdToken(true); // Force refresh
      await updateTokenExpiration(firebaseUser);
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      setError(error instanceof Error ? error.message : "Token refresh failed");
      throw error;
    }
  }, [firebaseUser, updateTokenExpiration]);

  // Set up automatic token refresh
  useEffect(() => {
    if (!tokenExpiresAt || !firebaseUser) return;

    const now = Date.now();
    const timeUntilExpiry = tokenExpiresAt - now;
    
    // Refresh token 5 minutes before expiry
    const refreshTime = Math.max(timeUntilExpiry - (5 * 60 * 1000), 0);
    
    if (refreshTime > 0) {
      const timeoutId = setTimeout(() => {
        refreshToken().catch(console.error);
      }, refreshTime);

      return () => clearTimeout(timeoutId);
    }
  }, [tokenExpiresAt, firebaseUser, refreshToken]);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      setFirebaseUser(firebaseUser);

      if (firebaseUser) {
        try {
          // Update token expiration
          await updateTokenExpiration(firebaseUser);
          
          // User is signed in, fetch their profile
          const userProfile = await fetchUserProfile(firebaseUser.uid);
          setUser(userProfile);
          
          if (!userProfile) {
            console.warn("User profile not found in database");
            setError("User profile not found. Please contact administrator.");
          }
        } catch (error) {
          console.error("Error during auth state change:", error);
          setError("Authentication error occurred");
          setUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setTokenExpiresAt(null);
      }
      
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [updateTokenExpiration]);

  const login = useCallback(
    async (email: string, password: string): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        console.log("Attempting login for:", email);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Update token expiration
        await updateTokenExpiration(userCredential.user);
        
        const userProfile = await fetchUserProfile(userCredential.user.uid);
        
        if (!userProfile) {
          await signOut(auth); // Sign out if no profile found
          throw new Error("User profile not found. Access denied.");
        }
        
        if (!userProfile.is_active) {
          await signOut(auth); // Sign out if account is inactive
          throw new Error("Account is inactive. Please contact administrator.");
        }
        
        setUser(userProfile);
        console.log("Login successful for:", userProfile.email);
      } catch (error: unknown) {
        console.error("Login error:", error);
        const errorMessage = error instanceof Error ? error.message : "Login failed";
        setError(errorMessage);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [updateTokenExpiration]
  );

  const logout = useCallback(async (): Promise<void> => {
    try {
      console.log("Logging out user");
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setTokenExpiresAt(null);
      setError(null);
      console.log("Logout successful");
    } catch (error: unknown) {
      console.error("Logout error:", error);
      setError(error instanceof Error ? error.message : "Logout failed");
      throw error;
    }
  }, []);

  const hasPermission = useCallback(
    (module: string, action: string): boolean => {
      if (!user) return false;

      const userPermissions = rolePermissions[user.role]?.permissions;
      if (!userPermissions) return false;

      if (user.role === "owner") return true;

      const modulePermissions =
        userPermissions[module as keyof typeof userPermissions];
      return (
        modulePermissions?.[action as keyof typeof modulePermissions] || false
      );
    },
    [user]
  );

  const isOwner = user?.role === "owner";
  const isAdmin = user?.role === "admin" || isOwner;
  const isSupport = user?.role === "support";

  const value = {
    user,
    firebaseUser,
    isLoading,
    error,
    login,
    logout,
    refreshToken,
    hasPermission,
    isOwner,
    isAdmin,
    isSupport,
    isAuthenticated: !!user && !!firebaseUser,
    tokenExpiresAt,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};