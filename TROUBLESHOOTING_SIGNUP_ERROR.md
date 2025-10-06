# Troubleshooting 500 Error on Signup

## Error: "Database error saving new user"

This error occurs when the database trigger `handle_new_user` fails. Here's how to fix it:

## Step 1: Check if the Migration Ran Successfully

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Run this query to check if the trigger exists:

```sql
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected Result:** Should show the trigger exists on `auth.users` table.

## Step 2: Check if Tables Exist

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'agencies', 'clients', 'proposals');
```

**Expected Result:** Should show all 4 tables.

## Step 3: Test the Trigger Function Manually

```sql
-- Test the function directly
DO $$
DECLARE
  test_user_id UUID := gen_random_uuid();
  test_email TEXT := 'test@example.com';
BEGIN
  -- Simulate what the trigger does
  DECLARE
    agency_id UUID;
  BEGIN
    -- Create agency
    INSERT INTO agencies (name, contact_email)
    VALUES ('Test Agency', test_email)
    RETURNING id INTO agency_id;
    
    -- Create profile
    INSERT INTO profiles (id, email, full_name, agency_id, role)
    VALUES (
      test_user_id,
      test_email,
      'Test User',
      agency_id,
      'owner'
    );
    
    RAISE NOTICE 'Success! Agency ID: %, Profile created for user: %', agency_id, test_user_id;
  END;
END $$;
```

**Expected Result:** Should show "Success!" message.

## Step 4: Fix Common Issues

### Issue A: Trigger Doesn't Exist

If the trigger doesn't exist, run this in SQL Editor:

```sql
-- Recreate the trigger function
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

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### Issue B: Permission Issues

The trigger needs `security definer` to work. Run:

```sql
ALTER FUNCTION handle_new_user() SECURITY DEFINER;
```

### Issue C: RLS Policies Blocking the Insert

Temporarily disable RLS to test:

```sql
-- Check if RLS is blocking
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'agencies');

-- Temporarily disable RLS for testing (RE-ENABLE LATER!)
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;
```

**⚠️ IMPORTANT:** After testing, re-enable RLS:

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
```

### Issue D: Email Confirmation Required

Supabase might require email confirmation. To disable it temporarily:

1. Go to **Authentication** → **Providers** → **Email**
2. Toggle **"Confirm email"** to OFF
3. Try signing up again

## Step 5: Check Supabase Logs

1. Go to Supabase Dashboard
2. Navigate to **Logs** → **Database**
3. Look for errors related to the trigger
4. Common errors:
   - "permission denied for table"
   - "null value in column violates not-null constraint"
   - "duplicate key value violates unique constraint"

## Step 6: Manual Signup Test

If the trigger still fails, you can manually test signup:

```sql
-- 1. Create a test auth user (via Supabase Auth UI)
-- Then run this to manually create their profile:

DO $$
DECLARE
  user_id UUID := 'PASTE-USER-ID-HERE';  -- Get from auth.users table
  user_email TEXT := 'noah.aung@outlook.com';
  agency_id UUID;
BEGIN
  -- Create agency
  INSERT INTO agencies (name, contact_email)
  VALUES ('Adverto Media Limited', user_email)
  RETURNING id INTO agency_id;
  
  -- Create profile
  INSERT INTO profiles (id, email, full_name, agency_id, role)
  VALUES (user_id, user_email, 'Noah Aung', agency_id, 'owner');
  
  RAISE NOTICE 'Profile created successfully!';
END $$;
```

## Step 7: Alternative - Use Service Role Key

If the trigger continues failing, we can bypass it and create profiles directly in the signup function:

1. Get your **Service Role Key** from Supabase Dashboard
2. Add to `.env.local`:

```env
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. Update `AuthContext.tsx` to create profile manually (I can help with this if needed)

## Quick Fix - Disable Email Confirmation

The fastest fix right now:

1. **Supabase Dashboard** → **Authentication** → **Providers** → **Email**
2. **Disable "Confirm email"**
3. **Disable "Double confirm email changes"**
4. Click **Save**
5. Try signup again

## After Fixing

Once you fix the issue, test the complete flow:

1. **Delete test users** from auth.users
2. **Delete test agencies and profiles**
3. **Try signing up again** with the form
4. **Check tables** to verify data was created

```sql
-- Verify signup worked
SELECT 
  u.email,
  p.full_name,
  a.name as agency_name
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN agencies a ON p.agency_id = a.id
ORDER BY u.created_at DESC
LIMIT 5;
```

---

## What to Check Right Now

1. Open browser console (F12) and try signup again
2. Look for console.log messages showing the error details
3. Check Supabase Dashboard → Logs for database errors
4. Try the SQL queries above to diagnose the issue

Let me know what errors you see and I'll help fix them!
