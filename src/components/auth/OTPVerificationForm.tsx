import React, { useState } from 'react';
import { motion } from 'framer-motion';
import OtpInput from '../ui/OtpInput';
import Button from '../ui/Button';

interface OTPVerificationFormProps {
  onSubmit: (otp: string) => void;
  onBack: () => void;
  email: string;
  isLoading: boolean;
  error: string | null;
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ 
  onSubmit,
  onBack,
  email,
  isLoading,
  error
}) => {
  const [otp, setOtp] = useState('');
  const isOtpComplete = otp.length === 6;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isOtpComplete) {
      onSubmit(otp);
    }
  };

  const handleOtpComplete = (value: string) => {
    setOtp(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="text-center mb-6">
        <h2 className="text-lg font-medium text-gray-800 mb-2">Enter verification code</h2>
        <p className="text-sm text-gray-600">
          We've sent a 6-digit code to <strong>{email}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <OtpInput 
          length={6} 
          onComplete={handleOtpComplete} 
          error={error || undefined}
        />
        
        <div className="flex flex-col space-y-3">
          <Button 
            type="submit" 
            fullWidth 
            isLoading={isLoading}
            disabled={!isOtpComplete}
            className={!isOtpComplete ? 'opacity-50 cursor-not-allowed' : ''}
          >
            Verify OTP
          </Button>
          
          <Button 
            type="button" 
            variant="outline" 
            fullWidth 
            onClick={onBack}
            disabled={isLoading}
          >
            Back to Login
          </Button>
        </div>
        
        <div className="text-center">
          <button 
            type="button" 
            className="text-sm text-[#E97634] hover:underline focus:outline-none"
            disabled={isLoading}
          >
            Didn't receive the code? Resend
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default OTPVerificationForm;