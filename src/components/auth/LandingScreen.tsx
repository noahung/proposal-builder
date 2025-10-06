import React from 'react';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphCard } from '../ui/neumorph-card';

interface LandingScreenProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onSignIn, onSignUp }) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <NeumorphCard className="text-center">
          <div className="mb-8">
            <div className="neumorph-card inline-flex p-6 mb-6">
              <div className="w-16 h-16 bg-primary rounded-xl flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <h1 className="mb-4">ProposalCraft</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The modern proposal management platform that helps agencies create, send, and track proposals with ease. 
              Build beautiful proposals that win more business.
            </p>
          </div>
          
          <div className="flex gap-4 justify-center">
            <NeumorphButton onClick={onSignIn} size="lg">
              Sign In
            </NeumorphButton>
            <NeumorphButton onClick={onSignUp} variant="primary" size="lg">
              Sign Up
            </NeumorphButton>
          </div>
        </NeumorphCard>
      </div>
    </div>
  );
};