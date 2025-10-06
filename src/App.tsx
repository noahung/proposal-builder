import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';

// Auth Components
import { LandingScreen } from './components/auth/LandingScreen';
import { SignInScreen } from './components/auth/SignInScreen';
import { SignUpScreen } from './components/auth/SignUpScreen';
import { ForgotPasswordScreen } from './components/auth/ForgotPasswordScreen';
import { OnboardingScreen } from './components/auth/OnboardingScreen';

// Admin Components
import { AdminLayout } from './components/layout/AdminLayout';
import { DashboardHome } from './components/admin/DashboardHome';
import { ProposalsList } from './components/admin/ProposalsList';
import { ProposalCreationWizard } from './components/admin/ProposalCreationWizard';
import { ProposalEditor } from './components/admin/ProposalEditor';
import { ClientManagement } from './components/admin/ClientManagement';
import { TemplateLibrary } from './components/admin/TemplateLibrary';
import { ProposalAnalytics } from './components/admin/ProposalAnalytics';
import { ElementLibrary } from './components/admin/ElementLibrary';
import { TeamManagement } from './components/admin/TeamManagement';
import { Settings } from './components/admin/Settings';

// Client Components
import { ClientLayout } from './components/client/ClientLayout';
import { MaterialClientLayout } from './components/client/MaterialClientLayout';
import { ProposalLanding } from './components/client/ProposalLanding';
import { MaterialProposalLanding } from './components/client/MaterialProposalLanding';
import { ProposalContent } from './components/client/ProposalContent';
import { MaterialProposalContent } from './components/client/MaterialProposalContent';
import { PostApprovalConfirmation } from './components/client/PostApprovalConfirmation';

// Modals
import { ApprovalModal } from './components/modals/ApprovalModal';
import { RejectionModal } from './components/modals/RejectionModal';

// Utility Components
import { ErrorScreen } from './components/utility/ErrorScreen';
import { LoadingScreen } from './components/utility/LoadingScreen';

// UI Components
import { NeumorphButton } from './components/ui/neumorph-button';

type AuthScreen = 'landing' | 'signin' | 'signup' | 'forgot-password' | 'onboarding';
type AdminScreen = 'dashboard' | 'proposals' | 'clients' | 'templates' | 'elements' | 'analytics' | 'team' | 'settings' | 'proposal-create' | 'proposal-editor' | 'proposal-preview' | 'proposal-send' | 'proposal-analytics';
type ClientScreen = 'landing' | 'content' | 'approved';
type AppState = 'auth' | 'admin' | 'client';
type ClientTheme = 'neumorphic' | 'material';

export default function App() {
  const { user, profile, loading: authLoading, signOut } = useAuth();
  
  const [authScreen, setAuthScreen] = useState<AuthScreen>('landing');
  const [adminScreen, setAdminScreen] = useState<AdminScreen>('dashboard');
  const [clientScreen, setClientScreen] = useState<ClientScreen>('landing');
  const [clientTheme, setClientTheme] = useState<ClientTheme>('neumorphic');
  const [showClientDemo, setShowClientDemo] = useState(false); // For demo client view
  
  // Client state
  const [currentPage, setCurrentPage] = useState(1);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);

  // Show loading screen while checking authentication
  if (authLoading) {
    return <LoadingScreen />;
  }

  // Mock data
  const proposalData = {
    title: 'Website Redesign Project',
    client: 'TechCorp Ltd',
    company: {
      name: 'ProposalCraft Agency',
      logo: undefined,
    },
    contact: {
      name: 'Sarah Johnson',
      email: 'sarah@proposalcraft.com',
      phone: '+44 20 7123 4567',
      photo: undefined,
    },
  };

  // Auth handlers - authentication is now handled directly in SignIn/SignUp screens
  const handleForgotPassword = (email: string) => {
    console.log('Password reset requested for:', email);
  };

  const handleOnboardingComplete = (data: any) => {
    // After onboarding, user is already authenticated, just reset screen
    setAuthScreen('landing');
  };

  // Admin handlers
  const handleAdminNavigate = (page: string, id?: string) => {
    setAdminScreen(page as AdminScreen);
  };

  const handleLogout = async () => {
    await signOut();
    setAuthScreen('landing');
  };

  // Client handlers
  const handleClientViewProposal = () => {
    setShowClientDemo(true);
    setClientScreen('content');
  };
  
  const handleThemeChange = (theme: ClientTheme) => {
    setClientTheme(theme);
  };

  const handleApproveProposal = (signature?: string) => {
    setShowApprovalModal(false);
    setClientScreen('approved');
    console.log('Proposal approved with signature:', signature);
  };

  const handleRejectProposal = (feedback: string) => {
    setShowRejectionModal(false);
    console.log('Proposal rejected with feedback:', feedback);
    alert('Proposal has been declined. The agency has been notified.');
  };

  const handleDownloadPDF = () => {
    console.log('Downloading PDF...');
    alert('PDF download would start here');
  };

  // Demo: Switch to client view
  const switchToClientView = () => {
    setShowClientDemo(true);
    setClientScreen('landing');
  };

  // If viewing client demo
  if (showClientDemo) {
    const renderClientContent = () => {
      if (clientTheme === 'material') {
        switch (clientScreen) {
          case 'landing':
            return (
              <MaterialProposalLanding
                proposalData={proposalData}
                onViewProposal={handleClientViewProposal}
                onDownloadPDF={handleDownloadPDF}
              />
            );
          case 'content':
            return (
              <MaterialProposalContent
                proposalData={proposalData}
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
                onApprove={() => setShowApprovalModal(true)}
                onReject={() => setShowRejectionModal(true)}
                onDownloadPDF={handleDownloadPDF}
              />
            );
          case 'approved':
            return <PostApprovalConfirmation proposalData={proposalData} />;
          default:
            return null;
        }
      } else {
        // Neumorphic theme
        switch (clientScreen) {
          case 'landing':
            return (
              <ProposalLanding
                proposalData={proposalData}
                onViewProposal={handleClientViewProposal}
                onDownloadPDF={handleDownloadPDF}
              />
            );
          case 'content':
            return (
              <ProposalContent
                proposalData={proposalData}
                currentPage={currentPage}
                totalPages={5}
                onPageChange={setCurrentPage}
                onApprove={() => setShowApprovalModal(true)}
                onReject={() => setShowRejectionModal(true)}
                onDownloadPDF={handleDownloadPDF}
              />
            );
          case 'approved':
            return <PostApprovalConfirmation proposalData={proposalData} />;
          default:
            return null;
        }
      }
    };

    const LayoutComponent = clientTheme === 'material' ? MaterialClientLayout : ClientLayout;

    return (
      <div>
        <LayoutComponent
          currentTheme={clientTheme}
          onThemeChange={handleThemeChange}
        >
          {renderClientContent()}
        </LayoutComponent>

        {/* Modals */}
        {showApprovalModal && (
          <ApprovalModal
            onApprove={handleApproveProposal}
            onCancel={() => setShowApprovalModal(false)}
          />
        )}
        {showRejectionModal && (
          <RejectionModal
            onReject={handleRejectProposal}
            onCancel={() => setShowRejectionModal(false)}
          />
        )}

        {/* Demo button to switch back to admin */}
        <div className="fixed top-4 right-4">
          <NeumorphButton
            onClick={() => setShowClientDemo(false)}
            variant="primary"
            size="sm"
          >
            Back to Admin
          </NeumorphButton>
        </div>
      </div>
    );
  }

  // If user is authenticated, show admin panel
  if (user && profile) {
    const renderAdminContent = () => {
      switch (adminScreen) {
        case 'dashboard':
          return <DashboardHome onNavigate={handleAdminNavigate} />;
        case 'proposals':
          return <ProposalsList onNavigate={handleAdminNavigate} />;
        case 'proposal-create':
          return (
            <ProposalCreationWizard
              onComplete={(proposalId) => {
                console.log('Proposal created with ID:', proposalId);
                handleAdminNavigate('proposal-editor', proposalId);
              }}
              onCancel={() => handleAdminNavigate('proposals')}
            />
          );
        case 'proposal-editor':
          return (
            <ProposalEditor
              onSave={() => console.log('Saving proposal')}
              onPreview={() => handleAdminNavigate('proposal-preview')}
              onBack={() => handleAdminNavigate('proposals')}
            />
          );
        case 'clients':
          return <ClientManagement onNavigate={handleAdminNavigate} />;
        case 'templates':
          return <TemplateLibrary onNavigate={handleAdminNavigate} />;
        case 'elements':
          return <ElementLibrary onNavigate={handleAdminNavigate} />;
        case 'analytics':
          return <ProposalAnalytics onNavigate={handleAdminNavigate} />;
        case 'team':
          return <TeamManagement onNavigate={handleAdminNavigate} />;
        case 'settings':
          return <Settings onNavigate={handleAdminNavigate} />;
        case 'proposal-preview':
          return (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAdminNavigate('proposal-editor')}
                  className="px-4 py-2 neumorph-button rounded-lg"
                >
                  ← Back to Editor
                </button>
                <h1>Proposal Preview</h1>
              </div>
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  Preview functionality would show the proposal as clients will see it
                </p>
                <NeumorphButton
                  onClick={() => handleAdminNavigate('proposal-send')}
                  variant="primary"
                >
                  Send to Client
                </NeumorphButton>
              </div>
            </div>
          );
        default:
          return (
            <div className="text-center">
              <h1>Coming Soon</h1>
              <p className="text-muted-foreground">
                The {adminScreen.replace('-', ' ')} screen is under development.
              </p>
            </div>
          );
      }
    };

    return (
      <div>
        <AdminLayout
          currentPage={adminScreen}
          onNavigate={handleAdminNavigate}
          onLogout={handleLogout}
        >
          {renderAdminContent()}
        </AdminLayout>
        {/* Demo button to switch to client view */}
        <div className="fixed top-4 right-4">
          <NeumorphButton
            onClick={switchToClientView}
            variant="primary"
            size="sm"
          >
            Demo: View as Client
          </NeumorphButton>
        </div>
      </div>
    );
  }

  // If not authenticated, show auth screens
  switch (authScreen) {
    case 'landing':
      return (
        <div>
          <LandingScreen
            onSignIn={() => setAuthScreen('signin')}
            onSignUp={() => setAuthScreen('signup')}
          />
          {/* Demo button to switch to client view */}
          <div className="fixed top-4 right-4">
            <NeumorphButton
              onClick={switchToClientView}
              variant="primary"
              size="sm"
            >
              Demo: View as Client
            </NeumorphButton>
          </div>
        </div>
      );
    case 'signin':
      return (
        <SignInScreen
          onForgotPassword={() => setAuthScreen('forgot-password')}
          onBackToLanding={() => setAuthScreen('landing')}
        />
      );
    case 'signup':
      return (
        <SignUpScreen
          onBackToLanding={() => setAuthScreen('landing')}
        />
      );
    case 'forgot-password':
      return (
        <ForgotPasswordScreen
          onResetPassword={handleForgotPassword}
          onBackToSignIn={() => setAuthScreen('signin')}
        />
      );
    case 'onboarding':
      return (
        <OnboardingScreen
          onComplete={handleOnboardingComplete}
        />
      );
    default:
      return null;
  }
}