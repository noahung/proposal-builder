import React, { useMemo } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { useProposals } from '../../hooks/useProposals';
import { useClients } from '../../hooks/useClients';
import { LoadingScreen } from '../utility/LoadingScreen';

interface DashboardHomeProps {
  onNavigate: (page: string) => void;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigate }) => {
  // Fetch real data
  const { data: proposals, isLoading: proposalsLoading } = useProposals();
  const { data: clients, isLoading: clientsLoading } = useClients();

  // Calculate stats from real data
  const stats = useMemo(() => {
    if (!proposals) return [];

    const totalProposals = proposals.length;
    const activeProposals = proposals.filter(p => p.status === 'draft' || p.status === 'sent').length;
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const approvedThisMonth = proposals.filter(p => 
      p.status === 'approved' && new Date(p.updated_at) >= thisMonth
    ).length;
    const approvedTotal = proposals.filter(p => p.status === 'approved').length;
    const conversionRate = totalProposals > 0 
      ? Math.round((approvedTotal / totalProposals) * 100) 
      : 0;

    return [
      { label: 'Total Proposals', value: totalProposals.toString(), change: '+12%', icon: '📄' },
      { label: 'Active Proposals', value: activeProposals.toString(), change: '+5%', icon: '⏳' },
      { label: 'Approved This Month', value: approvedThisMonth.toString(), change: '+25%', icon: '✅' },
      { label: 'Conversion Rate', value: `${conversionRate}%`, change: '+8%', icon: '📈' },
    ];
  }, [proposals]);

  // Generate recent activity from real data
  const recentActivity = useMemo(() => {
    if (!proposals) return [];

    return proposals
      .slice(0, 5)
      .map(proposal => {
        const statusText = {
          draft: 'created',
          sent: 'sent to client',
          viewed: 'viewed by client',
          approved: 'approved',
          rejected: 'declined'
        }[proposal.status] || 'updated';

        return {
          action: `Proposal "${proposal.title}" ${statusText}`,
          time: getRelativeTime(proposal.updated_at),
          type: proposal.status === 'approved' ? 'approved' : 'view'
        };
      });
  }, [proposals]);

  // Show loading state
  if (proposalsLoading || clientsLoading) {
    return <LoadingScreen />;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'view': return '👁️';
      case 'approved': return '✅';
      case 'client': return '👥';
      case 'template': return '📋';
      default: return '📄';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Dashboard</h1>
        <NeumorphButton 
          variant="primary" 
          onClick={() => onNavigate('proposal-create')}
        >
          Create New Proposal
        </NeumorphButton>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <NeumorphCard key={index}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <h3>{stat.value}</h3>
                <p className="text-sm text-green-600">{stat.change}</p>
              </div>
              <div className="text-2xl">{stat.icon}</div>
            </div>
          </NeumorphCard>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <NeumorphCard>
          <h3 className="mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <NeumorphButton 
              className="w-full justify-start"
              onClick={() => onNavigate('proposal-create')}
            >
              <span className="mr-3">➕</span>
              Create New Proposal
            </NeumorphButton>
            <NeumorphButton 
              className="w-full justify-start"
              onClick={() => onNavigate('clients')}
            >
              <span className="mr-3">👥</span>
              Add New Client
            </NeumorphButton>
            <NeumorphButton 
              className="w-full justify-start"
              onClick={() => onNavigate('templates')}
            >
              <span className="mr-3">📋</span>
              Browse Templates
            </NeumorphButton>
            <NeumorphButton 
              className="w-full justify-start"
              onClick={() => onNavigate('analytics')}
            >
              <span className="mr-3">📊</span>
              View Analytics
            </NeumorphButton>
          </div>
        </NeumorphCard>
        
        {/* Recent Activity */}
        <NeumorphCard>
          <h3 className="mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="neumorph-card p-2 flex-shrink-0">
                  <span className="text-sm">{getActivityIcon(activity.type)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </NeumorphCard>
      </div>
    </div>
  );
};

// Helper function to get relative time
function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'view': return '👁️';
    case 'approved': return '✅';
    case 'client': return '👥';
    case 'template': return '📋';
    default: return '📄';
  }
}
