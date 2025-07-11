import React from 'react';
import Button from '../ui/Button';

interface SocialLoginButtonProps {
  provider: 'google';
  onClick: () => void;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({ provider, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 rounded-md bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
    >
      <img 
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
        alt="Google" 
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  );
};

export default SocialLoginButton;