import React from 'react';
import { Button } from '../ui/button';

interface MaterialProposalLandingProps {
  proposalTitle: string;
  companyName: string;
  clientName: string;
  onContinue: () => void;
  onThemeChange: (theme: 'neumorphic' | 'material') => void;
  currentTheme: 'neumorphic' | 'material';
}

export const MaterialProposalLanding: React.FC<MaterialProposalLandingProps> = ({
  proposalTitle,
  companyName,
  clientName,
  onContinue,
  onThemeChange,
  currentTheme,
}) => {
  return (
    <div className="min-h-screen material-surface flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-8">
          <div className="flex items-center gap-3">
            <span className="text-sm text-material-on-surface-variant">View:</span>
            <div className="flex bg-material-surface-variant rounded-full p-1">
              <button
                onClick={() => onThemeChange('neumorphic')}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  currentTheme === 'neumorphic'
                    ? 'bg-material-primary text-material-on-primary'
                    : 'text-material-on-surface-variant hover:text-material-on-surface'
                }`}
              >
                Neumorphic
              </button>
              <button
                onClick={() => onThemeChange('material')}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  currentTheme === 'material'
                    ? 'bg-material-primary text-material-on-primary'
                    : 'text-material-on-surface-variant hover:text-material-on-surface'
                }`}
              >
                Classic
              </button>
            </div>
          </div>
        </div>

        <div className="material-card-elevated p-8 text-center">
          {/* Company Logo */}
          <div className="w-20 h-20 bg-material-primary rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl font-medium text-material-on-primary">
              {companyName.charAt(0)}
            </span>
          </div>

          {/* Welcome Message */}
          <h1 className="text-3xl font-medium text-material-on-surface mb-2">
            Welcome, {clientName}
          </h1>
          
          <p className="text-lg text-material-on-surface-variant mb-8">
            We've prepared a comprehensive proposal for your review
          </p>

          {/* Proposal Title */}
          <div className="material-card p-6 mb-8">
            <h2 className="text-xl font-medium text-material-on-surface mb-2">
              {proposalTitle}
            </h2>
            <p className="text-material-on-surface-variant">
              Presented by {companyName}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="material-surface-variant p-4 rounded-lg">
              <div className="text-2xl font-medium text-material-primary mb-1">8</div>
              <div className="text-sm text-material-on-surface-variant">Pages</div>
            </div>
            <div className="material-surface-variant p-4 rounded-lg">
              <div className="text-2xl font-medium text-material-primary mb-1">8</div>
              <div className="text-sm text-material-on-surface-variant">Weeks</div>
            </div>
            <div className="material-surface-variant p-4 rounded-lg">
              <div className="text-2xl font-medium text-material-primary mb-1">£25k</div>
              <div className="text-sm text-material-on-surface-variant">Investment</div>
            </div>
          </div>

          {/* Call to Action */}
          <Button 
            onClick={onContinue} 
            className="material-button-filled w-full"
            size="lg"
          >
            View Proposal
          </Button>

          {/* Footer Note */}
          <p className="text-sm text-material-on-surface-variant mt-6">
            This proposal is confidential and intended solely for {clientName}
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-8 text-center">
          <p className="text-sm text-material-on-surface-variant mb-2">
            Questions? Contact your account manager:
          </p>
          <div className="flex items-center justify-center gap-4 text-sm">
            <a href="mailto:sarah@proposalcraft.com" className="text-material-primary hover:underline">
              sarah@proposalcraft.com
            </a>
            <span className="text-material-outline">•</span>
            <a href="tel:+442071234567" className="text-material-primary hover:underline">
              +44 20 7123 4567
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};