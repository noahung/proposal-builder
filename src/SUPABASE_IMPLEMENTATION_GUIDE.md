# Supabase Implementation Guide
## ProposalCraft - Proposal Management Platform

### 📋 **Table of Contents**
1. [Project Overview](#project-overview)
2. [Supabase Setup](#supabase-setup)
3. [Database Schema](#database-schema)
4. [Authentication Implementation](#authentication-implementation)
5. [API Integration Points](#api-integration-points)
6. [File Storage](#file-storage)
7. [Real-time Features](#real-time-features)
8. [Security & RLS Policies](#security--rls-policies)
9. [State Management](#state-management)
10. [Implementation Checklist](#implementation-checklist)
11. [Testing Strategy](#testing-strategy)
12. [Deployment Guide](#deployment-guide)

---

## **Project Overview**

### **Current State**
- ✅ Complete UI/UX implementation with React + Tailwind CSS v4
- ✅ Neumorphic + Material Design theme system
- ✅ Full component library with shadcn/ui
- ✅ Mock data and navigation flows
- 🔄 **NEXT:** Supabase backend integration

### **Architecture Goals**
- **Authentication:** Secure user management with role-based access
- **Multi-tenancy:** Agency-based data isolation
- **Real-time:** Live proposal updates and notifications
- **File Storage:** Secure document and asset management
- **Scalability:** Designed for thousands of agencies and proposals

---

## **Supabase Setup**

### **1. Create Supabase Project**
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize project (run in your project root)
supabase init

# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

### **2. Environment Configuration**
Create `.env.local`:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### **3. Install Dependencies**
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-react
npm install --save-dev @types/node
```

### **4. Supabase Client Setup**
Create `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

---

## **Database Schema**

### **Core Tables Structure**

#### **1. Profiles Table**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  agency_id UUID REFERENCES agencies(id),
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **2. Agencies Table**
```sql
CREATE TABLE agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  website TEXT,
  address JSONB,
  settings JSONB DEFAULT '{}',
  subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'pro', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. Clients Table**
```sql
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company_name TEXT,
  address JSONB,
  notes TEXT,
  tags TEXT[],
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **4. Proposals Table**
```sql
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  client_id UUID REFERENCES clients(id) NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'approved', 'rejected', 'expired')),
  content JSONB NOT NULL DEFAULT '{}',
  settings JSONB DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  total_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'GBP',
  valid_until TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  responded_at TIMESTAMPTZ,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, slug)
);
```

#### **5. Proposal Sections Table**
```sql
CREATE TABLE proposal_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  order_index INTEGER NOT NULL,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **6. Templates Table**
```sql
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  preview_image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **7. Proposal Activities Table**
```sql
CREATE TABLE proposal_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **8. File Attachments Table**
```sql
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) NOT NULL,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  mime_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### **Database Functions & Triggers**

#### **1. Updated At Trigger**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Repeat for other tables...
```

#### **2. Generate Slug Function**
```sql
CREATE OR REPLACE FUNCTION generate_proposal_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := LOWER(REPLACE(REPLACE(NEW.title, ' ', '-'), '''', '')) || '-' || EXTRACT(EPOCH FROM NOW())::TEXT;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER generate_proposal_slug_trigger BEFORE INSERT ON proposals
  FOR EACH ROW EXECUTE FUNCTION generate_proposal_slug();
```

---

## **Authentication Implementation**

### **1. Auth Context Setup**
Create `/contexts/AuthContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: Profile | null
  agency: Agency | null
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (email: string, password: string, fullName: string, companyName: string) => Promise<AuthResponse>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<AuthResponse>
  loading: boolean
}

interface Profile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  agency_id: string
  role: 'owner' | 'admin' | 'member'
}

interface Agency {
  id: string
  name: string
  slug: string
  logo_url?: string
  subscription_plan: string
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [agency, setAgency] = useState<Agency | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        loadUserProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        } else {
          setProfile(null)
          setAgency(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          agencies (*)
        `)
        .eq('id', userId)
        .single()

      if (error) throw error
      
      setProfile(profile)
      setAgency(profile.agencies)
    } catch (error) {
      console.error('Error loading profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  const signUp = async (email: string, password: string, fullName: string, companyName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          company_name: companyName
        }
      }
    })
    return { data, error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  }

  const value = {
    user,
    session,
    profile,
    agency,
    signIn,
    signUp,
    signOut,
    resetPassword,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

### **2. Database Triggers for User Creation**
```sql
-- Create agency and profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  agency_id UUID;
BEGIN
  -- Create agency first
  INSERT INTO agencies (name, slug)
  VALUES (
    NEW.raw_user_meta_data->>'company_name',
    LOWER(REPLACE(NEW.raw_user_meta_data->>'company_name', ' ', '-')) || '-' || EXTRACT(EPOCH FROM NOW())::TEXT
  )
  RETURNING id INTO agency_id;

  -- Create profile
  INSERT INTO profiles (id, email, full_name, agency_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    agency_id,
    'owner'
  );

  RETURN NEW;
END;
$$ language plpgsql security definer;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## **API Integration Points**

### **1. Proposals API Service**
Create `/services/proposalService.ts`:
```typescript
import { supabase } from '../lib/supabase'

export interface CreateProposalData {
  clientId: string
  title: string
  content: any
  totalAmount?: number
  validUntil?: string
}

export interface UpdateProposalData {
  title?: string
  content?: any
  status?: string
  totalAmount?: number
  validUntil?: string
}

export class ProposalService {
  static async create(data: CreateProposalData) {
    const { data: proposal, error } = await supabase
      .from('proposals')
      .insert({
        client_id: data.clientId,
        title: data.title,
        content: data.content,
        total_amount: data.totalAmount,
        valid_until: data.validUntil
      })
      .select(`
        *,
        clients (*),
        profiles (*)
      `)
      .single()

    if (error) throw error
    return proposal
  }

  static async getAll(agencyId: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (*),
        profiles (full_name),
        proposal_activities (
          action,
          created_at
        )
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (*),
        profiles (full_name),
        proposal_sections (*),
        attachments (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async getBySlug(agencySlug: string, proposalSlug: string) {
    const { data, error } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (*),
        agencies (*),
        profiles (full_name, email, phone)
      `)
      .eq('agencies.slug', agencySlug)
      .eq('slug', proposalSlug)
      .single()

    if (error) throw error
    return data
  }

  static async update(id: string, updates: UpdateProposalData) {
    const { data, error } = await supabase
      .from('proposals')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async updateStatus(id: string, status: string) {
    const updates: any = { status }
    
    if (status === 'sent') updates.sent_at = new Date().toISOString()
    if (status === 'viewed') updates.viewed_at = new Date().toISOString()
    if (status === 'approved' || status === 'rejected') {
      updates.responded_at = new Date().toISOString()
    }

    return this.update(id, updates)
  }

  static async trackActivity(proposalId: string, action: string, details?: any) {
    const { error } = await supabase
      .from('proposal_activities')
      .insert({
        proposal_id: proposalId,
        action,
        details: details || {}
      })

    if (error) throw error
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('proposals')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
```

### **2. Client Management Service**
Create `/services/clientService.ts`:
```typescript
import { supabase } from '../lib/supabase'

export interface CreateClientData {
  name: string
  email: string
  phone?: string
  companyName?: string
  address?: any
  notes?: string
  tags?: string[]
}

export class ClientService {
  static async create(data: CreateClientData) {
    const { data: client, error } = await supabase
      .from('clients')
      .insert({
        name: data.name,
        email: data.email,
        phone: data.phone,
        company_name: data.companyName,
        address: data.address,
        notes: data.notes,
        tags: data.tags
      })
      .select()
      .single()

    if (error) throw error
    return client
  }

  static async getAll(agencyId: string) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        proposals (
          id,
          title,
          status,
          total_amount,
          created_at
        )
      `)
      .eq('agency_id', agencyId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('clients')
      .select(`
        *,
        proposals (*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async update(id: string, updates: Partial<CreateClientData>) {
    const { data, error } = await supabase
      .from('clients')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  static async delete(id: string) {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id)

    if (error) throw error
  }
}
```

### **3. Template Service**
Create `/services/templateService.ts`:
```typescript
import { supabase } from '../lib/supabase'

export interface CreateTemplateData {
  name: string
  description?: string
  category: string
  content: any
  previewImageUrl?: string
  isPublic?: boolean
}

export class TemplateService {
  static async create(data: CreateTemplateData) {
    const { data: template, error } = await supabase
      .from('templates')
      .insert({
        name: data.name,
        description: data.description,
        category: data.category,
        content: data.content,
        preview_image_url: data.previewImageUrl,
        is_public: data.isPublic
      })
      .select()
      .single()

    if (error) throw error
    return template
  }

  static async getAll(agencyId: string, includePublic = true) {
    let query = supabase
      .from('templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (includePublic) {
      query = query.or(`agency_id.eq.${agencyId},is_public.eq.true`)
    } else {
      query = query.eq('agency_id', agencyId)
    }

    const { data, error } = await query
    if (error) throw error
    return data
  }

  static async getById(id: string) {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return data
  }

  static async incrementUsage(id: string) {
    const { error } = await supabase.rpc('increment_template_usage', {
      template_id: id
    })

    if (error) throw error
  }
}
```

---

## **File Storage**

### **1. Storage Bucket Setup**
```sql
-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('proposals', 'proposals', false),
  ('templates', 'templates', false),
  ('avatars', 'avatars', true),
  ('logos', 'logos', true);
```

### **2. Storage Policies**
```sql
-- Proposal attachments - agency members only
CREATE POLICY "Agency members can upload proposal attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'proposals' AND
  auth.uid() IN (
    SELECT id FROM profiles 
    WHERE agency_id = (
      SELECT agency_id FROM profiles 
      WHERE id = auth.uid()
    )
  )
);

-- Avatar uploads - users can upload their own
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### **3. File Upload Service**
Create `/services/fileService.ts`:
```typescript
import { supabase } from '../lib/supabase'

export class FileService {
  static async uploadProposalAttachment(
    proposalId: string, 
    file: File
  ): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${proposalId}/${Date.now()}.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('proposals')
      .upload(fileName, file)

    if (error) throw error

    // Save attachment record
    await supabase.from('attachments').insert({
      proposal_id: proposalId,
      filename: file.name,
      file_size: file.size,
      mime_type: file.type,
      storage_path: data.path
    })

    return data.path
  }

  static async uploadAvatar(userId: string, file: File): Promise<string> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { upsert: true })

    if (error) throw error

    const { data: publicUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return publicUrl.publicUrl
  }

  static async getProposalAttachments(proposalId: string) {
    const { data, error } = await supabase
      .from('attachments')
      .select('*')
      .eq('proposal_id', proposalId)

    if (error) throw error
    return data
  }

  static async deleteFile(bucket: string, path: string) {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }
}
```

---

## **Real-time Features**

### **1. Real-time Subscriptions**
Create `/hooks/useRealtimeProposals.ts`:
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useRealtimeProposals = () => {
  const { agency } = useAuth()
  const [proposals, setProposals] = useState([])

  useEffect(() => {
    if (!agency?.id) return

    // Initial load
    loadProposals()

    // Subscribe to changes
    const subscription = supabase
      .channel('proposals_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'proposals',
          filter: `agency_id=eq.${agency.id}`
        },
        (payload) => {
          console.log('Proposal changed:', payload)
          loadProposals() // Reload proposals
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [agency?.id])

  const loadProposals = async () => {
    if (!agency?.id) return

    const { data } = await supabase
      .from('proposals')
      .select(`
        *,
        clients (*),
        profiles (full_name)
      `)
      .eq('agency_id', agency.id)
      .order('created_at', { ascending: false })

    if (data) setProposals(data)
  }

  return proposals
}
```

### **2. Proposal Activity Tracking**
Create `/hooks/useProposalActivity.ts`:
```typescript
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export const useProposalActivity = (proposalId: string) => {
  const [activities, setActivities] = useState([])

  useEffect(() => {
    if (!proposalId) return

    // Load activities
    loadActivities()

    // Subscribe to new activities
    const subscription = supabase
      .channel(`activities_${proposalId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'proposal_activities',
          filter: `proposal_id=eq.${proposalId}`
        },
        (payload) => {
          setActivities(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [proposalId])

  const loadActivities = async () => {
    const { data } = await supabase
      .from('proposal_activities')
      .select(`
        *,
        profiles (full_name, avatar_url)
      `)
      .eq('proposal_id', proposalId)
      .order('created_at', { ascending: false })

    if (data) setActivities(data)
  }

  return activities
}
```

---

## **Security & RLS Policies**

### **1. Enable RLS on All Tables**
```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;
```

### **2. Agency-based Access Policies**
```sql
-- Profiles: Users can only see profiles in their agency
CREATE POLICY "Users can view profiles in their agency"
ON profiles FOR SELECT
TO authenticated
USING (
  agency_id = (
    SELECT agency_id FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Clients: Agency members can manage their agency's clients
CREATE POLICY "Agency members can manage clients"
ON clients FOR ALL
TO authenticated
USING (
  agency_id = (
    SELECT agency_id FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Proposals: Agency members can manage their agency's proposals
CREATE POLICY "Agency members can manage proposals"
ON proposals FOR ALL
TO authenticated
USING (
  agency_id = (
    SELECT agency_id FROM profiles 
    WHERE id = auth.uid()
  )
);

-- Public proposal viewing (for clients)
CREATE POLICY "Public can view sent proposals"
ON proposals FOR SELECT
TO anon
USING (status IN ('sent', 'viewed', 'approved', 'rejected'));
```

### **3. Role-based Permissions**
```sql
-- Admin/Owner only policies
CREATE POLICY "Only admins can manage team members"
ON profiles FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND agency_id = profiles.agency_id 
    AND role IN ('owner', 'admin')
  )
);
```

---

## **State Management**

### **1. React Query Setup**
```bash
npm install @tanstack/react-query
```

Create `/lib/queryClient.ts`:
```typescript
import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
      refetchOnWindowFocus: false,
    },
  },
})
```

### **2. Custom Hooks**
Create `/hooks/useProposals.ts`:
```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ProposalService } from '../services/proposalService'
import { useAuth } from '../contexts/AuthContext'

export const useProposals = () => {
  const { agency } = useAuth()
  
  return useQuery({
    queryKey: ['proposals', agency?.id],
    queryFn: () => ProposalService.getAll(agency!.id),
    enabled: !!agency?.id
  })
}

export const useCreateProposal = () => {
  const queryClient = useQueryClient()
  const { agency } = useAuth()
  
  return useMutation({
    mutationFn: ProposalService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['proposals', agency?.id])
    }
  })
}

export const useUpdateProposal = () => {
  const queryClient = useQueryClient()
  const { agency } = useAuth()
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: any }) =>
      ProposalService.update(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries(['proposals', agency?.id])
    }
  })
}
```

---

## **Implementation Checklist**

### **Phase 1: Authentication & Core Setup** ⚡
- [ ] Set up Supabase project and environment variables
- [ ] Create database schema with all tables
- [ ] Implement authentication context and hooks
- [ ] Set up RLS policies for security
- [ ] Create user registration trigger functions
- [ ] Test authentication flow (signup, signin, logout)

### **Phase 2: Core CRUD Operations** 📝
- [ ] Implement ProposalService with all CRUD operations
- [ ] Implement ClientService with all CRUD operations
- [ ] Implement TemplateService with all CRUD operations
- [ ] Set up React Query for state management
- [ ] Create custom hooks for data fetching
- [ ] Test all CRUD operations

### **Phase 3: File Storage** 📁
- [ ] Configure Supabase storage buckets
- [ ] Set up storage policies
- [ ] Implement FileService for uploads/downloads
- [ ] Add attachment functionality to proposals
- [ ] Implement avatar upload functionality
- [ ] Test file upload/download flows

### **Phase 4: Real-time Features** ⚡
- [ ] Set up real-time subscriptions for proposals
- [ ] Implement activity tracking system
- [ ] Add real-time notifications
- [ ] Test real-time updates across multiple users
- [ ] Implement proposal status change notifications

### **Phase 5: Client Portal** 👥
- [ ] Create public proposal viewing routes
- [ ] Implement proposal sharing via unique URLs
- [ ] Add client interaction tracking
- [ ] Implement proposal approval/rejection
- [ ] Add digital signature functionality
- [ ] Test complete client journey

### **Phase 6: Advanced Features** 🚀
- [ ] Add analytics and reporting
- [ ] Implement team management
- [ ] Add webhook integrations
- [ ] Set up email notifications
- [ ] Implement proposal templates system
- [ ] Add bulk operations

### **Phase 7: Performance & Security** 🔒
- [ ] Optimize database queries with indexes
- [ ] Implement rate limiting
- [ ] Add comprehensive error handling
- [ ] Set up monitoring and logging
- [ ] Perform security audit
- [ ] Load testing

---

## **Testing Strategy**

### **1. Unit Tests**
```typescript
// Example test for ProposalService
import { ProposalService } from '../services/proposalService'

describe('ProposalService', () => {
  test('creates proposal successfully', async () => {
    const proposalData = {
      clientId: 'test-client-id',
      title: 'Test Proposal',
      content: { sections: [] }
    }
    
    const proposal = await ProposalService.create(proposalData)
    expect(proposal.title).toBe('Test Proposal')
    expect(proposal.status).toBe('draft')
  })
})
```

### **2. Integration Tests**
- Test complete user flows (signup → create proposal → send → approve)
- Test RLS policies with different user roles
- Test real-time functionality
- Test file upload/download

### **3. E2E Tests**
```typescript
// Example Playwright test
test('complete proposal workflow', async ({ page }) => {
  // Sign up new user
  await page.goto('/signup')
  await page.fill('[data-testid="email"]', 'test@example.com')
  await page.fill('[data-testid="password"]', 'password123')
  await page.click('[data-testid="signup-button"]')
  
  // Create proposal
  await page.goto('/proposals/new')
  await page.fill('[data-testid="proposal-title"]', 'Test Proposal')
  await page.click('[data-testid="save-proposal"]')
  
  // Verify proposal created
  await expect(page.locator('[data-testid="proposal-title"]')).toContainText('Test Proposal')
})
```

---

## **Deployment Guide**

### **1. Environment Setup**
Production `.env`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### **2. Database Migration**
```bash
# Run migrations
supabase db push

# Verify deployment
supabase db diff
```

### **3. Vercel Deployment**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
```

### **4. Custom Domain Setup**
- Configure custom domain in Supabase dashboard
- Update CORS settings
- Set up SSL certificates
- Configure email templates

### **5. Production Checklist**
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] RLS policies enabled
- [ ] Storage buckets configured
- [ ] Email templates set up
- [ ] Custom domain configured
- [ ] SSL certificates active
- [ ] Error monitoring configured
- [ ] Backup strategy implemented

---

## **Additional Resources**

### **Documentation**
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Next.js Documentation](https://nextjs.org/docs)

### **Useful Commands**
```bash
# Generate TypeScript types
supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/database.types.ts

# Reset database (development only)
supabase db reset

# View logs
supabase functions logs

# Run local development
supabase start
npm run dev
```

### **Performance Tips**
- Use `select()` to limit returned columns
- Implement pagination for large datasets
- Use database functions for complex operations
- Cache frequently accessed data with React Query
- Optimize images and assets for storage

---

## **Support & Troubleshooting**

### **Common Issues**
1. **RLS Policy Errors**: Ensure user has proper agency association
2. **Storage Upload Failures**: Check bucket policies and file size limits
3. **Real-time Not Working**: Verify channel subscriptions and filters
4. **Type Errors**: Regenerate types after schema changes

### **Debug Mode**
```typescript
// Enable detailed logging
const supabase = createClient(url, key, {
  auth: {
    debug: process.env.NODE_ENV === 'development'
  }
})
```

### **Contact**
- Supabase Support: [support@supabase.com](mailto:support@supabase.com)
- Community: [Discord](https://discord.supabase.com)
- Documentation: [supabase.com/docs](https://supabase.com/docs)

---

**🎯 This guide provides a complete roadmap for implementing Supabase backend integration. Follow the phases sequentially and test thoroughly at each step. The result will be a robust, scalable proposal management platform!**