import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientService, CreateClientData, UpdateClientData } from '../services/clientService';

// Query keys
export const clientKeys = {
  all: ['clients'] as const,
  lists: () => [...clientKeys.all, 'list'] as const,
  list: (filters: string) => [...clientKeys.lists(), { filters }] as const,
  details: () => [...clientKeys.all, 'detail'] as const,
  detail: (id: string) => [...clientKeys.details(), id] as const,
};

// Get all clients
export const useClients = () => {
  return useQuery({
    queryKey: clientKeys.lists(),
    queryFn: async () => {
      const { data, error } = await ClientService.getAll();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

// Get single client
export const useClient = (id: string) => {
  return useQuery({
    queryKey: clientKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await ClientService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

// Get clients with proposal count
export const useClientsWithProposalCount = () => {
  return useQuery({
    queryKey: [...clientKeys.lists(), 'with-count'],
    queryFn: async () => {
      const { data, error } = await ClientService.getWithProposalCount();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

// Create client mutation
export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateClientData) => ClientService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
};

// Update client mutation
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateClientData }) =>
      ClientService.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.id) });
    },
  });
};

// Delete client mutation
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ClientService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
    },
  });
};

// Search clients
export const useSearchClients = (query: string) => {
  return useQuery({
    queryKey: [...clientKeys.lists(), 'search', query],
    queryFn: async () => {
      if (!query) return [];
      const { data, error } = await ClientService.search(query);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: query.length > 0,
  });
};
