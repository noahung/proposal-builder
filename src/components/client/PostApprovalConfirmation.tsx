import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface PostApprovalConfirmationProps {
  proposalTitle: string;
  companyName: string;
  clientName: string;
  onDownloadPDF: () => void;
  onClose: () => void;
}

export const PostApprovalConfirmation: React.FC<PostApprovalConfirmationProps> = ({
  proposalTitle,
  companyName,
  clientName,
  onDownloadPDF,
  onClose,
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <NeumorphCard className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <div className="neumorph-card inline-flex p-6 mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-2xl flex items-center justify-center">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="mb-4">Proposal Approved!</h1>
          <p className="text-lg text-muted-foreground mb-6">
            Thank you for approving "{proposalTitle}"
          </p>
        </div>
        
        <NeumorphCard variant="inset" className="mb-8">
          <h3 className="mb-4">What happens next?</h3>
          <div className="space-y-4 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs text-primary-foreground">1</span>
              </div>
              <div>
                <h4>Confirmation Email Sent</h4>
                <p className="text-sm text-muted-foreground">
                  You'll receive a confirmation email with the approved proposal details.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs text-primary-foreground">2</span>
              </div>
              <div>
                <h4>Project Kick-off</h4>
                <p className="text-sm text-muted-foreground">
                  {companyName} will contact you within 24 hours to schedule the project kick-off.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-xs text-primary-foreground">3</span>
              </div>
              <div>
                <h4>Contract & Invoicing</h4>
                <p className="text-sm text-muted-foreground">
                  Formal contracts and initial invoicing will be processed as outlined in the proposal.
                </p>
              </div>
            </div>
          </div>
        </NeumorphCard>
        
        <div className="flex gap-4 justify-center">
          <NeumorphButton onClick={onDownloadPDF}>
            📥 Download Approved Proposal
          </NeumorphButton>
          <NeumorphButton onClick={onClose} variant="primary">
            Close
          </NeumorphButton>
        </div>
        
        <p className="text-xs text-muted-foreground mt-6">
          Approved on {new Date().toLocaleDateString()} by {clientName}
        </p>
      </NeumorphCard>
    </div>
  );
};