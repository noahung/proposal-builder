import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

const navigation = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'proposals', label: 'Proposals', icon: '📄' },
  { id: 'clients', label: 'Clients', icon: '👥' },
  { id: 'templates', label: 'Templates', icon: '📋' },
  { id: 'elements', label: 'Elements', icon: '🧩' },
  { id: 'analytics', label: 'Analytics', icon: '📈' },
  { id: 'team', label: 'Team', icon: '👤' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  currentPage, 
  onNavigate, 
  onLogout 
}) => {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-64 neumorph-sidebar p-6">
        <div className="mb-8">
          <div className="neumorph-card p-3 inline-flex mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h2>ProposalCraft</h2>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                currentPage === item.id
                  ? 'neumorph-inset text-primary'
                  : 'hover:neumorph-card'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
        
        <div className="mt-auto pt-8">
          <NeumorphButton onClick={onLogout} className="w-full">
            Sign Out
          </NeumorphButton>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        {children}
      </div>
    </div>
  );
};