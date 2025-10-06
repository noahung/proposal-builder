import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface ProposalLandingProps {
  proposalTitle: string;
  companyName: string;
  clientName: string;
  onContinue: () => void;
  onThemeChange?: (theme: 'neumorphic' | 'material') => void;
  currentTheme?: 'neumorphic' | 'material';
}

export const ProposalLanding: React.FC<ProposalLandingProps> = ({
  proposalTitle,
  companyName,
  clientName,
  onContinue,
  onThemeChange,
  currentTheme = 'neumorphic',
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-8">
      <div className="max-w-2xl w-full">
        {/* Theme Toggle */}
        {onThemeChange && (
          <div className="flex justify-end mb-6">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => onThemeChange('neumorphic')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  currentTheme === 'neumorphic'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Neumorphic
              </button>
              <button
                onClick={() => onThemeChange('material')}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  currentTheme === 'material'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Classic
              </button>
            </div>
          </div>
        )}
        
        <NeumorphCard className="w-full text-center">
        <div className="mb-8">
          <div className="neumorph-card inline-flex p-6 mb-6">
            <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          
          <h1 className="mb-4">{proposalTitle}</h1>
          <p className="text-lg text-muted-foreground mb-2">
            Prepared for <strong>{clientName}</strong>
          </p>
          <p className="text-muted-foreground">
            by {companyName}
          </p>
        </div>
        
        <div className="mb-8">
          <div className="grid grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="mb-1">Created</p>
              <p>{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="mb-1">Valid Until</p>
              <p>{new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="mb-1">Pages</p>
              <p>8 pages</p>
            </div>
          </div>
        </div>
        
        <NeumorphButton 
          variant="primary" 
          size="lg" 
          onClick={onContinue}
          className="w-full"
        >
          View Proposal
        </NeumorphButton>
        
        <p className="text-xs text-muted-foreground mt-4">
          This proposal is confidential and intended solely for {clientName}
        </p>
      </NeumorphCard>
      </div>
    </div>
  );
};