-- =====================================================
-- CRITICAL FIX - Add INSERT policies for signup trigger
-- =====================================================

-- The problem: RLS is enabled on profiles and agencies tables,
-- but there are NO INSERT policies, so the trigger cannot insert!

-- Solution: Add INSERT policies that allow the trigger to work

-- For AGENCIES table
CREATE POLICY "Allow service role to insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

-- For PROFILES table  
CREATE POLICY "Allow service role to insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Also allow authenticated users to insert their own profile
-- (in case direct insert is needed)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Verify the policies were created
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
ORDER BY tablename, cmd, policyname;

-- You should now see INSERT policies for both tables
