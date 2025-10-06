-- =====================================================
-- Smart Proposal Builder - Initial Database Schema
-- =====================================================
-- This migration creates all core tables, triggers, and functions
-- Run this in your Supabase SQL Editor

-- =====================================================
-- 1. ENABLE EXTENSIONS
-- =====================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- 2. CREATE ENUMS
-- =====================================================
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'member');
CREATE TYPE proposal_status AS ENUM ('draft', 'sent', 'viewed', 'approved', 'rejected');
CREATE TYPE activity_type AS ENUM ('viewed', 'page_view', 'download', 'approved', 'rejected');

-- =====================================================
-- 3. CREATE TABLES
-- =====================================================

-- Agencies Table
CREATE TABLE agencies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#f47421',
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  contact_photo TEXT,
  subscription_plan TEXT DEFAULT 'free',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE SET NULL,
  role user_role DEFAULT 'member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients Table
CREATE TABLE clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  phone TEXT,
  notes TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposals Table
CREATE TABLE proposals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  status proposal_status DEFAULT 'draft',
  sent_at TIMESTAMPTZ,
  viewed_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  rejected_at TIMESTAMPTZ,
  rejection_reason TEXT,
  valid_until TIMESTAMPTZ,
  password_protected BOOLEAN DEFAULT FALSE,
  password_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(agency_id, slug)
);

-- Proposal Sections Table
CREATE TABLE proposal_sections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  elements JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(proposal_id, order_index)
);

-- Templates Table
CREATE TABLE templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  content JSONB DEFAULT '{}'::jsonb,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Proposal Activities Table (Analytics/Tracking)
CREATE TABLE proposal_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  activity_type activity_type NOT NULL,
  page_index INTEGER,
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attachments Table
CREATE TABLE attachments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================
CREATE INDEX idx_profiles_agency ON profiles(agency_id);
CREATE INDEX idx_profiles_email ON profiles(email);

CREATE INDEX idx_clients_agency ON clients(agency_id);
CREATE INDEX idx_clients_email ON clients(email);

CREATE INDEX idx_proposals_agency ON proposals(agency_id);
CREATE INDEX idx_proposals_client ON proposals(client_id);
CREATE INDEX idx_proposals_slug ON proposals(slug);
CREATE INDEX idx_proposals_status ON proposals(status);

CREATE INDEX idx_proposal_sections_proposal ON proposal_sections(proposal_id);
CREATE INDEX idx_proposal_sections_order ON proposal_sections(proposal_id, order_index);

CREATE INDEX idx_templates_agency ON templates(agency_id);
CREATE INDEX idx_templates_category ON templates(category);

CREATE INDEX idx_activities_proposal ON proposal_activities(proposal_id);
CREATE INDEX idx_activities_created ON proposal_activities(created_at);

CREATE INDEX idx_attachments_proposal ON attachments(proposal_id);

-- =====================================================
-- 5. CREATE FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to generate proposal slug
CREATE OR REPLACE FUNCTION generate_proposal_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  counter INTEGER := 0;
  new_slug TEXT;
BEGIN
  -- If slug is already set, don't change it
  IF NEW.slug IS NOT NULL AND NEW.slug != '' THEN
    RETURN NEW;
  END IF;
  
  -- Generate base slug from title
  base_slug := lower(regexp_replace(NEW.title, '[^a-zA-Z0-9]+', '-', 'g'));
  base_slug := trim(both '-' from base_slug);
  new_slug := base_slug;
  
  -- Check for uniqueness and add counter if needed
  WHILE EXISTS (
    SELECT 1 FROM proposals 
    WHERE slug = new_slug 
    AND agency_id = NEW.agency_id 
    AND id != NEW.id
  ) LOOP
    counter := counter + 1;
    new_slug := base_slug || '-' || counter;
  END LOOP;
  
  NEW.slug := new_slug;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  agency_id UUID;
BEGIN
  -- Create agency first
  INSERT INTO agencies (name, contact_email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Agency'),
    NEW.email
  )
  RETURNING id INTO agency_id;
  
  -- Create profile
  INSERT INTO profiles (id, email, full_name, agency_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    agency_id,
    'owner'
  );
  
  RETURN NEW;
END;
$$ language plpgsql security definer;

-- =====================================================
-- 6. CREATE TRIGGERS
-- =====================================================

-- Trigger to update updated_at on all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposals_updated_at BEFORE UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_proposal_sections_updated_at BEFORE UPDATE ON proposal_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to generate proposal slug
CREATE TRIGGER generate_proposal_slug_trigger 
BEFORE INSERT OR UPDATE ON proposals
  FOR EACH ROW EXECUTE FUNCTION generate_proposal_slug();

-- Trigger to handle new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =====================================================
-- 7. ENABLE ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE attachments ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 8. CREATE RLS POLICIES
-- =====================================================

-- Profiles Policies
-- Allow users to view their own profile (prevents recursion)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow users to view other profiles in their agency
CREATE POLICY "Users can view agency profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    agency_id IN (
      SELECT agency_id FROM profiles 
      WHERE id = auth.uid()
      LIMIT 1
    )
  );

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Agencies Policies
CREATE POLICY "Users can view their own agency"
  ON agencies FOR SELECT
  TO authenticated
  USING (
    id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Service role can insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Agency owners/admins can update their agency"
  ON agencies FOR UPDATE
  TO authenticated
  USING (
    id = (
      SELECT agency_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
    )
  );

-- Clients Policies
CREATE POLICY "Users can view clients in their agency"
  ON clients FOR SELECT
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create clients for their agency"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update clients in their agency"
  ON clients FOR UPDATE
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can delete clients in their agency"
  ON clients FOR DELETE
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Proposals Policies
CREATE POLICY "Users can view proposals in their agency"
  ON proposals FOR SELECT
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can view sent proposals"
  ON proposals FOR SELECT
  TO anon
  USING (status IN ('sent', 'viewed', 'approved', 'rejected'));

CREATE POLICY "Users can create proposals for their agency"
  ON proposals FOR INSERT
  TO authenticated
  WITH CHECK (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can update proposals in their agency"
  ON proposals FOR UPDATE
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

CREATE POLICY "Anonymous users can update proposal status"
  ON proposals FOR UPDATE
  TO anon
  USING (status IN ('sent', 'viewed'))
  WITH CHECK (status IN ('viewed', 'approved', 'rejected'));

CREATE POLICY "Users can delete proposals in their agency"
  ON proposals FOR DELETE
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Proposal Sections Policies
CREATE POLICY "Users can view sections of their agency's proposals"
  ON proposal_sections FOR SELECT
  TO authenticated
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Anonymous users can view sections of sent proposals"
  ON proposal_sections FOR SELECT
  TO anon
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE status IN ('sent', 'viewed', 'approved', 'rejected')
    )
  );

CREATE POLICY "Users can manage sections of their agency's proposals"
  ON proposal_sections FOR ALL
  TO authenticated
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- Templates Policies
CREATE POLICY "Users can view their agency's templates"
  ON templates FOR SELECT
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    ) OR is_public = true
  );

CREATE POLICY "Users can manage their agency's templates"
  ON templates FOR ALL
  TO authenticated
  USING (
    agency_id = (
      SELECT agency_id FROM profiles WHERE id = auth.uid()
    )
  );

-- Activities Policies
CREATE POLICY "Users can view activities of their agency's proposals"
  ON proposal_activities FOR SELECT
  TO authenticated
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Anyone can insert proposal activities"
  ON proposal_activities FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Attachments Policies
CREATE POLICY "Users can view attachments of their agency's proposals"
  ON attachments FOR SELECT
  TO authenticated
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

CREATE POLICY "Anonymous users can view attachments of sent proposals"
  ON attachments FOR SELECT
  TO anon
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE status IN ('sent', 'viewed', 'approved', 'rejected')
    )
  );

CREATE POLICY "Users can manage attachments of their agency's proposals"
  ON attachments FOR ALL
  TO authenticated
  USING (
    proposal_id IN (
      SELECT id FROM proposals 
      WHERE agency_id = (
        SELECT agency_id FROM profiles WHERE id = auth.uid()
      )
    )
  );

-- =====================================================
-- 9. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on schemas
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant access to tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Verify all tables are created
-- 3. Test RLS policies
-- 4. Configure Storage buckets (separate step)
