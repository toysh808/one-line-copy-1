
import React from 'react';

interface OneLogoProps {
  className?: string;
}

export const OneLogo: React.FC<OneLogoProps> = ({ className = "h-8" }) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        viewBox="0 0 80 80" 
        className="h-full w-auto"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chat bubble shape */}
        <path 
          d="M20 15 C15 15, 10 20, 10 25 L10 45 C10 50, 15 55, 20 55 L25 55 L25 65 L35 55 L60 55 C65 55, 70 50, 70 45 L70 25 C70 20, 65 15, 60 15 Z" 
          fill="#1E90FF"
          stroke="none"
        />
        {/* Horizontal line inside */}
        <rect 
          x="20" 
          y="27" 
          width="30" 
          height="6" 
          rx="3"
          fill="white"
        />
      </svg>
      <span className="text-2xl font-bold text-primary">OneLine</span>
    </div>
  );
};
