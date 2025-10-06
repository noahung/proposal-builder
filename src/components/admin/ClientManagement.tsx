import React, { useState, useMemo } from 'react';
import { NeumorphCard } from '../ui/neumorph-card';
import { NeumorphButton } from '../ui/neumorph-button';
import { NeumorphInput } from '../ui/neumorph-input';
import { Label } from '../ui/label';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../../hooks/useClients';
import { LoadingScreen } from '../utility/LoadingScreen';

interface ClientManagementProps {
  onNavigate: (page: string, clientId?: string) => void;
}

export const ClientManagement: React.FC<ClientManagementProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    notes: '',
  });

  // Fetch real clients data
  const { data: clients, isLoading } = useClients();
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    if (!clients) return [];
    
    return clients.filter(client =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (client.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.email) {
      alert('Please fill in required fields (name and email)');
      return;
    }

    try {
      const result = await createClient.mutateAsync({
        name: newClient.name,
        email: newClient.email,
        company: newClient.company || undefined,
        phone: newClient.phone || undefined,
        notes: newClient.notes || undefined,
      });

      console.log('Client created:', result);

      setShowAddClient(false);
      setNewClient({ name: '', company: '', email: '', phone: '', notes: '' });
    } catch (error) {
      console.error('Error creating client:', error);
      alert(`Failed to create client: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      await deleteClient.mutateAsync(clientId);
    }
  };

  // Show loading state
  if (isLoading) {
    return <LoadingScreen />;
  }

  if (showAddClient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <NeumorphButton onClick={() => setShowAddClient(false)}>
            ← Back
          </NeumorphButton>
          <h1>Add New Client</h1>
        </div>
        
        <NeumorphCard className="max-w-2xl">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <NeumorphInput
                  id="name"
                  placeholder="Enter client name"
                  value={newClient.name}
                  onChange={(e) => setNewClient(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <NeumorphInput
                  id="company"
                  placeholder="Enter company name"
                  value={newClient.company}
                  onChange={(e) => setNewClient(prev => ({ ...prev, company: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <NeumorphInput
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={newClient.email}
                  onChange={(e) => setNewClient(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <NeumorphInput
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={newClient.phone}
                  onChange={(e) => setNewClient(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <NeumorphButton onClick={() => setShowAddClient(false)} className="flex-1">
                Cancel
              </NeumorphButton>
              <NeumorphButton 
                variant="primary" 
                onClick={handleAddClient}
                className="flex-1"
                disabled={!newClient.name || !newClient.email}
              >
                Add Client
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
        <h1>Client Management</h1>
        <NeumorphButton variant="primary" onClick={() => setShowAddClient(true)}>
          Add New Client
        </NeumorphButton>
      </div>
      
      {/* Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <NeumorphCard className="md:col-span-2">
          <NeumorphInput
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </NeumorphCard>
        
        <NeumorphCard className="text-center">
          <p className="text-sm text-muted-foreground">Total Clients</p>
          <p className="text-2xl font-medium">{clients?.length || 0}</p>
        </NeumorphCard>
      </div>
      
      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <NeumorphCard 
            key={client.id}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3>{client.name}</h3>
                <p className="text-muted-foreground">{client.company || 'No company'}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Email:</span>
                <span>{client.email}</span>
              </div>
              {client.phone && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phone:</span>
                  <span>{client.phone}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Added:</span>
                <span>{new Date(client.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            
            <div className="flex gap-2 mt-4">
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={() => window.open(`mailto:${client.email}`)}
              >
                📧 Email
              </NeumorphButton>
              <NeumorphButton 
                size="sm" 
                className="flex-1"
                onClick={() => handleDeleteClient(client.id)}
              >
                �️ Delete
              </NeumorphButton>
            </div>
          </NeumorphCard>
        ))}
      </div>
    </div>
  );
};