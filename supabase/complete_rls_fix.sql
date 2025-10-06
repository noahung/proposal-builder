-- =====================================================
-- COMPLETE FIX - Both Issues Combined
-- =====================================================
-- This fixes:
-- 1. Missing INSERT policies (500 error on signup)
-- 2. Infinite recursion in SELECT policy (500 error on signin)

-- Clean up: Drop all existing policies for profiles and agencies
DROP POLICY IF EXISTS "Users can view profiles in their agency" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view agency profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Service role can insert agencies" ON agencies;
DROP POLICY IF EXISTS "Agency owners/admins can update their agency" ON agencies;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- SELECT: Users can view their own profile (prevents infinite recursion)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- SELECT: Users can view other profiles in their agency
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

-- INSERT: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- INSERT: Service role can insert profiles (for signup trigger)
CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: Users can update their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- =====================================================
-- AGENCIES TABLE POLICIES
-- =====================================================

-- SELECT: Users can view their own agency
CREATE POLICY "Users can view their own agency"
  ON agencies FOR SELECT
  TO authenticated
  USING (
    id IN (
      SELECT agency_id FROM profiles 
      WHERE id = auth.uid()
      LIMIT 1
    )
  );

-- INSERT: Service role can insert agencies (for signup trigger)
CREATE POLICY "Service role can insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: Agency owners/admins can update their agency
CREATE POLICY "Agency owners/admins can update their agency"
  ON agencies FOR UPDATE
  TO authenticated
  USING (
    id IN (
      SELECT agency_id FROM profiles 
      WHERE id = auth.uid() AND role IN ('owner', 'admin')
      LIMIT 1
    )
  );

-- =====================================================
-- VERIFY POLICIES
-- =====================================================

SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
ORDER BY tablename, cmd, policyname;

-- Expected output:
-- profiles: 5 policies (2 SELECT, 2 INSERT, 1 UPDATE)
-- agencies: 3 policies (1 SELECT, 1 INSERT, 1 UPDATE)
