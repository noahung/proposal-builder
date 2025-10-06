import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ProposalService, CreateProposalData, UpdateProposalData } from '../services/proposalService';

// Query keys
export const proposalKeys = {
  all: ['proposals'] as const,
  lists: () => [...proposalKeys.all, 'list'] as const,
  list: (filters: string) => [...proposalKeys.lists(), { filters }] as const,
  details: () => [...proposalKeys.all, 'detail'] as const,
  detail: (id: string) => [...proposalKeys.details(), id] as const,
};

// Get all proposals
export const useProposals = () => {
  return useQuery({
    queryKey: proposalKeys.lists(),
    queryFn: async () => {
      const { data, error } = await ProposalService.getAll();
      if (error) throw new Error(error);
      return data || [];
    },
  });
};

// Get single proposal
export const useProposal = (id: string) => {
  return useQuery({
    queryKey: proposalKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await ProposalService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

// Create proposal mutation
export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateProposalData) => ProposalService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

// Update proposal mutation
export const useUpdateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateProposalData }) =>
      ProposalService.update(id, updates),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(variables.id) });
    },
  });
};

// Delete proposal mutation
export const useDeleteProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProposalService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};

// Send proposal mutation
export const useSendProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProposalService.send(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(id) });
    },
  });
};

// Approve proposal mutation
export const useApproveProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProposalService.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(id) });
    },
  });
};

// Reject proposal mutation
export const useRejectProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      ProposalService.reject(id, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.detail(variables.id) });
    },
  });
};

// Duplicate proposal mutation
export const useDuplicateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ProposalService.duplicate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.lists() });
    },
  });
};
