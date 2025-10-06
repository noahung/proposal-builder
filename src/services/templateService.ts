import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Template = Database['public']['Tables']['templates']['Row'];
type TemplateInsert = Database['public']['Tables']['templates']['Insert'];
type TemplateUpdate = Database['public']['Tables']['templates']['Update'];

export interface CreateTemplateData {
  name: string;
  description?: string;
  category?: string;
  tags?: string[];
  content: any; // JSON content from proposal sections
  thumbnailUrl?: string;
  isPublic?: boolean;
}

export interface UpdateTemplateData {
  name?: string;
  description?: string;
  category?: string;
  tags?: string[];
  content?: any;
  thumbnailUrl?: string;
  isPublic?: boolean;
}

export class TemplateService {
  // Get all templates (including public ones)
  static async getAll(): Promise<{ data: Template[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get templates by category
  static async getByCategory(category: string): Promise<{ data: Template[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get a single template by ID
  static async getById(id: string): Promise<{ data: Template | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Create a new template
  static async create(templateData: CreateTemplateData): Promise<{ data: Template | null; error: string | null }> {
    try {
      // Get current user's agency
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: profile } = await supabase
        .from('profiles')
        .select('agency_id')
        .eq('id', user.id)
        .single();

      if (!profile?.agency_id) throw new Error('No agency found');

      const insertData: TemplateInsert = {
        agency_id: profile.agency_id,
        name: templateData.name,
        description: templateData.description || null,
        category: templateData.category || null,
        tags: templateData.tags || [],
        content: templateData.content,
        thumbnail_url: templateData.thumbnailUrl || null,
        is_public: templateData.isPublic || false,
      };

      const { data, error } = await supabase
        .from('templates')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Update a template
  static async update(id: string, updates: UpdateTemplateData): Promise<{ data: Template | null; error: string | null }> {
    try {
      const updateData: TemplateUpdate = {
        name: updates.name,
        description: updates.description,
        category: updates.category,
        tags: updates.tags,
        content: updates.content,
        thumbnail_url: updates.thumbnailUrl,
        is_public: updates.isPublic,
      };

      const { data, error } = await supabase
        .from('templates')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Delete a template
  static async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Create template from proposal
  static async createFromProposal(
    proposalId: string,
    name: string,
    description?: string,
    category?: string
  ): Promise<{ data: Template | null; error: string | null }> {
    try {
      // Get proposal sections
      const { data: sections, error: sectionsError } = await supabase
        .from('proposal_sections')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('order_index', { ascending: true });

      if (sectionsError) throw sectionsError;

      // Create template with sections content
      return await this.create({
        name,
        description,
        category,
        content: { sections },
      });
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Apply template to proposal
  static async applyToProposal(templateId: string, proposalId: string): Promise<{ error: string | null }> {
    try {
      // Get template
      const { data: template, error: templateError } = await this.getById(templateId);
      if (templateError || !template) throw new Error('Template not found');

      // Delete existing sections
      await supabase
        .from('proposal_sections')
        .delete()
        .eq('proposal_id', proposalId);

      // Create new sections from template
      if (template.content?.sections) {
        const sectionsToInsert = template.content.sections.map((section: any, index: number) => ({
          proposal_id: proposalId,
          title: section.title,
          order_index: index,
          elements: section.elements || [],
        }));

        const { error: insertError } = await supabase
          .from('proposal_sections')
          .insert(sectionsToInsert);

        if (insertError) throw insertError;
      }

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Search templates
  static async search(query: string): Promise<{ data: Template[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
}
