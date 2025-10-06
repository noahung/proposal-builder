import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Section = Database['public']['Tables']['proposal_sections']['Row'];
type SectionInsert = Database['public']['Tables']['proposal_sections']['Insert'];
type SectionUpdate = Database['public']['Tables']['proposal_sections']['Update'];

export interface CreateSectionData {
  proposal_id: string;
  title: string;
  order_index: number;
  elements?: any[];
}

export interface UpdateSectionData {
  title?: string;
  order_index?: number;
  elements?: any[];
}

export class SectionService {
  // Get all sections for a proposal
  static async getByProposal(proposalId: string): Promise<{ data: Section[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposal_sections')
        .select('*')
        .eq('proposal_id', proposalId)
        .order('order_index', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get a single section by ID
  static async getById(id: string): Promise<{ data: Section | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposal_sections')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Create a new section
  static async create(sectionData: CreateSectionData): Promise<{ data: Section | null; error: string | null }> {
    try {
      const insertData: SectionInsert = {
        proposal_id: sectionData.proposal_id,
        title: sectionData.title,
        order_index: sectionData.order_index,
        elements: sectionData.elements || [],
      };

      const { data, error } = await supabase
        .from('proposal_sections')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Update a section
  static async update(id: string, sectionData: UpdateSectionData): Promise<{ data: Section | null; error: string | null }> {
    try {
      const updateData: SectionUpdate = {
        ...sectionData,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('proposal_sections')
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

  // Delete a section
  static async delete(id: string): Promise<{ data: boolean; error: string | null }> {
    try {
      const { error } = await supabase
        .from('proposal_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { data: true, error: null };
    } catch (error: any) {
      return { data: false, error: handleSupabaseError(error) };
    }
  }

  // Update section order (reorder sections)
  static async reorder(sections: { id: string; order_index: number }[]): Promise<{ data: boolean; error: string | null }> {
    try {
      // Update each section's order in parallel
      const updates = sections.map(({ id, order_index }) =>
        supabase
          .from('proposal_sections')
          .update({ order_index, updated_at: new Date().toISOString() })
          .eq('id', id)
      );

      const results = await Promise.all(updates);
      
      // Check if any update failed
      const failedUpdate = results.find(result => result.error);
      if (failedUpdate?.error) throw failedUpdate.error;

      return { data: true, error: null };
    } catch (error: any) {
      return { data: false, error: handleSupabaseError(error) };
    }
  }
}
