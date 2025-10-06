-- =====================================================
-- QUICK FIX - Disable RLS temporarily for signup
-- =====================================================

-- This allows the trigger to insert data without RLS blocking it
-- The trigger runs with SECURITY DEFINER which should bypass RLS,
-- but sometimes Supabase has issues with this.

-- Option 1: Temporarily disable RLS on profiles and agencies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;

-- Try signing up now. If it works, re-enable with:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- OR - Better Solution: Add policies for service role
-- =====================================================

-- Option 2: Create policies that allow the trigger to insert
-- (Keep RLS enabled but allow service operations)

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can insert agencies" ON agencies;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Allow service role (which the trigger uses) to insert
CREATE POLICY "Service role can insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Also allow authenticated users to insert their own profile during signup
CREATE POLICY "Users can insert own profile during signup"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
  AND cmd = 'INSERT'
ORDER BY tablename;
