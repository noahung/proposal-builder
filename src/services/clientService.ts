import { supabase, handleSupabaseError } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Client = Database['public']['Tables']['clients']['Row'];
type ClientInsert = Database['public']['Tables']['clients']['Insert'];
type ClientUpdate = Database['public']['Tables']['clients']['Update'];

export interface CreateClientData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateClientData {
  name?: string;
  email?: string;
  company?: string;
  phone?: string;
  notes?: string;
  tags?: string[];
}

export class ClientService {
  // Get all clients for the current user's agency
  static async getAll(): Promise<{ data: Client[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get a single client by ID
  static async getById(id: string): Promise<{ data: Client | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Create a new client
  static async create(clientData: CreateClientData): Promise<{ data: Client | null; error: string | null }> {
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

      const insertData: ClientInsert = {
        agency_id: profile.agency_id,
        name: clientData.name,
        email: clientData.email,
        company: clientData.company || null,
        phone: clientData.phone || null,
        notes: clientData.notes || null,
        tags: clientData.tags || [],
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Update a client
  static async update(id: string, updates: UpdateClientData): Promise<{ data: Client | null; error: string | null }> {
    try {
      const updateData: ClientUpdate = {
        ...updates,
      };

      const { data, error } = await supabase
        .from('clients')
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

  // Delete a client
  static async delete(id: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { error: null };
    } catch (error: any) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Search clients
  static async search(query: string): Promise<{ data: Client[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .or(`name.ilike.%${query}%,email.ilike.%${query}%,company.ilike.%${query}%`)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Get clients with proposal count
  static async getWithProposalCount(): Promise<{ data: any[] | null; error: string | null }> {
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          proposals:proposals(count)
        `)
        .order('name', { ascending: true });

      if (error) throw error;

      return { data, error: null };
    } catch (error: any) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
}
