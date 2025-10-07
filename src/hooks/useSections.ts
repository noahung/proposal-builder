import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SectionService, CreateSectionData, UpdateSectionData } from '../services/sectionService';

// Query keys
export const sectionKeys = {
  all: ['sections'] as const,
  byProposal: (proposalId: string) => [...sectionKeys.all, 'proposal', proposalId] as const,
  detail: (id: string) => [...sectionKeys.all, 'detail', id] as const,
};

// Get all sections for a proposal
export const useSections = (proposalId: string) => {
  return useQuery({
    queryKey: sectionKeys.byProposal(proposalId),
    queryFn: async () => {
      const { data, error } = await SectionService.getByProposal(proposalId);
      if (error) throw new Error(error);
      return data || [];
    },
    enabled: !!proposalId,
    // Don't refetch on window focus to prevent duplicate key issues
    refetchOnWindowFocus: false,
    // Keep data in cache to prevent loading overlay from showing during mutations
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get single section
export const useSection = (id: string) => {
  return useQuery({
    queryKey: sectionKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await SectionService.getById(id);
      if (error) throw new Error(error);
      return data;
    },
    enabled: !!id,
  });
};

// Create section
export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionData: CreateSectionData) => {
      const { data, error } = await SectionService.create(sectionData);
      if (error) throw new Error(error);
      return { data, error: null };
    },
    onSuccess: (result, variables) => {
      // Invalidate all sections queries
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
      // Specifically invalidate the proposal's sections
      queryClient.invalidateQueries({ queryKey: sectionKeys.byProposal(variables.proposal_id) });
    },
  });
};

// Update section
export const useUpdateSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateSectionData }) => {
      const result = await SectionService.update(id, data);
      if (result.error) throw new Error(result.error);
      return { data: result.data, error: null };
    },
    onSuccess: (result) => {
      // Invalidate all sections queries
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
      // Invalidate the specific section
      if (result.data?.id) {
        queryClient.invalidateQueries({ queryKey: sectionKeys.detail(result.data.id) });
      }
    },
  });
};

// Delete section
export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await SectionService.delete(id);
      if (error) throw new Error(error);
      return { data, error: null };
    },
    onSuccess: () => {
      // Invalidate all sections queries
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
    },
  });
};

// Reorder sections
export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sections: { id: string; order_index: number }[]) => {
      const { data, error } = await SectionService.reorder(sections);
      if (error) throw new Error(error);
      return { data, error: null };
    },
    onSuccess: () => {
      // Invalidate all sections queries
      queryClient.invalidateQueries({ queryKey: sectionKeys.all });
    },
  });
};
