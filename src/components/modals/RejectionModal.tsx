import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface RejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (feedback: string) => void;
  proposalTitle: string;
}

export const RejectionModal: React.FC<RejectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  proposalTitle,
}) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(feedback);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <NeumorphCard className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="neumorph-card inline-flex p-4 mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="mb-2">Decline Proposal</h2>
          <p className="text-muted-foreground">
            You are about to decline "{proposalTitle}"
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="feedback">Feedback (Optional)</Label>
            <textarea
              id="feedback"
              placeholder="Please share any feedback or reasons for declining..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="neumorph-input w-full h-24 px-4 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        </div>
        
        <div className="flex gap-3">
          <NeumorphButton onClick={onClose} className="flex-1">
            Cancel
          </NeumorphButton>
          <NeumorphButton 
            onClick={handleConfirm} 
            variant="destructive" 
            className="flex-1"
          >
            Decline Proposal
          </NeumorphButton>
        </div>
      </NeumorphCard>
    </div>
  );
};