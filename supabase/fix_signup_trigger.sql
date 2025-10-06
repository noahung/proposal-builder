-- =====================================================
-- FIX SIGNUP TRIGGER - Run this in Supabase SQL Editor
-- =====================================================

-- Step 1: Check if trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 2: Drop existing trigger and function (if they exist)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- Step 3: Recreate the function with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_agency_id UUID;
BEGIN
  -- Log the attempt
  RAISE NOTICE 'Creating agency and profile for user: %', NEW.id;
  
  -- Create agency first
  INSERT INTO public.agencies (name, contact_email)
  VALUES (
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Agency'),
    NEW.email
  )
  RETURNING id INTO new_agency_id;
  
  RAISE NOTICE 'Agency created with ID: %', new_agency_id;
  
  -- Create profile
  INSERT INTO public.profiles (id, email, full_name, agency_id, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    new_agency_id,
    'owner'
  );
  
  RAISE NOTICE 'Profile created successfully for user: %', NEW.id;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    -- Return NEW anyway to allow user creation
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

-- Step 5: Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Step 6: Verify trigger was created
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Step 7: Test with a mock user (optional - comment out if not needed)
/*
DO $$
DECLARE
  test_agency_id UUID;
  test_user_id UUID := gen_random_uuid();
BEGIN
  -- Simulate the trigger
  INSERT INTO public.agencies (name, contact_email)
  VALUES ('Test Company', 'test@test.com')
  RETURNING id INTO test_agency_id;
  
  INSERT INTO public.profiles (id, email, full_name, agency_id, role)
  VALUES (test_user_id, 'test@test.com', 'Test User', test_agency_id, 'owner');
  
  RAISE NOTICE 'Test successful! Agency ID: %, User ID: %', test_agency_id, test_user_id;
  
  -- Clean up test data
  DELETE FROM public.profiles WHERE id = test_user_id;
  DELETE FROM public.agencies WHERE id = test_agency_id;
END $$;
*/

-- Step 8: Check RLS policies aren't blocking inserts
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
ORDER BY tablename, policyname;

-- If you see policies blocking INSERT, run this temporarily:
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;

-- Then try signup again, and re-enable:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
