import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.div : 'div';
  
  return (
    <Component
      className={cn(
        "bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden",
        hover && "hover:shadow-lg hover:border-gray-200 cursor-pointer",
        className
      )}
      onClick={onClick}
      {...(onClick && {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 }
      })}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-b border-gray-100", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-6 py-4 border-t border-gray-100 bg-gray-50", className)}>
      {children}
    </div>
  );
}