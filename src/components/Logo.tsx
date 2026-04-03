import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={cn("w-full h-full", className)}
    >
      {/* Heart Outline */}
      <path 
        d="M50 92C20 75 5 55 5 35C5 18 22 10 50 30C78 10 95 18 95 35C95 55 80 75 50 92Z" 
        stroke="currentColor" 
        strokeWidth="5" 
        strokeLinecap="round"
      />
      
      {/* Person Head */}
      <circle cx="50" cy="30" r="10" fill="currentColor" />
      
      {/* Person Torso (Significantly larger/more rounded as requested) */}
      <path 
        d="M22 65C22 42 32 35 50 35C68 35 78 42 78 65C78 88 50 92 50 92C50 92 22 88 22 65Z" 
        fill="currentColor" 
      />
      
      {/* Checkmark (The "good symbol") */}
      <path 
        d="M32 65L48 82L82 42" 
        stroke="white" 
        strokeWidth="12" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M32 65L48 82L82 42" 
        stroke="#4ade80" 
        strokeWidth="6" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}
