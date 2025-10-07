# YouTube Embed & Settings Update Summary

## Changes Made

### 1. ✅ YouTube Embedding Fix (Ad Blocker Workaround)

**Problem:**
- YouTube embeds showing `ERR_BLOCKED_BY_CLIENT` error
- Caused by ad blockers and privacy extensions blocking YouTube tracking

**Solution:**
- Auto-convert `youtube.com` URLs to `youtube-nocookie.com`
- The nocookie domain has fewer tracking scripts
- Less likely to be blocked by browser extensions

**Implementation:**
```typescript
// EmbedEditor.tsx
const convertToNoCookie = (code: string): string => {
  return code
    .replace(/https?:\/\/(www\.)?youtube\.com\/embed\//gi, 'https://www.youtube-nocookie.com/embed/')
    .replace(/https?:\/\/youtube\.com\/embed\//gi, 'https://www.youtube-nocookie.com/embed/');
};
```

**User Experience:**
- Automatic conversion when saving embed
- Helpful tip displayed in editor
- No manual changes needed

**Note:** 
- `ERR_BLOCKED_BY_CLIENT` is primarily a **client-side** issue (browser extensions)
- This fix reduces but may not eliminate all blocking
- Users with strict ad blockers may still see issues

---

### 2. ✅ Removed Billing Section (Internal Use Only)

**Changes:**
- ❌ Removed "Billing" tab from Settings page
- ❌ Commented out billing case in switch statement
- ❌ Removed payment method, plan, and billing history sections

**Remaining Settings Tabs:**
1. ✅ Account - Personal information
2. ✅ Notifications - Email preferences
3. ✅ Security - 2FA and session settings
4. ✅ Preferences - UI and format settings
5. ✅ Integrations - Third-party connections

**Reasoning:**
- App is for **internal use only**
- No payment processing needed
- Cleaner UI for team members

---

### 3. ✅ TypeScript Fixes

Fixed implicit `any` type errors in Settings.tsx:
```typescript
// Before
onCheckedChange={(checked) => ...}

// After  
onCheckedChange={(checked: boolean) => ...}
```

---

## Client View - Contact Information

### Current Status: ✅ UI Already Implemented

Your Figma design shows a sidebar with contact info (name, email, phone). **This is already built!**

**Files that have it:**
- `MaterialClientLayout.tsx` - Lines 131-164 (contact card in sidebar)
- `ClientLayout.tsx` - Similar implementation for neumorphic view

**What it displays:**
- Contact person's name with initials avatar
- "Account Manager" title
- Email (clickable mailto: link)
- Phone (clickable tel: link)
- Table of contents navigation

**Example from MaterialClientLayout:**
```tsx
<div className="material-card p-4 mb-6">
  <h3 className="font-medium text-material-on-surface mb-4">Contact Information</h3>
  <div className="space-y-3">
    {/* Name with avatar */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-material-surface-variant rounded-full">
        <span>{contactInfo.name.split(' ').map(n => n[0]).join('')}</span>
      </div>
      <div>
        <div className="font-medium">{contactInfo.name}</div>
        <div className="text-sm">Account Manager</div>
      </div>
    </div>
    
    {/* Email & Phone */}
    <div className="space-y-2">
      <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
      <a href={`tel:${contactInfo.phone}`}>{contactInfo.phone}</a>
    </div>
  </div>
</div>
```

---

## TODO: Connect Settings to Client View

**Currently:** Contact info is hardcoded in demo data

**Future Task:** Pull from user's profile settings (Supabase)

**What needs to be done:**

1. **Update App.tsx** to fetch user profile:
```typescript
// Use AuthContext to get profile
const { profile, agency } = useAuth();

// Pass to client layout
<ClientLayout
  contactInfo={{
    name: profile?.full_name || 'Account Manager',
    email: profile?.email || 'contact@agency.com',
    phone: profile?.phone || '+44 20 7123 4567',
  }}
  companyInfo={{
    name: agency?.name || 'ProposalCraft Agency',
    logo: agency?.logo_url,
  }}
  // ... other props
/>
```

2. **Database Schema** (already exists):
```sql
-- profiles table has:
- full_name
- email  
- phone
- job_title
- agency_id

-- agencies table has:
- name
- logo_url
```

3. **Settings Page** should save to Supabase:
```typescript
// In Settings.tsx
const { updateProfile } = useAuth();

const handleSaveChanges = async () => {
  await updateProfile({
    full_name: `${settings.firstName} ${settings.lastName}`,
    email: settings.email,
    phone: settings.phone,
    job_title: settings.jobTitle,
  });
};
```

---

## Summary

✅ **Completed Today:**
1. YouTube embeds auto-convert to nocookie domain
2. Billing section removed from Settings
3. TypeScript errors fixed
4. Verified client view UI matches Figma design

📝 **Future Enhancement:**
- Connect Settings form to Supabase database
- Pull contact info from user's profile for client view
- Add "Save Changes" functionality in Settings

🎨 **Design Status:**
Your Figma design is already implemented in the code! The sidebar with contact info, table of contents, and page navigation all exist in both neumorphic and material (classic) views.

---

## Testing Checklist

- [ ] Try adding YouTube embed (should auto-convert to nocookie)
- [ ] Check if YouTube still shows ERR_BLOCKED_BY_CLIENT (may still happen with strict ad blockers)
- [ ] Verify Settings page has no Billing tab
- [ ] Check client view (/client-preview route) shows contact sidebar
- [ ] Test both Neumorphic and Classic (Material) theme toggle
