import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (signature?: string) => void;
  proposalTitle: string;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  proposalTitle,
}) => {
  const [signature, setSignature] = useState('');
  const [useDigitalSignature, setUseDigitalSignature] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(useDigitalSignature ? signature : undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <NeumorphCard className="max-w-md w-full">
        <div className="text-center mb-6">
          <div className="neumorph-card inline-flex p-4 mb-4">
            <span className="text-2xl">✅</span>
          </div>
          <h2 className="mb-2">Approve Proposal</h2>
          <p className="text-muted-foreground">
            You are about to approve "{proposalTitle}"
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="useSignature"
              checked={useDigitalSignature}
              onChange={(e) => setUseDigitalSignature(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="useSignature">Include digital signature</Label>
          </div>
          
          {useDigitalSignature && (
            <div className="space-y-2">
              <Label htmlFor="signature">Your Full Name</Label>
              <NeumorphInput
                id="signature"
                placeholder="Enter your full name as signature"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <NeumorphButton onClick={onClose} className="flex-1">
            Cancel
          </NeumorphButton>
          <NeumorphButton 
            onClick={handleConfirm} 
            variant="primary" 
            className="flex-1"
            disabled={useDigitalSignature && !signature.trim()}
          >
            Confirm Approval
          </NeumorphButton>
        </div>
      </NeumorphCard>
    </div>
  );
};