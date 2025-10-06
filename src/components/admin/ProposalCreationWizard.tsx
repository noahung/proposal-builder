import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';
import { useClients, useCreateClient } from '../../hooks/useClients';
import { useCreateProposal } from '../../hooks/useProposals';
import { useCreateSection } from '../../hooks/useSections';
import { LoadingScreen } from '../utility/LoadingScreen';

interface ProposalCreationWizardProps {
  onComplete: (proposalId: string) => void;
  onCancel: () => void;
}

interface WizardData {
  template: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientCompany: string;
  proposalTitle: string;
  createNewClient: boolean;
}

export const ProposalCreationWizard: React.FC<ProposalCreationWizardProps> = ({
  onComplete,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [wizardData, setWizardData] = useState<WizardData>({
    template: '',
    clientId: '',
    clientName: '',
    clientEmail: '',
    clientCompany: '',
    proposalTitle: '',
    createNewClient: false,
  });

  // Fetch existing clients
  const { data: clients, isLoading: clientsLoading } = useClients();
  
  // Mutations
  const createClient = useCreateClient();
  const createProposal = useCreateProposal();
  const createSection = useCreateSection();

  const templates = [
    { id: 'website', name: 'Website Design Proposal', description: 'Perfect for web design and development projects' },
    { id: 'branding', name: 'Brand Identity Proposal', description: 'Comprehensive branding and identity packages' },
    { id: 'marketing', name: 'Marketing Campaign Proposal', description: 'Digital marketing and campaign strategies' },
    { id: 'consulting', name: 'Consulting Services Proposal', description: 'Professional consulting and advisory services' },
    { id: 'custom', name: 'Custom Proposal', description: 'Start from scratch with a blank template' },
  ];

  const handleNext = async () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Step 3: Create the proposal
      setIsCreating(true);
      try {
        let clientId = wizardData.clientId;

        // If creating a new client, create it first
        if (wizardData.createNewClient) {
          const result = await createClient.mutateAsync({
            name: wizardData.clientName,
            email: wizardData.clientEmail,
            company: wizardData.clientCompany || undefined,
          });

          if (result.data) {
            clientId = result.data.id;
          } else {
            throw new Error('Failed to create client');
          }
        }

        // Create the proposal
        const proposalResult = await createProposal.mutateAsync({
          clientId,
          title: wizardData.proposalTitle,
          status: 'draft',
        });

        if (proposalResult.data) {
          console.log('Proposal created successfully:', proposalResult.data);
          
          // Create initial section
          await createSection.mutateAsync({
            proposal_id: proposalResult.data.id,
            title: 'Cover Page',
            order_index: 0,
            elements: [],
          });
          
          onComplete(proposalResult.data.id);
        } else {
          throw new Error(proposalResult.error || 'Failed to create proposal');
        }
      } catch (error) {
        console.error('Error creating proposal:', error);
        alert(`Failed to create proposal: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onCancel();
    }
  };

  const updateWizardData = (field: keyof WizardData, value: string) => {
    setWizardData(prev => ({ ...prev, [field]: value }));
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return wizardData.template !== '';
      case 2:
        if (wizardData.createNewClient) {
          return wizardData.clientName && wizardData.clientEmail;
        } else {
          return wizardData.clientId !== '';
        }
      case 3:
        return wizardData.proposalTitle !== '';
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2>Choose a Template</h2>
              <p className="text-muted-foreground">Select a starting template for your proposal</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <NeumorphCard
                  key={template.id}
                  className={`cursor-pointer transition-all ${
                    wizardData.template === template.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => updateWizardData('template', template.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      wizardData.template === template.id 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <h4 className="mb-2">{template.name}</h4>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                </NeumorphCard>
              ))}
            </div>
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2>Select Client</h2>
              <p className="text-muted-foreground">Choose an existing client or create a new one</p>
            </div>
            
            <div className="space-y-4">
              {/* Toggle between existing and new client */}
              <div className="flex gap-4 mb-6">
                <NeumorphButton
                  variant={!wizardData.createNewClient ? 'primary' : 'default'}
                  onClick={() => updateWizardData('createNewClient', false as any)}
                  className="flex-1"
                >
                  Existing Client
                </NeumorphButton>
                <NeumorphButton
                  variant={wizardData.createNewClient ? 'primary' : 'default'}
                  onClick={() => updateWizardData('createNewClient', true as any)}
                  className="flex-1"
                >
                  New Client
                </NeumorphButton>
              </div>

              {wizardData.createNewClient ? (
                // New client form
                <>
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Full Name *</Label>
                    <NeumorphInput
                      id="clientName"
                      placeholder="Enter client name"
                      value={wizardData.clientName}
                      onChange={(e) => updateWizardData('clientName', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email Address *</Label>
                    <NeumorphInput
                      id="clientEmail"
                      type="email"
                      placeholder="Enter client email"
                      value={wizardData.clientEmail}
                      onChange={(e) => updateWizardData('clientEmail', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientCompany">Company Name</Label>
                    <NeumorphInput
                      id="clientCompany"
                      placeholder="Enter company name"
                      value={wizardData.clientCompany}
                      onChange={(e) => updateWizardData('clientCompany', e.target.value)}
                    />
                  </div>
                </>
              ) : (
                // Existing client selection
                <div className="space-y-2">
                  <Label htmlFor="clientSelect">Select Client *</Label>
                  {clientsLoading ? (
                    <p className="text-muted-foreground">Loading clients...</p>
                  ) : !clients || clients.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground mb-4">No clients found</p>
                      <NeumorphButton
                        onClick={() => updateWizardData('createNewClient', true as any)}
                      >
                        Create New Client
                      </NeumorphButton>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {clients.map((client: any) => (
                        <NeumorphCard
                          key={client.id}
                          className={`cursor-pointer transition-all ${
                            wizardData.clientId === client.id ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => updateWizardData('clientId', client.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              wizardData.clientId === client.id 
                                ? 'bg-primary border-primary' 
                                : 'border-muted-foreground'
                            }`} />
                            <div className="flex-1">
                              <h4>{client.name}</h4>
                              <p className="text-sm text-muted-foreground">{client.email}</p>
                              {client.company && (
                                <p className="text-sm text-muted-foreground">{client.company}</p>
                              )}
                            </div>
                          </div>
                        </NeumorphCard>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2>Proposal Details</h2>
              <p className="text-muted-foreground">Set up your proposal title and basic information</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="proposalTitle">Proposal Title</Label>
                <NeumorphInput
                  id="proposalTitle"
                  placeholder="Enter proposal title"
                  value={wizardData.proposalTitle}
                  onChange={(e) => updateWizardData('proposalTitle', e.target.value)}
                />
              </div>
              
              <NeumorphCard variant="inset">
                <h4 className="mb-4">Summary</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Template:</span>
                    <span>{templates.find(t => t.id === wizardData.template)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Client:</span>
                    <span>{wizardData.clientCompany}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Contact:</span>
                    <span>{wizardData.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Title:</span>
                    <span>{wizardData.proposalTitle || 'Untitled Proposal'}</span>
                  </div>
                </div>
              </NeumorphCard>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  // Show loading while creating
  if (isCreating) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Create New Proposal</h1>
        <NeumorphButton onClick={onCancel}>
          Cancel
        </NeumorphButton>
      </div>
      
      {/* Progress Indicator */}
      <NeumorphCard>
        <div className="flex items-center justify-between mb-4">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step === currentStep 
                  ? 'bg-primary text-primary-foreground' 
                  : step < currentStep 
                    ? 'bg-green-500 text-white' 
                    : 'bg-muted text-muted-foreground'
              }`}>
                {step < currentStep ? '✓' : step}
              </div>
              {step < 3 && (
                <div className={`flex-1 h-1 mx-4 rounded ${
                  step < currentStep ? 'bg-green-500' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Step {currentStep} of 3: {
              currentStep === 1 ? 'Template Selection' :
              currentStep === 2 ? 'Client Information' :
              'Proposal Details'
            }
          </p>
        </div>
      </NeumorphCard>
      
      {/* Step Content */}
      <NeumorphCard className="min-h-[400px]">
        {renderStepContent()}
      </NeumorphCard>
      
      {/* Navigation */}
      <div className="flex justify-between">
        <NeumorphButton onClick={handleBack}>
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </NeumorphButton>
        <NeumorphButton 
          variant="primary" 
          onClick={handleNext}
          disabled={!canProceed()}
        >
          {currentStep === 3 ? 'Create Proposal' : 'Next'}
        </NeumorphButton>
      </div>
    </div>
  );
};