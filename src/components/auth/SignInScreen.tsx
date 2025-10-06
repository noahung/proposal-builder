import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { NeumorphInput } from '../ui/neumorph-input';
import { NeumorphButton } from '../ui/neumorph-button';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';

interface SignInScreenProps {
  onForgotPassword: () => void;
  onBackToLanding: () => void;
}

export const SignInScreen: React.FC<SignInScreenProps> = ({ 
  onForgotPassword, 
  onBackToLanding 
}) => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError.message);
      }
      // If successful, AuthContext will handle the state change and App will redirect
    } catch (err: any) {
      setError(err.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your ProposalCraft account"
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
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <NeumorphInput
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-primary hover:underline"
            disabled={loading}
          >
            Forgotten password?
          </button>
        </div>
        
        <NeumorphButton 
          type="submit" 
          variant="primary" 
          className="w-full" 
          size="lg"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </NeumorphButton>
        
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLanding}
            className="text-sm text-muted-foreground hover:text-foreground"
            disabled={loading}
          >
            Back to landing page
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};