import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState, User } from '../types/auth';

interface AuthContextType {
  auth: AuthState;
  setAuth: React.Dispatch<React.SetStateAction<AuthState>>;
  login: (user: User) => void;
  logout: () => void;
  startEmailLogin: (email: string) => void;
  verifyOtp: (otp: string) => Promise<boolean>;
}

const initialState: AuthState = {
  isLoggedIn: false,
  user: null,
  loading: false,
  error: null,
  verificationStep: 'email',
  email: '',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [auth, setAuth] = useState<AuthState>(initialState);

  const login = (user: User) => {
    setAuth({
      ...auth,
      isLoggedIn: true,
      user,
      loading: false,
      error: null,
      verificationStep: 'complete',
    });
  };

  const logout = () => {
    setAuth(initialState);
  };

  const startEmailLogin = (email: string) => {
    setAuth({
      ...auth,
      email,
      verificationStep: 'otp',
      loading: false,
      error: null,
    });
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    try {
      setAuth({ ...auth, loading: true, error: null });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (otp === '000000') {
        setAuth({
          ...auth,
          loading: false,
          error: 'Invalid OTP. Please try again.',
        });
        return false;
      }
      
      // For demo purposes, accept any other 6-digit OTP
      const isValid = /^\d{6}$/.test(otp);
      
      if (isValid) {
        login({
          id: '1',
          email: auth.email,
        });
        return true;
      } else {
        setAuth({
          ...auth,
          loading: false,
          error: 'Please enter a valid 6-digit OTP.',
        });
        return false;
      }
    } catch (error) {
      setAuth({
        ...auth,
        loading: false,
        error: 'An error occurred. Please try again.',
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        login,
        logout,
        startEmailLogin,
        verifyOtp,
      }}
    >
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