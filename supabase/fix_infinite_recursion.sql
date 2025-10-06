-- =====================================================
-- FIX INFINITE RECURSION IN PROFILES POLICY
-- =====================================================

-- The problem: The SELECT policy queries profiles table to check agency_id,
-- which triggers the same policy again = infinite recursion

-- Solution: Allow users to always view their own profile directly

-- Step 1: Drop the problematic policy
DROP POLICY IF EXISTS "Users can view profiles in their agency" ON profiles;

-- Step 2: Create two separate policies

-- Policy 1: Users can ALWAYS view their own profile (no recursion)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Policy 2: Users can view OTHER profiles in their agency
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

-- Step 3: Verify the new policies
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
  AND cmd = 'SELECT'
ORDER BY policyname;

-- Expected output: Two SELECT policies for profiles
