import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  showProgress?: boolean;
  progress?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading...',
  fullScreen = true,
  showProgress = false,
  progress = 0,
}) => {
  const content = (
    <NeumorphCard className="text-center">
      <div className="mb-6">
        <div className="neumorph-card inline-flex p-6 mb-4">
          <div className="w-12 h-12 relative">
            {/* Animated loading spinner */}
            <div className="absolute inset-0 rounded-full border-4 border-muted"></div>
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          </div>
        </div>
        
        <h2 className="mb-2">{message}</h2>
        
        {showProgress && (
          <div className="space-y-2">
            <div className="w-full neumorph-inset rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</p>
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-center space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary rounded-full animate-pulse"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s',
              }}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Please wait while we prepare your content
        </p>
      </div>
    </NeumorphCard>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background flex items-center justify-center p-6 z-50">
        <div className="max-w-md w-full">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="max-w-sm w-full">
        {content}
      </div>
    </div>
  );
};

// Mini loading component for inline use
export const MiniLoader: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      <div className="absolute inset-0 rounded-full border-2 border-muted"></div>
      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
    </div>
  );
};