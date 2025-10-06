import React from 'react';
import { cn } from './utils';

interface NeumorphButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const NeumorphButton = React.forwardRef<HTMLButtonElement, NeumorphButtonProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    return (
      <button
        className={cn(
          'neumorph-button inline-flex items-center justify-center rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
          {
            'px-4 py-2': size === 'sm',
            'px-6 py-3': size === 'md',
            'px-8 py-4': size === 'lg',
          },
          {
            'text-foreground': variant === 'default',
            'text-primary-foreground bg-primary shadow-primary/20': variant === 'primary',
            'text-destructive-foreground bg-destructive shadow-destructive/20': variant === 'destructive',
          },
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

NeumorphButton.displayName = 'NeumorphButton';