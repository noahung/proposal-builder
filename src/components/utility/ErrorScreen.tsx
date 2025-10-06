import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface ErrorScreenProps {
  type?: '404' | '500' | 'network' | 'permission';
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({
  type = '404',
  message,
  onRetry,
  onGoHome,
}) => {
  const getErrorContent = () => {
    switch (type) {
      case '404':
        return {
          icon: '🔍',
          title: 'Page Not Found',
          message: message || 'Sorry, the page you are looking for doesn\'t exist or has been moved.',
          showRetry: false,
        };
      case '500':
        return {
          icon: '⚠️',
          title: 'Server Error',
          message: message || 'Something went wrong on our end. Please try again later.',
          showRetry: true,
        };
      case 'network':
        return {
          icon: '📡',
          title: 'Connection Error',
          message: message || 'Unable to connect to the server. Please check your internet connection.',
          showRetry: true,
        };
      case 'permission':
        return {
          icon: '🔒',
          title: 'Access Denied',
          message: message || 'You don\'t have permission to access this resource.',
          showRetry: false,
        };
      default:
        return {
          icon: '❌',
          title: 'Something Went Wrong',
          message: message || 'An unexpected error occurred.',
          showRetry: true,
        };
    }
  };

  const errorContent = getErrorContent();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <NeumorphCard className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="neumorph-card inline-flex p-6 mb-6">
            <span className="text-4xl">{errorContent.icon}</span>
          </div>
          
          <h1 className="mb-4">{errorContent.title}</h1>
          <p className="text-muted-foreground">
            {errorContent.message}
          </p>
        </div>
        
        <div className="space-y-4">
          {errorContent.showRetry && onRetry && (
            <NeumorphButton 
              variant="primary" 
              onClick={onRetry}
              className="w-full"
            >
              Try Again
            </NeumorphButton>
          )}
          
          {onGoHome && (
            <NeumorphButton 
              onClick={onGoHome}
              className="w-full"
            >
              Go to Dashboard
            </NeumorphButton>
          )}
          
          {type === '404' && (
            <NeumorphButton 
              onClick={() => window.history.back()}
              className="w-full"
            >
              Go Back
            </NeumorphButton>
          )}
        </div>
        
        {type === 'network' && (
          <div className="mt-6 p-4 neumorph-inset rounded-lg">
            <h4 className="mb-2">Troubleshooting Tips:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 text-left">
              <li>• Check your internet connection</li>
              <li>• Refresh the page</li>
              <li>• Try again in a few minutes</li>
            </ul>
          </div>
        )}
      </NeumorphCard>
    </div>
  );
};