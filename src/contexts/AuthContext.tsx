import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

// Type definitions
type Profile = Database['public']['Tables']['profiles']['Row'];
type Agency = Database['public']['Tables']['agencies']['Row'];

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  agency: Agency | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string, companyName: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [agency, setAgency] = useState<Agency | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile and agency data
  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile
      const profileResponse = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileResponse.error) {
        console.error('Error fetching profile:', profileResponse.error);
        // If profile doesn't exist, sign out to prevent infinite loop
        if (profileResponse.error.code === 'PGRST116') {
          console.warn('Profile not found, signing out...');
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setAgency(null);
          setSession(null);
        }
        return;
      }
      
      const profileData = profileResponse.data;
      
      if (!profileData) {
        console.warn('No profile data returned');
        return;
      }
      
      setProfile(profileData);

      // Fetch agency if profile has agency_id
      if (profileData.agency_id) {
        const agencyResponse = await supabase
          .from('agencies')
          .select('*')
          .eq('id', profileData.agency_id)
          .single();

        if (agencyResponse.error) {
          console.error('Error fetching agency:', agencyResponse.error);
          // Continue even if agency fetch fails
          setAgency(null);
          return;
        }
        
        if (agencyResponse.data) {
          setAgency(agencyResponse.data);
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      // Reset state on critical error to prevent infinite loading
      setProfile(null);
      setAgency(null);
    }
  };

  // Initialize auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserData(session.user.id);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      } else {
        setProfile(null);
        setAgency(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign up
  const signUp = async (email: string, password: string, fullName: string, companyName: string) => {
    try {
      console.log('Starting signup process...', { email, fullName, companyName });
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        return { error };
      }

      console.log('Signup successful:', data);
      // The trigger function will automatically create profile and agency
      return { error: null };
    } catch (error: any) {
      console.error('Signup exception:', error);
      return { error };
    }
  };

  // Sign in
  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setAgency(null);
    setSession(null);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!user) throw new Error('No user logged in');

      // TypeScript workaround for Supabase type inference issue
      const { error } = await supabase
        .from('profiles')
        .update(updates as any)
        .eq('id', user.id);

      if (error) throw error;

      // Refresh profile data
      await fetchUserData(user.id);

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    agency,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
