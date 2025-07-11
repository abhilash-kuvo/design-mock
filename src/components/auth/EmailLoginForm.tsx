import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import Button from '../ui/Button';

interface EmailLoginFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

const EmailLoginForm: React.FC<EmailLoginFormProps> = ({ onSubmit, isLoading }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setError('');
    onSubmit(email);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <div className="mb-4">
        <Input
          type="email"
          label="Business Email"
          required
          placeholder="Example@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={error}
        />
      </div>
      <Button 
        type="submit" 
        fullWidth 
        isLoading={isLoading}
      >
        Send OTP
      </Button>
    </motion.form>
  );
};

export default EmailLoginForm;