import React, { useState } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  avatar?: string;
  lastActive: string;
  proposalsCreated: number;
  status: 'active' | 'pending' | 'inactive';
}

interface TeamManagementProps {
  onNavigate: (page: string) => void;
}

export const TeamManagement: React.FC<TeamManagementProps> = ({ onNavigate }) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [inviteData, setInviteData] = useState({
    email: '',
    role: 'editor' as const,
    message: '',
  });

  const teamMembers: TeamMember[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@proposalcraft.com',
      role: 'owner',
      lastActive: '2024-01-16',
      proposalsCreated: 24,
      status: 'active',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@proposalcraft.com',
      role: 'admin',
      lastActive: '2024-01-15',
      proposalsCreated: 18,
      status: 'active',
    },
    {
      id: '3',
      name: 'Mike Davis',
      email: 'mike@proposalcraft.com',
      role: 'editor',
      lastActive: '2024-01-14',
      proposalsCreated: 12,
      status: 'active',
    },
    {
      id: '4',
      name: 'Emily Brown',
      email: 'emily@proposalcraft.com',
      role: 'viewer',
      lastActive: '2024-01-10',
      proposalsCreated: 0,
      status: 'pending',
    },
  ];

  const roles = [
    { id: 'owner', name: 'Owner', description: 'Full access to all features and settings' },
    { id: 'admin', name: 'Admin', description: 'Manage team, proposals, and most settings' },
    { id: 'editor', name: 'Editor', description: 'Create and edit proposals, manage clients' },
    { id: 'viewer', name: 'Viewer', description: 'View proposals and analytics only' },
  ];

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-800',
      admin: 'bg-blue-100 text-blue-800',
      editor: 'bg-green-100 text-green-800',
      viewer: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[role as keyof typeof colors]}`}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleInviteMember = () => {
    console.log('Inviting member:', inviteData);
    setShowInviteModal(false);
    setInviteData({ email: '', role: 'editor', message: '' });
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    console.log('Updating role for member:', memberId, 'to:', newRole);
  };

  const handleRemoveMember = (memberId: string) => {
    console.log('Removing member:', memberId);
  };

  if (showInviteModal) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <NeumorphButton onClick={() => setShowInviteModal(false)}>
            ← Back
          </NeumorphButton>
          <h1>Invite Team Member</h1>
        </div>
        
        <NeumorphCard className="max-w-2xl">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <NeumorphInput
                id="email"
                type="email"
                placeholder="Enter email address"
                value={inviteData.email}
                onChange={(e) => setInviteData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
            
            <div className="space-y-3">
              <Label>Role</Label>
              {roles.map((role) => (
                <NeumorphCard
                  key={role.id}
                  className={`cursor-pointer transition-all ${
                    inviteData.role === role.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setInviteData(prev => ({ ...prev, role: role.id as any }))}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                      inviteData.role === role.id 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4>{role.name}</h4>
                        {getRoleBadge(role.id)}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                  </div>
                </NeumorphCard>
              ))}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <textarea
                id="message"
                placeholder="Add a personal message to the invitation..."
                value={inviteData.message}
                onChange={(e) => setInviteData(prev => ({ ...prev, message: e.target.value }))}
                className="neumorph-input w-full h-24 px-4 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            
            <div className="flex gap-4">
              <NeumorphButton onClick={() => setShowInviteModal(false)} className="flex-1">
                Cancel
              </NeumorphButton>
              <NeumorphButton 
                variant="primary" 
                onClick={handleInviteMember}
                className="flex-1"
                disabled={!inviteData.email}
              >
                Send Invitation
              </NeumorphButton>
            </div>
          </div>
        </NeumorphCard>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Team Management</h1>
        <NeumorphButton variant="primary" onClick={() => setShowInviteModal(true)}>
          Invite Team Member
        </NeumorphButton>
      </div>
      
      {/* Team Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Total Members</p>
          <h2 className="text-primary">{teamMembers.length}</h2>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Active Members</p>
          <h2 className="text-primary">{teamMembers.filter(m => m.status === 'active').length}</h2>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Pending Invites</p>
          <h2 className="text-primary">{teamMembers.filter(m => m.status === 'pending').length}</h2>
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Total Proposals</p>
          <h2 className="text-primary">{teamMembers.reduce((sum, m) => sum + m.proposalsCreated, 0)}</h2>
        </NeumorphCard>
      </div>
      
      {/* Team Members List */}
      <NeumorphCard>
        <h3 className="mb-6">Team Members</h3>
        <div className="space-y-4">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-4 neumorph-inset rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                  {member.avatar ? (
                    <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-lg">👤</span>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h4>{member.name}</h4>
                    {getRoleBadge(member.role)}
                    {getStatusBadge(member.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  <div className="flex gap-4 text-xs text-muted-foreground mt-1">
                    <span>Last active: {new Date(member.lastActive).toLocaleDateString()}</span>
                    <span>Proposals: {member.proposalsCreated}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {member.role !== 'owner' && (
                  <>
                    <select
                      value={member.role}
                      onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                      className="neumorph-input px-3 py-1 text-sm"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                    
                    <NeumorphButton 
                      size="sm" 
                      variant="destructive"
                      onClick={() => handleRemoveMember(member.id)}
                    >
                      Remove
                    </NeumorphButton>
                  </>
                )}
                {member.role === 'owner' && (
                  <span className="text-sm text-muted-foreground">Account Owner</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </NeumorphCard>
      
      {/* Role Permissions */}
      <NeumorphCard>
        <h3 className="mb-4">Role Permissions</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Permission</th>
                <th className="text-center py-3 px-4">Owner</th>
                <th className="text-center py-3 px-4">Admin</th>
                <th className="text-center py-3 px-4">Editor</th>
                <th className="text-center py-3 px-4">Viewer</th>
              </tr>
            </thead>
            <tbody>
              {[
                { permission: 'Create Proposals', owner: true, admin: true, editor: true, viewer: false },
                { permission: 'Edit Proposals', owner: true, admin: true, editor: true, viewer: false },
                { permission: 'Send Proposals', owner: true, admin: true, editor: true, viewer: false },
                { permission: 'Manage Clients', owner: true, admin: true, editor: true, viewer: false },
                { permission: 'View Analytics', owner: true, admin: true, editor: true, viewer: true },
                { permission: 'Manage Team', owner: true, admin: true, editor: false, viewer: false },
                { permission: 'Billing & Settings', owner: true, admin: false, editor: false, viewer: false },
              ].map((row, index) => (
                <tr key={index} className="border-b border-border/50">
                  <td className="py-3 px-4">{row.permission}</td>
                  <td className="text-center py-3 px-4">
                    {row.owner ? '✅' : '❌'}
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.admin ? '✅' : '❌'}
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.editor ? '✅' : '❌'}
                  </td>
                  <td className="text-center py-3 px-4">
                    {row.viewer ? '✅' : '❌'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NeumorphCard>
    </div>
  );
};