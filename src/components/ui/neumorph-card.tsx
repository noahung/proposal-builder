import React from 'react';
import { cn } from './utils';

interface NeumorphCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'inset';
}

export const NeumorphCard = React.forwardRef<HTMLDivElement, NeumorphCardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        className={cn(
          'p-6',
          variant === 'default' ? 'neumorph-card' : 'neumorph-inset',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

NeumorphCard.displayName = 'NeumorphCard';