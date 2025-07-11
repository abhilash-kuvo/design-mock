import React from 'react';
import { motion } from 'framer-motion';
import LoginCard from '../components/auth/LoginCard';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8F8F8] flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mb-8"
      >
        <h1 className="text-2xl font-bold text-center text-[#333333]">
          <span className="text-[#FF7F50]">Kuvo</span>.ai
        </h1>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <LoginCard />
      </motion.div>
    </div>
  );
};

export default LoginPage;