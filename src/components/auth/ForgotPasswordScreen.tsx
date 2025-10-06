import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { NeumorphInput } from '../ui/neumorph-input';
import { NeumorphButton } from '../ui/neumorph-button';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';

interface ForgotPasswordScreenProps {
  onResetPassword: (email: string) => void;
  onBackToSignIn: () => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ 
  onResetPassword, 
  onBackToSignIn 
}) => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error } = await resetPassword(email);
      if (error) {
        setError(error.message);
      } else {
        setIsSubmitted(true);
        onResetPassword(email);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent password reset instructions to your email"
      >
        <div className="text-center space-y-6">
          <div className="neumorph-card inline-flex p-4">
            <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-muted-foreground">
            If an account with that email exists, you'll receive reset instructions shortly.
          </p>
          <NeumorphButton onClick={onBackToSignIn} variant="primary" className="w-full">
            Back to Sign In
          </NeumorphButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <NeumorphInput
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <NeumorphButton 
          type="submit" 
          variant="primary" 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </NeumorphButton>
        
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToSignIn}
            className="text-sm text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            Back to Sign In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};