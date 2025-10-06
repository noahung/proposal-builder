# 🚀 Quick Start - Supabase Setup

## Fast Track Setup (30 minutes)

### 1️⃣ Create Supabase Project
```
1. Go to: https://supabase.com
2. Sign up/Login
3. New Project → Choose name & region
4. Save database password!
5. Wait 2-3 minutes for provisioning
```

### 2️⃣ Get API Keys
```
Go to: Settings → API
Copy these 2 values:
- Project URL: https://xxxxx.supabase.co
- anon public key: eyJhb... (starts with eyJ)
```

### 3️⃣ Create .env.local File
```bash
# In project root, create .env.local with:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...your-key-here
SUPABASE_SERVICE_ROLE_KEY=eyJhb...your-service-key
VITE_APP_URL=http://localhost:3000
```

### 4️⃣ Run Database Migration
```
1. Open: Supabase Dashboard → SQL Editor
2. Click: New Query
3. Copy ALL of: supabase/migrations/20251006000000_initial_schema.sql
4. Paste into editor
5. Click: Run
6. Should see: "Success. No rows returned"
```

### 5️⃣ Verify Tables Created
```
Go to: Table Editor
You should see 8 tables:
✓ agencies
✓ profiles  
✓ clients
✓ proposals
✓ proposal_sections
✓ templates
✓ proposal_activities
✓ attachments
```

### 6️⃣ Create Storage Buckets
```
Go to: Storage → New Bucket

Bucket 1: proposals (PRIVATE - uncheck public)
Bucket 2: avatars (PUBLIC - check public)
Bucket 3: logos (PUBLIC - check public)
```

### 7️⃣ Configure Auth
```
Go to: Authentication → URL Configuration
Site URL: http://localhost:3000
Redirect URLs: http://localhost:3000/**
```

### 8️⃣ Restart Dev Server
```bash
npm run dev
```

### 9️⃣ Verify - Check Console
```
Open browser console (F12)
No Supabase errors? ✅ You're good!
```

---

## ✅ Completion Checklist

- [ ] Supabase project created
- [ ] API keys copied
- [ ] .env.local created with real values
- [ ] Database migration run
- [ ] 8 tables visible in dashboard
- [ ] 3 storage buckets created
- [ ] Auth configured
- [ ] Dev server running
- [ ] No console errors

---

## 🆘 Quick Troubleshooting

**Problem**: "Missing Supabase environment variables"  
**Fix**: Check .env.local has VITE_ prefix and is in root folder

**Problem**: Migration fails  
**Fix**: Copy ENTIRE SQL file, paste in fresh query tab

**Problem**: Tables not showing  
**Fix**: Refresh page, check migration ran successfully

**Problem**: Can't connect to Supabase  
**Fix**: Verify URL and keys are correct, no extra spaces

---

## 📚 Files Reference

- `PHASE2_SETUP_GUIDE.md` - Detailed step-by-step guide
- `TASK1_COMPLETE.md` - Summary of what's done
- `.env.local.example` - Environment template
- `supabase/migrations/20251006000000_initial_schema.sql` - Database

---

**Time estimate**: 30 minutes  
**Difficulty**: Easy (just follow steps)  
**Help needed**: If stuck, check PHASE2_SETUP_GUIDE.md
