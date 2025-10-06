import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Switch } from '../ui/switch';

interface SettingsProps {
  onNavigate: (page: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState({
    // Account Settings
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@proposalcraft.com',
    company: 'ProposalCraft Agency',
    jobTitle: 'Creative Director',
    phone: '+44 20 7123 4567',
    timezone: 'GMT',
    
    // Notification Settings
    emailNotifications: true,
    proposalUpdates: true,
    clientResponses: true,
    weeklyReports: false,
    marketingEmails: false,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: '30',
    
    // General Preferences
    defaultCurrency: 'GBP',
    dateFormat: 'DD/MM/YYYY',
    autoSave: true,
    darkMode: false,
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'account', label: 'Account', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'preferences', label: 'Preferences', icon: '⚙️' },
    { id: 'billing', label: 'Billing', icon: '💳' },
    { id: 'integrations', label: 'Integrations', icon: '🔗' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'account':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">First Name</label>
                  <NeumorphInput
                    value={settings.firstName}
                    onChange={(e) => handleSettingChange('firstName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Last Name</label>
                  <NeumorphInput
                    value={settings.lastName}
                    onChange={(e) => handleSettingChange('lastName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Email Address</label>
                  <NeumorphInput
                    type="email"
                    value={settings.email}
                    onChange={(e) => handleSettingChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Phone Number</label>
                  <NeumorphInput
                    value={settings.phone}
                    onChange={(e) => handleSettingChange('phone', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Job Title</label>
                  <NeumorphInput
                    value={settings.jobTitle}
                    onChange={(e) => handleSettingChange('jobTitle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Timezone</label>
                  <select 
                    className="neumorph-input w-full px-3 py-2"
                    value={settings.timezone}
                    onChange={(e) => handleSettingChange('timezone', e.target.value)}
                  >
                    <option value="GMT">GMT (Greenwich Mean Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                    <option value="CET">CET (Central European Time)</option>
                  </select>
                </div>
              </div>
            </NeumorphCard>

            <NeumorphCard>
              <h3 className="mb-6">Company Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Company Name</label>
                  <NeumorphInput
                    value={settings.company}
                    onChange={(e) => handleSettingChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 neumorph-card flex items-center justify-center rounded-full">
                      <span className="text-2xl">🏢</span>
                    </div>
                    <NeumorphButton size="sm">
                      Upload New Logo
                    </NeumorphButton>
                  </div>
                </div>
              </div>
            </NeumorphCard>

            <div className="flex justify-end">
              <NeumorphButton variant="primary">
                Save Changes
              </NeumorphButton>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">Email Notifications</h3>
              <div className="space-y-4">
                {[
                  { key: 'emailNotifications', label: 'Enable email notifications', description: 'Receive notifications via email' },
                  { key: 'proposalUpdates', label: 'Proposal updates', description: 'Get notified when proposals are viewed or approved' },
                  { key: 'clientResponses', label: 'Client responses', description: 'Notifications for client feedback and messages' },
                  { key: 'weeklyReports', label: 'Weekly reports', description: 'Summary of your proposal activity' },
                  { key: 'marketingEmails', label: 'Marketing emails', description: 'Product updates and tips from ProposalCraft' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-muted-foreground">{item.description}</div>
                    </div>
                    <Switch
                      checked={settings[item.key as keyof typeof settings] as boolean}
                      onCheckedChange={(checked) => handleSettingChange(item.key, checked)}
                    />
                  </div>
                ))}
              </div>
            </NeumorphCard>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">Password & Authentication</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="mb-4">Change Password</h4>
                  <div className="space-y-4 max-w-md">
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Current Password</label>
                      <NeumorphInput type="password" placeholder="Enter current password" />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">New Password</label>
                      <NeumorphInput type="password" placeholder="Enter new password" />
                    </div>
                    <div>
                      <label className="block text-sm text-muted-foreground mb-2">Confirm New Password</label>
                      <NeumorphInput type="password" placeholder="Confirm new password" />
                    </div>
                    <NeumorphButton size="sm">
                      Update Password
                    </NeumorphButton>
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4>Two-Factor Authentication</h4>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange('twoFactorAuth', checked)}
                    />
                  </div>
                </div>

                <div className="border-t border-border pt-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Session Timeout (minutes)</label>
                    <select 
                      className="neumorph-input w-32 px-3 py-2"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleSettingChange('sessionTimeout', e.target.value)}
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>
                </div>
              </div>
            </NeumorphCard>
          </div>
        );

      case 'preferences':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">General Preferences</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Default Currency</label>
                    <select 
                      className="neumorph-input w-full px-3 py-2"
                      value={settings.defaultCurrency}
                      onChange={(e) => handleSettingChange('defaultCurrency', e.target.value)}
                    >
                      <option value="GBP">GBP (£)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="CAD">CAD (C$)</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Date Format</label>
                    <select 
                      className="neumorph-input w-full px-3 py-2"
                      value={settings.dateFormat}
                      onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
                    <div>
                      <div className="font-medium">Auto-save proposals</div>
                      <div className="text-sm text-muted-foreground">Automatically save your work every 30 seconds</div>
                    </div>
                    <Switch
                      checked={settings.autoSave}
                      onCheckedChange={(checked) => handleSettingChange('autoSave', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
                    <div>
                      <div className="font-medium">Dark mode</div>
                      <div className="text-sm text-muted-foreground">Use dark theme (coming soon)</div>
                    </div>
                    <Switch
                      checked={settings.darkMode}
                      onCheckedChange={(checked) => handleSettingChange('darkMode', checked)}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </NeumorphCard>
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">Current Plan</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
                  <div>
                    <div className="font-medium text-primary">Professional Plan</div>
                    <div className="text-sm text-muted-foreground">Up to 100 proposals per month</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">£49/month</div>
                    <div className="text-sm text-muted-foreground">Billed monthly</div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <NeumorphButton variant="primary">
                    Upgrade Plan
                  </NeumorphButton>
                  <NeumorphButton>
                    Change to Annual
                  </NeumorphButton>
                </div>
              </div>
            </NeumorphCard>

            <NeumorphCard>
              <h3 className="mb-6">Payment Method</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 neumorph-inset rounded-lg">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center">
                    <span className="text-white text-xs font-medium">VISA</span>
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-sm text-muted-foreground">Expires 12/25</div>
                  </div>
                  <NeumorphButton size="sm">
                    Update
                  </NeumorphButton>
                </div>
              </div>
            </NeumorphCard>

            <NeumorphCard>
              <h3 className="mb-6">Billing History</h3>
              <div className="space-y-2">
                {[
                  { date: '1 Nov 2024', amount: '£49.00', status: 'Paid' },
                  { date: '1 Oct 2024', amount: '£49.00', status: 'Paid' },
                  { date: '1 Sep 2024', amount: '£49.00', status: 'Paid' },
                ].map((invoice, index) => (
                  <div key={index} className="flex items-center justify-between p-3 neumorph-inset rounded-lg">
                    <div>
                      <div className="font-medium">{invoice.date}</div>
                      <div className="text-sm text-muted-foreground">Professional Plan</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{invoice.amount}</div>
                      <div className="text-sm text-green-600">{invoice.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </NeumorphCard>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <NeumorphCard>
              <h3 className="mb-6">Available Integrations</h3>
              <div className="space-y-4">
                {[
                  { 
                    name: 'Google Drive', 
                    description: 'Sync your proposals with Google Drive',
                    icon: '📁',
                    connected: false
                  },
                  { 
                    name: 'Slack', 
                    description: 'Get notifications in your Slack workspace',
                    icon: '💬',
                    connected: true
                  },
                  { 
                    name: 'DocuSign', 
                    description: 'Send approved proposals for electronic signature',
                    icon: '✍️',
                    connected: false
                  },
                  { 
                    name: 'Zapier', 
                    description: 'Connect with 5000+ apps via Zapier',
                    icon: '⚡',
                    connected: false
                  },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 neumorph-card flex items-center justify-center rounded-lg">
                        <span className="text-xl">{integration.icon}</span>
                      </div>
                      <div>
                        <div className="font-medium">{integration.name}</div>
                        <div className="text-sm text-muted-foreground">{integration.description}</div>
                      </div>
                    </div>
                    <NeumorphButton size="sm" variant={integration.connected ? 'destructive' : 'primary'}>
                      {integration.connected ? 'Disconnect' : 'Connect'}
                    </NeumorphButton>
                  </div>
                ))}
              </div>
            </NeumorphCard>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:w-64">
          <NeumorphCard>
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted/20 text-foreground'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </NeumorphCard>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};