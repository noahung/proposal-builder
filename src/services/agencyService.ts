import { supabase } from '../lib/supabase';

export const AgencyService = {
  // Get agency by ID
  async getById(id: string) {
    const response = await supabase
      .from('agencies')
      .select('*')
      .eq('id', id)
      .single();
    
    return response;
  },

  // Update agency
  async update(id: string, updates: {
    name?: string;
    logo_url?: string | null;
    contact_name?: string | null;
    contact_email?: string | null;
    contact_phone?: string | null;
  }) {
    try {
      const { data: result, error } = await supabase
        .from('agencies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      return { data: result, error };
    } catch (error: any) {
      return { data: null, error };
    }
  },
};
