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
  isLoggedIn: true,
  user: {
    id: 'dummy-user-1',
    email: 'user@example.com',
    name: 'John Doe',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2'
  },
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
    // Dummy logout - just reset to initial logged-in state
    console.log('Logout clicked (dummy implementation)');
    setAuth(initialState);
  };

  const startEmailLogin = (email: string) => {
    // Dummy implementation - do nothing
    console.log('Start email login called (dummy implementation):', email);
  };

  const verifyOtp = async (otp: string): Promise<boolean> => {
    // Dummy implementation - always return true
    console.log('Verify OTP called (dummy implementation):', otp);
    return true;
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