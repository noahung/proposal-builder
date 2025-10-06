# 🔧 FIX FOR "Database error saving new user"

## Root Cause Found! ✅

The error occurs because:
1. ✅ RLS (Row Level Security) is **enabled** on `profiles` and `agencies` tables
2. ❌ There are **NO INSERT policies** for these tables
3. ❌ The signup trigger `handle_new_user()` tries to INSERT but RLS **blocks it**

## Solution: Add INSERT Policies

### Option 1: Quick Fix via Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard**
2. Go to **SQL Editor**
3. **Copy and paste** this SQL:

```sql
-- Add INSERT policies for signup trigger
CREATE POLICY "Service role can insert agencies"
  ON agencies FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Service role can insert profiles"
  ON profiles FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());
```

4. Click **Run**
5. Wait for "Success" message
6. **Try signing up again** - it should work now! 🎉

### Option 2: Run the Fix Script

I've created a file `supabase/add_insert_policies.sql` with the fix.

1. Open **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `supabase/add_insert_policies.sql`
3. Paste and **Run**
4. Try signup again

### Option 3: Reset and Re-run Migration

If you want a clean slate:

1. **Delete all data** from tables (if any test data exists):
```sql
DELETE FROM proposal_activities;
DELETE FROM attachments;
DELETE FROM proposal_sections;
DELETE FROM proposals;
DELETE FROM templates;
DELETE FROM clients;
DELETE FROM profiles;
DELETE FROM agencies;
```

2. **Drop and recreate policies**:
```sql
-- Drop all existing policies
DROP POLICY IF EXISTS "Users can view profiles in their agency" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own agency" ON agencies;
DROP POLICY IF EXISTS "Agency owners/admins can update their agency" ON agencies;
```

3. **Run the updated migration** from `supabase/migrations/20251006000000_initial_schema.sql`
   - The file has been updated with the INSERT policies
   - Go to Supabase Dashboard → SQL Editor
   - Run the entire migration again

### Verify the Fix

After adding the policies, verify they exist:

```sql
SELECT 
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename IN ('profiles', 'agencies')
  AND cmd = 'INSERT'
ORDER BY tablename;
```

**Expected Output:**
```
tablename | policyname                          | cmd    | roles
----------|-------------------------------------|--------|------------------
agencies  | Service role can insert agencies    | INSERT | {service_role}
profiles  | Service role can insert profiles    | INSERT | {service_role}
profiles  | Users can insert own profile        | INSERT | {authenticated}
```

## Test Signup Flow

After applying the fix:

1. **Clear browser cache** (Ctrl + Shift + Delete)
2. **Refresh the page** (F5)
3. **Try signing up** with:
   - Name: Noah Aung
   - Company: Adverto Media Limited
   - Email: noah.aung@outlook.com
   - Password: (your password)

4. **Check browser console** - should see:
   ```
   Starting signup process...
   Signup successful: { user: {...}, session: {...} }
   ```

5. **Verify in Supabase**:
   ```sql
   SELECT 
     u.email,
     p.full_name,
     a.name as agency_name
   FROM auth.users u
   LEFT JOIN profiles p ON u.id = p.id
   LEFT JOIN agencies a ON p.agency_id = a.id
   WHERE u.email = 'noah.aung@outlook.com';
   ```

## Why This Happened

The original migration file was missing INSERT policies because:
- We focused on SELECT/UPDATE/DELETE policies for agency isolation
- We assumed the trigger with `SECURITY DEFINER` would bypass RLS
- But Supabase requires explicit INSERT policies even for service operations

## Updated Files

✅ `supabase/migrations/20251006000000_initial_schema.sql` - Now includes INSERT policies
✅ `supabase/add_insert_policies.sql` - Quick fix SQL script
✅ `supabase/fix_signup_trigger.sql` - Complete troubleshooting script
✅ `supabase/fix_rls_for_signup.sql` - Alternative RLS fixes

## Next Steps After Fix

Once signup works:

1. ✅ Test complete signup flow
2. ✅ Test email confirmation (if enabled)
3. ✅ Test signin with created account
4. ✅ Verify agency and profile were created
5. ✅ Move to Task 7: Connect UI to Backend

---

**Let me know if the fix works!** If you still see errors, share the console output and I'll help debug further. 🚀
