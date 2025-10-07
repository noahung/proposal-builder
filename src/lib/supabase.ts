import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  console.error('Please create a .env.local file with:');
  console.error('  VITE_SUPABASE_URL=your-project-url');
  console.error('  VITE_SUPABASE_ANON_KEY=your-anon-key');
  console.error('\nSee .env.local.example for template');
  
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file.'
  );
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  },
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (!error) return 'An unknown error occurred';
  
  if (error.message) return error.message;
  if (error.error_description) return error.error_description;
  if (typeof error === 'string') return error;
  
  return 'An unexpected error occurred';
};

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
