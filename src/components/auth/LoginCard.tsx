import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Card from '../ui/Card';
import EmailLoginForm from './EmailLoginForm';
import OTPVerificationForm from './OTPVerificationForm';
import SocialLoginButton from './SocialLoginButton';
import { useAuth } from '../../contexts/AuthContext';

const LoginCard: React.FC = () => {
  const { auth, startEmailLogin, verifyOtp, setAuth, login } = useAuth();

  const handleEmailSubmit = (email: string) => {
    startEmailLogin(email);
  };

  const handleOtpSubmit = async (otp: string) => {
    await verifyOtp(otp);
  };

  const handleBack = () => {
    setAuth({
      ...auth,
      verificationStep: 'email',
      error: null,
    });
  };

  const handleGoogleLogin = () => {
    // In a real app, this would integrate with Google OAuth
    login({
      id: 'google-123',
      email: 'user@example.com',
      name: 'Google User',
      avatar: 'https://example.com/avatar.jpg',
    });
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-center text-gray-800 mb-8">
        Login to your account
      </h1>

      <AnimatePresence mode="wait">
        {auth.verificationStep === 'email' ? (
          <motion.div
            key="email-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <SocialLoginButton provider="google" onClick={handleGoogleLogin} />

            <div className="my-6 flex items-center">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="px-4 text-sm text-gray-500">OR</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <EmailLoginForm 
              onSubmit={handleEmailSubmit} 
              isLoading={auth.loading} 
            />
          </motion.div>
        ) : (
          <motion.div
            key="otp-step"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <OTPVerificationForm
              onSubmit={handleOtpSubmit}
              onBack={handleBack}
              email={auth.email}
              isLoading={auth.loading}
              error={auth.error}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default LoginCard;