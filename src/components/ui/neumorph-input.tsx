import React from 'react';
import { cn } from './utils';

interface NeumorphInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const NeumorphInput = React.forwardRef<HTMLInputElement, NeumorphInputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'neumorph-input flex h-12 w-full px-4 py-2 text-sm file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

NeumorphInput.displayName = 'NeumorphInput';