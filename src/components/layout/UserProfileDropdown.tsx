import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Settings, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface UserProfileDropdownProps {
  onNavigateToConnectedAccounts: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ 
  onNavigateToConnectedAccounts 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsClick = () => {
    onNavigateToConnectedAccounts();
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 transition-all duration-200 group"
      >
        <img
          src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=32&h=32&dpr=2"
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
        />
        <ChevronDown 
          size={14} 
          className={`text-gray-400 group-hover:text-gray-600 transition-all duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
          {/* User Info Section */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=40&h=40&dpr=2"
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@company.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Shield size={16} className="text-gray-500" />
              <span>Connected Accounts</span>
            </button>
            
            <button
              onClick={handleSettingsClick}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings size={16} className="text-gray-500" />
              <span>Settings</span>
            </button>
          </div>

          {/* Logout Section */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} className="text-red-500" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;