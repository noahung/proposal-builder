import React, { useState, useMemo } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { useProposals, useDeleteProposal } from '../../hooks/useProposals';
import { LoadingScreen } from '../utility/LoadingScreen';

interface ProposalsListProps {
  onNavigate: (page: string, proposalId?: string) => void;
}

export const ProposalsList: React.FC<ProposalsListProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Fetch real proposals data
  const { data: proposals, isLoading } = useProposals();
  const deleteProposal = useDeleteProposal();

  // Filter proposals based on search and status
  const filteredProposals = useMemo(() => {
    if (!proposals) return [];
    
    return proposals.filter(proposal => {
      const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || proposal.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [proposals, searchTerm, filterStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'text-muted-foreground';
      case 'sent': return 'text-blue-600';
      case 'viewed': return 'text-yellow-600';
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      sent: 'bg-blue-100 text-blue-800',
      viewed: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${colors[status as keyof typeof colors] || colors.draft}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const handleDelete = async (proposalId: string) => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      await deleteProposal.mutateAsync(proposalId);
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1>Proposals</h1>
        <NeumorphButton 
          variant="primary" 
          onClick={() => onNavigate('proposal-create')}
        >
          Create New Proposal
        </NeumorphButton>
      </div>
      
      {/* Filters */}
      <NeumorphCard>
        <div className="flex gap-4 items-center">
          <div className="flex-1 max-w-md">
            <NeumorphInput
              placeholder="Search proposals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', 'draft', 'sent', 'viewed', 'approved', 'rejected'].map((status) => (
              <NeumorphButton
                key={status}
                variant={filterStatus === status ? 'primary' : 'default'}
                onClick={() => setFilterStatus(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </NeumorphButton>
            ))}
          </div>
        </div>
      </NeumorphCard>
      
      {/* Proposals Table */}
      <NeumorphCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-left py-3 px-4">Client</th>
                <th className="text-left py-3 px-4">Status</th>
                <th className="text-left py-3 px-4">Value</th>
                <th className="text-left py-3 px-4">Last Viewed</th>
                <th className="text-left py-3 px-4">Created</th>
                <th className="text-left py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.map((proposal) => (
                <tr key={proposal.id} className="border-b border-border/50">
                  <td className="py-3 px-4">
                    <button 
                      onClick={() => onNavigate('proposal-editor', proposal.id)}
                      className="hover:text-primary"
                    >
                      {proposal.title}
                    </button>
                  </td>
                  <td className="py-3 px-4">{proposal.client?.name || 'No Client'}</td>
                  <td className="py-3 px-4">{getStatusBadge(proposal.status)}</td>
                  <td className="py-3 px-4">-</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {proposal.viewed_at ? new Date(proposal.viewed_at).toLocaleDateString() : 'Not viewed'}
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">
                    {new Date(proposal.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <NeumorphButton 
                        size="sm"
                        onClick={() => onNavigate('proposal-editor', proposal.id)}
                      >
                        Edit
                      </NeumorphButton>
                      <NeumorphButton 
                        size="sm"
                        onClick={() => handleDelete(proposal.id)}
                      >
                        Delete
                      </NeumorphButton>
                    </div>
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