-- =====================================================
-- TEMPORARY FIX - Disable RLS to get unblocked
-- =====================================================
-- This will let you continue working while we debug the policies
-- We'll re-enable RLS with proper policies later

-- Disable RLS on profiles and agencies
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'agencies');

-- Expected: rowsecurity = false for both tables
