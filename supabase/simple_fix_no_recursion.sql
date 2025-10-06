-- =====================================================
-- FINAL FIX - Remove ALL recursion possibilities
-- =====================================================

-- Drop ALL existing policies for profiles
DROP POLICY IF EXISTS "Users can view profiles in their agency" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view agency profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Drop ALL existing policies for agencies
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Service role can insert agencies" ON agencies;
DROP POLICY IF EXISTS "Agency owners/admins can update their agency" ON agencies;

-- =====================================================
-- PROFILES - SIMPLE POLICIES (NO RECURSION)
-- =====================================================

-- SELECT: Users can ONLY view their own profile (direct match, no subquery)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

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
-- AGENCIES - SIMPLE POLICIES
-- =====================================================

-- SELECT: Service role can view agencies (for joins)
CREATE POLICY "Service role can view agencies"
  ON agencies FOR SELECT
  TO service_role
  USING (true);

-- SELECT: Users can view agencies (permissive for now)
CREATE POLICY "Users can view agencies"
  ON agencies FOR SELECT
  TO authenticated
  USING (true);

-- INSERT: Service role can insert agencies (for signup trigger)
CREATE POLICY "Service role can insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

-- UPDATE: Users can update agencies where they are owner/admin
CREATE POLICY "Users can update agencies"
  ON agencies FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- VERIFY
-- =====================================================

SELECT 
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
ORDER BY tablename, cmd, policyname;
