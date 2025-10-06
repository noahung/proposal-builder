import React from 'react';
import { Button } from '../ui/button';

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
  photo?: string;
}

interface CompanyInfo {
  name: string;
  logo?: string;
}

interface MaterialClientLayoutProps {
  proposalTitle: string;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  contactInfo: ContactInfo;
  companyInfo: CompanyInfo;
  children: React.ReactNode;
  onThemeChange: (theme: 'neumorphic' | 'material') => void;
  currentTheme: 'neumorphic' | 'material';
}

export const MaterialClientLayout: React.FC<MaterialClientLayoutProps> = ({
  proposalTitle,
  currentPage,
  totalPages,
  onPageChange,
  contactInfo,
  companyInfo,
  children,
  onThemeChange,
  currentTheme,
}) => {
  return (
    <div className="min-h-screen material-surface">
      {/* Header */}
      <header className="material-card-elevated sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-material-primary rounded-full flex items-center justify-center">
                <span className="text-material-on-primary font-medium">
                  {companyInfo.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-xl font-medium text-material-on-surface">{proposalTitle}</h1>
                <p className="text-sm text-material-on-surface-variant">{companyInfo.name}</p>
              </div>
            </div>
            
            {/* Theme Toggle */}
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
        </div>
        
        {/* Page Navigation */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                variant="outline"
                size="sm"
                className="material-button"
              >
                Previous
              </Button>
              <span className="text-sm text-material-on-surface-variant px-3">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                className="material-button"
              >
                Next
              </Button>
            </div>
            
            {/* Page Indicators */}
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-full text-xs transition-all ${
                    page === currentPage
                      ? 'bg-material-primary text-material-on-primary'
                      : 'bg-material-surface-variant text-material-on-surface-variant hover:bg-material-outline-variant'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-80 material-sidebar min-h-screen">
          <div className="p-6">
            {/* Contact Information */}
            <div className="material-card p-4 mb-6">
              <h3 className="font-medium text-material-on-surface mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-material-surface-variant rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-material-on-surface-variant">
                      {contactInfo.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-material-on-surface">{contactInfo.name}</div>
                    <div className="text-sm text-material-on-surface-variant">Account Manager</div>
                  </div>
                </div>
                
                <div className="space-y-2 pt-2 border-t border-material-outline-variant">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-material-on-surface-variant">Email:</span>
                    <a href={`mailto:${contactInfo.email}`} className="text-material-primary hover:underline">
                      {contactInfo.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-material-on-surface-variant">Phone:</span>
                    <a href={`tel:${contactInfo.phone}`} className="text-material-primary hover:underline">
                      {contactInfo.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Table of Contents */}
            <div className="material-card p-4">
              <h3 className="font-medium text-material-on-surface mb-4">Table of Contents</h3>
              <nav className="space-y-1">
                {[
                  { page: 1, title: 'Executive Summary' },
                  { page: 2, title: 'Project Overview' },
                  { page: 3, title: 'Scope of Work' },
                  { page: 4, title: 'Timeline & Milestones' },
                  { page: 5, title: 'Team & Expertise' },
                  { page: 6, title: 'Investment & Pricing' },
                  { page: 7, title: 'Terms & Conditions' },
                  { page: 8, title: 'Next Steps' },
                ].map((item) => (
                  <button
                    key={item.page}
                    onClick={() => onPageChange(item.page)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                      currentPage === item.page
                        ? 'bg-material-primary text-material-on-primary'
                        : 'text-material-on-surface-variant hover:bg-material-surface-variant hover:text-material-on-surface'
                    }`}
                  >
                    <span className="font-medium">{item.page}.</span> {item.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};