import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, required, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[#333333] mb-1">
            {required && <span className="text-[#FF7F50] mr-1">*</span>}
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-4 py-3 rounded-md border ${
            error ? 'border-[#EF5350]' : 'border-[#A0A0A0]'
          } focus:outline-none focus:ring-2 focus:ring-[#FF7F50] focus:border-transparent ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-[#EF5350]">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;