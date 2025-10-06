import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Proposal = Database['public']['Tables']['proposals']['Row'];
type ProposalInsert = Database['public']['Tables']['proposals']['Insert'];
type ProposalUpdate = Database['public']['Tables']['proposals']['Update'];
type ProposalSection = Database['public']['Tables']['proposal_sections']['Row'];

export interface CreateProposalData {
  clientId: string;
  title: string;
  status?: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected';
  validUntil?: string;
  passwordProtected?: boolean;
  password?: string;
}

export interface UpdateProposalData {
  title?: string;
  status?: 'draft' | 'sent' | 'viewed' | 'approved' | 'rejected';
  validUntil?: string;
  rejectionReason?: string;
}

export interface ProposalWithSections extends Proposal {
  sections?: ProposalSection[];
  client?: {
    id: string;
    name: string;
    email: string;
    company: string | null;
  };
}

export class ProposalService {
  // Get all proposals for the current user's agency
  static async getAll(): Promise<{ data: ProposalWithSections[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          client:clients(id, name, email, company),
          sections:proposal_sections(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get a single proposal by ID
  static async getById(id: string): Promise<{ data: ProposalWithSections | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          client:clients(id, name, email, company),
          sections:proposal_sections(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get proposal by slug (for public viewing)
  static async getBySlug(agencyId: string, slug: string): Promise<{ data: ProposalWithSections | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .select(`
          *,
          client:clients(id, name, email, company),
          sections:proposal_sections(*),
          agency:agencies(name, logo_url, brand_color, contact_name, contact_email, contact_phone, contact_photo)
        `)
        .eq('agency_id', agencyId)
        .eq('slug', slug)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Create a new proposal
  static async create(data: CreateProposalData): Promise<{ data: Proposal | null; error: string | null }> {
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

      // Prepare proposal data
      const proposalData: ProposalInsert = {
        agency_id: profile.agency_id,
        client_id: data.clientId,
        title: data.title,
        status: data.status || 'draft',
        valid_until: data.validUntil || null,
        password_protected: data.passwordProtected || false,
        password_hash: data.password ? await this.hashPassword(data.password) : null,
      };

      const { data: proposal, error } = await supabase
        .from('proposals')
        .insert(proposalData)
        .select()
        .single();

      if (error) throw error;

      // Create initial section
      if (proposal) {
        await supabase
          .from('proposal_sections')
          .insert({
            proposal_id: proposal.id,
            title: 'Cover Page',
            order_index: 0,
            elements: [],
          });
      }

      return { data: proposal, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Update a proposal
  static async update(id: string, updates: UpdateProposalData): Promise<{ data: Proposal | null; error: string | null }> {
    try {
      const updateData: ProposalUpdate = {
        ...updates,
        rejection_reason: updates.rejectionReason,
      };

      const { data, error } = await supabase
        .from('proposals')
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

  // Delete a proposal
  static async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('proposals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Send proposal (update status and set sent_at)
  static async send(id: string): Promise<{ data: Proposal | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('proposals')
        .update({
          status: 'sent',
          sent_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Mark proposal as viewed
  static async markAsViewed(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'viewed',
          viewed_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Approve proposal
  static async approve(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase
        .from('proposal_activities')
        .insert({
          proposal_id: id,
          activity_type: 'approved',
        });

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Reject proposal
  static async reject(id: string, reason: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('proposals')
        .update({
          status: 'rejected',
          rejected_at: new Date().toISOString(),
          rejection_reason: reason,
        })
        .eq('id', id);

      if (error) throw error;

      // Log activity
      await supabase
        .from('proposal_activities')
        .insert({
          proposal_id: id,
          activity_type: 'rejected',
          metadata: { reason },
        });

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Duplicate proposal
  static async duplicate(id: string): Promise<{ data: Proposal | null; error: string | null }> {
    try {
      // Get original proposal
      const { data: original, error: fetchError } = await this.getById(id);
      if (fetchError || !original) throw new Error('Proposal not found');

      // Create new proposal
      const { data: newProposal, error: createError } = await supabase
        .from('proposals')
        .insert({
          agency_id: original.agency_id,
          client_id: original.client_id,
          title: `${original.title} (Copy)`,
          status: 'draft',
        })
        .select()
        .single();

      if (createError) throw createError;

      // Duplicate sections
      if (newProposal && original.sections) {
        const sectionsToInsert = original.sections.map(section => ({
          proposal_id: newProposal.id,
          title: section.title,
          order_index: section.order_index,
          elements: section.elements,
        }));

        await supabase
          .from('proposal_sections')
          .insert(sectionsToInsert);
      }

      return { data: newProposal, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Helper function to hash password (simple implementation)
  private static async hashPassword(password: string): Promise<string> {
    // In production, use proper password hashing like bcrypt
    // For now, we'll store a simple hash
    return btoa(password); // Base64 encoding (NOT secure for production!)
  }

  // Helper function to verify password
  static async verifyPassword(proposalId: string, password: string): Promise<boolean> {
    try {
      const { data } = await supabase
        .from('proposals')
        .select('password_hash')
        .eq('id', proposalId)
        .single();

      if (!data?.password_hash) return true; // No password set

      return data.password_hash === btoa(password);
    } catch {
      return false;
    }
  }
}
