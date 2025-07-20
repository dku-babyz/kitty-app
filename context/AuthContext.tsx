import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getToken, removeToken } from '../utils/auth';
import { fetchCurrentUser } from '../services/api'; // Import fetchCurrentUser

interface User {
  id: number;
  username: string;
  experience_points: number;
  level: number;
  character_state: string; // 'smiling' or 'crying'
  harmful_chat_count: number;
  phone_number: string;
  email?: string;
  is_active: boolean;
  messages: any[];
}

interface AuthContextType {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedToken = await getToken();
        if (storedToken) {
          try {
            const userData = await fetchCurrentUser();
            setUser(userData);
          } catch (fetchError) {
            console.error("Failed to fetch user data with stored token:", fetchError);
            await removeToken(); // Clear invalid token
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from storage:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const loginHandler = (token: string, userData: User) => {
    setUser(userData);
    setIsLoading(false);
  };

  const logoutHandler = async () => {
    await removeToken();
    setUser(null);
  };

  const updateUserDetails = (userData: Partial<User>) => {
    setUser(prevUser => {
      if (!prevUser) return null;
      return { ...prevUser, ...userData };
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: loginHandler,
        logout: logoutHandler,
        updateUser: updateUserDetails,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
