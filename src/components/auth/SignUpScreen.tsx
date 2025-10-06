import React, { useState } from 'react';
import { AuthLayout } from '../layout/AuthLayout';
import { NeumorphInput } from '../ui/neumorph-input';
import { NeumorphButton } from '../ui/neumorph-button';
import { Label } from '../ui/label';
import { useAuth } from '../../contexts/AuthContext';

interface SignUpScreenProps {
  onBackToLanding: () => void;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({ onBackToLanding }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      console.log('Attempting signup with data:', {
        email: formData.email,
        name: formData.name,
        company: formData.company
      });

      const { error } = await signUp(
        formData.email,
        formData.password,
        formData.name,
        formData.company
      );

      if (error) {
        console.error('Signup error returned:', error);
        setError(`Error: ${error.message || 'Unknown error'}`);
      } else {
        setSuccess(true);
        // Success - AuthContext will handle the state change and App will redirect
      }
    } catch (err: any) {
      console.error('Signup exception caught:', err);
      setError(`Exception: ${err.message || 'Failed to create account'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (success) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent you a confirmation link"
      >
        <div className="text-center space-y-4">
          <div className="p-6 bg-primary/10 border border-primary/20 rounded-lg">
            <p className="text-foreground">
              Please check your email ({formData.email}) and click the confirmation link to activate your account.
            </p>
          </div>
          <NeumorphButton onClick={onBackToLanding} className="w-full">
            Back to Landing
          </NeumorphButton>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Start creating beautiful proposals today"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <NeumorphInput
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="company">Company Name</Label>
          <NeumorphInput
            id="company"
            placeholder="Enter your company name"
            value={formData.company}
            onChange={(e) => handleChange('company', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <NeumorphInput
            id="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <NeumorphInput
            id="password"
            type="password"
            placeholder="Create a password (min 6 characters)"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            disabled={loading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <NeumorphInput
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
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
          {loading ? 'Creating Account...' : 'Create Account'}
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