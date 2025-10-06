import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';

interface ClientLayoutProps {
  children: React.ReactNode;
  proposalTitle: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  contactInfo: {
    name: string;
    photo?: string;
    phone: string;
    email: string;
  };
  companyInfo: {
    name: string;
    logo?: string;
  };
  onThemeChange?: (theme: 'neumorphic' | 'material') => void;
  currentTheme?: 'neumorphic' | 'material';
}

export const ClientLayout: React.FC<ClientLayoutProps> = ({
  children,
  proposalTitle,
  currentPage,
  totalPages,
  onPageChange,
  contactInfo,
  companyInfo,
  onThemeChange,
  currentTheme = 'neumorphic',
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => ({
    number: i + 1,
    title: i === 0 ? 'Cover' : `Page ${i + 1}`,
  }));

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-80 neumorph-sidebar p-6 flex flex-col">
        {/* Theme Toggle */}
        {onThemeChange && (
          <div className="mb-6">
            <div className="flex bg-muted rounded-lg p-1">
              <button
                onClick={() => onThemeChange('neumorphic')}
                className={`px-3 py-1 rounded text-sm transition-all flex-1 ${
                  currentTheme === 'neumorphic'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Neumorphic
              </button>
              <button
                onClick={() => onThemeChange('material')}
                className={`px-3 py-1 rounded text-sm transition-all flex-1 ${
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
        
        {/* Company Branding */}
        <div className="mb-8">
          <NeumorphCard className="text-center">
            {companyInfo.logo ? (
              <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <img src={companyInfo.logo} alt={companyInfo.name} className="w-12 h-12 object-contain" />
              </div>
            ) : (
              <div className="w-16 h-16 bg-primary rounded-xl mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h4M9 3v18m6-18v18" />
                </svg>
              </div>
            )}
            <h3 className="mb-2">{companyInfo.name}</h3>
            <p className="text-sm text-muted-foreground">{proposalTitle}</p>
          </NeumorphCard>
        </div>
        
        {/* Page Navigation */}
        <div className="flex-1">
          <h4 className="mb-4">Contents</h4>
          <nav className="space-y-2">
            {pages.map((page) => (
              <button
                key={page.number}
                onClick={() => onPageChange(page.number)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  currentPage === page.number
                    ? 'neumorph-inset text-primary'
                    : 'hover:neumorph-card'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{page.title}</span>
                  <span className="text-xs text-muted-foreground">{page.number}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        {/* Contact Information - Fixed at Bottom */}
        <div className="mt-8">
          <NeumorphCard>
            <div className="text-center">
              <div className="w-12 h-12 bg-muted rounded-full mx-auto mb-3 flex items-center justify-center">
                {contactInfo.photo ? (
                  <img src={contactInfo.photo} alt={contactInfo.name} className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <span className="text-lg">👤</span>
                )}
              </div>
              <h5 className="mb-2">{contactInfo.name}</h5>
              <p className="text-xs text-muted-foreground mb-4">Point of Contact</p>
              
              <div className="flex gap-2">
                <NeumorphButton 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`tel:${contactInfo.phone}`)}
                >
                  📞
                </NeumorphButton>
                <NeumorphButton 
                  size="sm" 
                  className="flex-1"
                  onClick={() => window.open(`mailto:${contactInfo.email}`)}
                >
                  ✉️
                </NeumorphButton>
              </div>
            </div>
          </NeumorphCard>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};