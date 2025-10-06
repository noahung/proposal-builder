# Phase 2 Setup Guide - Supabase Backend Integration

## 🎯 Current Progress: Task 1 Complete ✅

### What We've Done So Far:

1. ✅ **Installed Dependencies**
   - `@supabase/supabase-js` - Supabase JavaScript client
   - `@tanstack/react-query` - State management

2. ✅ **Created Configuration Files**
   - `src/lib/supabase.ts` - Supabase client configuration
   - `src/lib/database.types.ts` - TypeScript database types
   - `src/lib/queryClient.ts` - React Query configuration
   - `.env.local.example` - Environment variables template
   - `.gitignore` - Git ignore rules

3. ✅ **Created Database Migration**
   - `supabase/migrations/20251006000000_initial_schema.sql` - Complete database schema

---

## 📋 Next Steps: Follow This Checklist

### Step 1: Create Supabase Project (15 minutes)

1. **Go to [Supabase](https://supabase.com/)**
   - Sign up or log in
   - Click "New Project"
   - Choose organization (or create one)

2. **Configure Your Project**
   - Project Name: `proposal-builder` (or your choice)
   - Database Password: **Save this securely!**
   - Region: Choose closest to you
   - Pricing Plan: Free tier is fine for development
   - Click "Create new project"
   - Wait 2-3 minutes for provisioning

3. **Get Your API Keys**
   - Once project is ready, go to Settings → API
   - Copy these values:
     - Project URL (looks like: `https://xxxxx.supabase.co`)
     - `anon` public key (starts with `eyJ...`)
     - `service_role` key (starts with `eyJ...`) **KEEP SECRET!**

### Step 2: Configure Environment Variables (2 minutes)

1. **Create `.env.local` file** in project root:
   ```bash
   # Copy the example file
   copy .env.local.example .env.local
   ```

2. **Edit `.env.local`** and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   VITE_APP_URL=http://localhost:3000
   ```

3. **Verify the file** - Make sure `.env.local` is in `.gitignore`

### Step 3: Run Database Migration (5 minutes)

1. **Open Supabase Dashboard**
   - Go to your project
   - Click "SQL Editor" in left sidebar
   - Click "New query"

2. **Copy and Run Migration**
   - Open `supabase/migrations/20251006000000_initial_schema.sql`
   - Copy ALL the SQL code
   - Paste into Supabase SQL Editor
   - Click "Run" (bottom right)
   - Should see "Success. No rows returned"

3. **Verify Tables Created**
   - Go to "Table Editor" in left sidebar
   - You should see these tables:
     - ✅ agencies
     - ✅ profiles
     - ✅ clients
     - ✅ proposals
     - ✅ proposal_sections
     - ✅ templates
     - ✅ proposal_activities
     - ✅ attachments

### Step 4: Configure Authentication (5 minutes)

1. **Enable Email Auth**
   - Go to Authentication → Providers
   - Make sure "Email" is enabled
   - Configure email templates (optional, can do later)

2. **Configure Site URL**
   - Go to Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: Add `http://localhost:3000/**`

3. **Configure Email Templates** (Optional - can customize later)
   - Go to Authentication → Email Templates
   - Customize confirmation, reset password emails
   - Or use defaults for now

### Step 5: Test Database Connection (2 minutes)

1. **Restart your dev server**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Check for errors**
   - Open browser console (F12)
   - Look for Supabase connection errors
   - If you see errors about missing env variables, check Step 2

### Step 6: Configure Storage Buckets (10 minutes)

1. **Go to Storage** in Supabase Dashboard

2. **Create Buckets**:
   
   **Bucket 1: proposals** (Private)
   - Click "New bucket"
   - Name: `proposals`
   - Public bucket: **UNCHECK** (private)
   - Click "Create bucket"
   
   **Bucket 2: avatars** (Public)
   - Click "New bucket"
   - Name: `avatars`
   - Public bucket: **CHECK** (public)
   - Click "Create bucket"
   
   **Bucket 3: logos** (Public)
   - Click "New bucket"
   - Name: `logos`
   - Public bucket: **CHECK** (public)
   - Click "Create bucket"

3. **Configure Storage Policies**
   - Go to Storage → Policies
   - For each bucket, we'll add policies in a later step
   - For now, just verify buckets are created

---

## ✅ Verification Checklist

Before proceeding to Task 2, verify:

- [ ] Supabase project is created and running
- [ ] `.env.local` file exists with correct values
- [ ] All 8 database tables are created
- [ ] RLS is enabled on all tables (check Table Editor → each table → RLS enabled)
- [ ] Authentication is configured
- [ ] Storage buckets are created (proposals, avatars, logos)
- [ ] Dev server starts without errors
- [ ] No console errors related to Supabase

---

## 🐛 Common Issues & Solutions

### Issue: "Missing Supabase environment variables"
**Solution**: Check `.env.local` file exists and has correct variable names starting with `VITE_`

### Issue: Database migration fails
**Solution**: 
- Make sure you copied the ENTIRE SQL file
- Run it in a new query tab
- Check for error messages and share them

### Issue: RLS policies not working
**Solution**: 
- Verify RLS is enabled: Table Editor → Select table → Check "Enable RLS"
- Policies are created in the migration

### Issue: Can't connect to Supabase
**Solution**:
- Verify project URL and keys are correct
- Check Supabase project is not paused (free tier pauses after inactivity)
- Try regenerating API keys in Supabase dashboard

---

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🎉 Once Complete

When all checkboxes above are ✅, you're ready for:

**Task 2: Create Authentication Context**
- We'll build the AuthContext
- Connect it to your existing auth screens
- Test sign-up, sign-in, and logout flows

---

**Need help?** Review the error messages carefully and check the Supabase dashboard for any issues.
