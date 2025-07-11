import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OtpInputProps {
  length?: number;
  onComplete: (otp: string) => void;
  error?: string;
}

const OtpInput: React.FC<OtpInputProps> = ({ 
  length = 6, 
  onComplete,
  error
}) => {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (value.length > 1) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOtp.every(digit => digit) && newOtp.join('').length === length) {
      onComplete(newOtp.join(''));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    if (pastedData.length <= length && /^\d+$/.test(pastedData)) {
      const newOtp = [...otp];
      
      for (let i = 0; i < pastedData.length; i++) {
        newOtp[i] = pastedData[i];
      }
      
      setOtp(newOtp);
      
      const focusIndex = Math.min(pastedData.length, length - 1);
      inputRefs.current[focusIndex]?.focus();
      
      if (pastedData.length === length) {
        onComplete(pastedData);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex justify-center gap-2">
        {Array.from({ length }, (_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: index * 0.06 }}
            className="w-12"
          >
            <input
              ref={el => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={otp[index]}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`w-full aspect-square flex items-center justify-center text-center text-xl font-medium rounded-md border ${
                error ? 'border-[#EF5350]' : 'border-[#A0A0A0]'
              } focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent`}
            />
          </motion.div>
        ))}
      </div>
      {error && <p className="mt-3 text-sm text-center text-[#EF5350]">{error}</p>}
    </div>
  );
};

export default OtpInput;