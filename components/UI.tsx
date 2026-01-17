
import React from 'react';
import { THEME } from '../constants';

// BOUTON
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "flex items-center justify-center gap-2 transition-all duration-200 ease-in-out active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group";
  
  const variants = {
    primary: `bg-[#2463eb] text-white h-[3.5rem] px-5 text-[1.125rem] font-bold rounded-[0.75rem] shadow-[0_10px_15px_-3px_rgba(59,130,246,0.2)] hover:bg-[#1d4ed8] hover:-translate-y-[1px] hover:shadow-[0_15px_20px_-3px_rgba(59,130,246,0.3)]`,
    secondary: `bg-transparent text-[#64748b] h-[2.5rem] px-4 text-[0.875rem] font-medium border border-[#e2e8f0] rounded-[0.5rem] hover:text-[#2463eb] hover:border-[#2463eb] hover:bg-[rgba(36,99,235,0.05)]`,
    danger: `bg-red-50 text-[#ef4444] h-[3.5rem] px-5 rounded-[0.75rem] border border-red-100 font-bold`
  };
  
  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// CARD
interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  hasGradientBar?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  padding = 'p-8 md:p-12', 
  hasGradientBar = false 
}) => (
  <div className={`relative bg-white rounded-[1rem] border border-[#e2e8f0] shadow-[0_20px_25px_-5px_rgba(148,163,184,0.5)] overflow-hidden ${padding} ${className}`}>
    {hasGradientBar && (
      <div className="absolute top-0 left-0 right-0 h-[0.375rem] bg-[linear-gradient(to_right,#60a5fa,#2463eb,#2563eb)]" />
    )}
    {children}
  </div>
);

// INPUT
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: string; // Material Symbol name
}

export const Input: React.FC<InputProps> = ({ label, icon, className = '', ...props }) => (
  <div className={`flex flex-col gap-2 w-full ${className}`}>
    <label className="text-[0.875rem] font-semibold text-[#0f172a] uppercase tracking-wider">{label}</label>
    <div className="relative group">
      {icon && (
        <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-[#94a3b8] group-focus-within:text-[#2463eb] transition-colors pointer-events-none">
          {icon}
        </span>
      )}
      <input 
        className={`w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-[0.75rem] h-[3.5rem] ${icon ? 'pl-14' : 'px-5'} pr-5 text-[1.125rem] text-[#0f172a] placeholder:text-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#2463eb] focus:border-transparent transition-all`}
        {...props} 
      />
    </div>
  </div>
);
