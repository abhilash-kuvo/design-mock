export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  verificationStep: 'email' | 'otp' | 'complete';
  email: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}