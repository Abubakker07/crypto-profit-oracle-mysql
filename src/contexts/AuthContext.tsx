
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from "@/components/ui/use-toast";
import { useDatabase } from './DatabaseContext';
import { User, AuthState } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false
  });
  const [loading, setLoading] = useState(false);
  const { getUserByCredentials, registerUser } = useDatabase();

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await getUserByCredentials(email, password);
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true
        });
        
        // Store in session storage
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('isAuthenticated', 'true');
        
        toast({
          title: "Login successful",
          description: `Welcome back, ${user.username}!`,
        });
        
        return true;
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password. Please try again.",
        });
        
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An error occurred during login. Please try again.",
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const user = await registerUser(username, email, password);
      
      if (user) {
        setAuthState({
          user,
          isAuthenticated: true
        });
        
        // Store in session storage
        sessionStorage.setItem('user', JSON.stringify(user));
        sessionStorage.setItem('isAuthenticated', 'true');
        
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthState({
      user: null,
      isAuthenticated: false
    });
    
    // Clear from session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAuthenticated');
    
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user: authState.user, 
      isAuthenticated: authState.isAuthenticated,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
