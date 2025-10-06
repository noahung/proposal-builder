import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TemplateService } from '../services/templateService';
import type { Database } from '../lib/database.types';

type Template = Database['public']['Tables']['templates']['Row'];
type TemplateInsert = Database['public']['Tables']['templates']['Insert'];
type TemplateUpdate = Database['public']['Tables']['templates']['Update'];

// Query keys
const templateKeys = {
  all: ['templates'] as const,
  lists: () => [...templateKeys.all, 'list'] as const,
  list: (filters: string) => [...templateKeys.lists(), { filters }] as const,
  details: () => [...templateKeys.all, 'detail'] as const,
  detail: (id: string) => [...templateKeys.details(), id] as const,
};

// Get all templates
export function useTemplates() {
  return useQuery({
    queryKey: templateKeys.lists(),
    queryFn: () => TemplateService.getAll(),
  });
}

// Get single template by ID
export function useTemplate(id: string | undefined) {
  return useQuery({
    queryKey: templateKeys.detail(id || ''),
    queryFn: () => {
      if (!id) throw new Error('Template ID is required');
      return TemplateService.getById(id);
    },
    enabled: !!id,
  });
}

// Create template
export function useCreateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TemplateInsert) => TemplateService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}

// Update template
export function useUpdateTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: TemplateUpdate }) =>
      TemplateService.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
      queryClient.invalidateQueries({ queryKey: templateKeys.detail(variables.id) });
    },
  });
}

// Delete template
export function useDeleteTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => TemplateService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: templateKeys.lists() });
    },
  });
}
