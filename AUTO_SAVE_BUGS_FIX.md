# 🐛 Auto-Save Bug Fixes

## Issues Fixed

### 1. ❌ "Cannot access 'handleAutoSave' before initialization"
**Error**: `Uncaught ReferenceError: Cannot access 'handleAutoSave' before initialization`

**Root Cause**:
- The `handleAutoSave` function was defined AFTER the useEffect hooks that called it
- Function hoisting doesn't work with `const` declarations
- The loading state check (`if (proposalLoading)`) caused early return before function definition

**Fix**:
```typescript
// BEFORE (WRONG) - Function defined after usage
useEffect(() => {
  handleAutoSave(); // ❌ ReferenceError!
}, [elements]);

const handleAutoSave = async () => { ... }; // Defined too late

// AFTER (FIXED) - Function defined before usage
const handleAutoSave = async () => { ... }; // ✅ Defined early

useEffect(() => {
  handleAutoSave(); // ✅ Works!
}, [elements, handleAutoSave]);
```

---

### 2. ❌ Button Nesting Warning
**Warning**: `validateDOMNesting(...): <button> cannot appear as a descendant of <button>`

**Root Cause**:
- Section list items used `<button>` wrapper containing nested `<button>` elements for edit/delete
- Invalid HTML structure

**Fix**:
Changed outer `<button>` to `<div>` with `cursor-pointer`:

```tsx
// BEFORE (WRONG)
<button onClick={() => setCurrentSection(...)}>
  <button onClick={...}>✏️</button>  {/* ❌ Nested button! */}
  <button onClick={...}>×</button>
</button>

// AFTER (FIXED)
<div onClick={() => setCurrentSection(...)} className="cursor-pointer">
  <button onClick={...}>✏️</button>  {/* ✅ Valid! */}
  <button onClick={...}>×</button>
</div>
```

---

### 3. ❌ Auto-Save 406 Error
**Error**: `Failed to load resource: the server responded with a status of 406`  
**Message**: `Cannot coerce the result to a single JSON object`

**Root Cause**:
- Supabase `.single()` expects exactly 1 result
- When query returns 0 or >1 results, it throws 406 error
- Could happen if:
  - Section was deleted before update completes
  - Race condition during parallel reorder operations
  - Stale section ID in cache

**Fix**:
```typescript
// BEFORE (FRAGILE)
const { data, error } = await supabase
  .from('proposal_sections')
  .update(updateData)
  .eq('id', id)
  .select()
  .single(); // ❌ Throws 406 if 0 or >1 results

// AFTER (ROBUST)
const { data, error } = await supabase
  .from('proposal_sections')
  .update(updateData)
  .eq('id', id)
  .select(); // ✅ Returns array

const result = data && data.length > 0 ? data[0] : null; // Handle gracefully
```

---

### 4. ❌ Embed iframe showing "Loading..."
**Problem**: Embed iframes display loading spinner instead of actual content

**Root Cause**:
- Auto-save mutations trigger React Query invalidations
- Query invalidations cause `sectionsLoading` to become `true`
- Loading state shows `<LoadingScreen>` component
- This overlays the entire editor, hiding embeds

**Not Actually Fixed Yet** - This is a deeper architectural issue requiring:
- Optimistic updates instead of full refetch
- Background refetch without loading state
- Or better loading indicators that don't block UI

**Temporary Workaround**: Wait 2-3 seconds after adding embed for auto-save to complete

---

## Files Modified

1. **src/components/admin/ProposalEditor.tsx**
   - Moved `handleAutoSave` function before useEffect hooks
   - Changed section button wrapper from `<button>` to `<div>`
   - Added `handleAutoSave` to useEffect dependencies

2. **src/services/sectionService.ts**
   - Removed `.single()` from update query
   - Added safe array handling for update results

---

## Testing

After this fix:

1. ✅ **No more console errors** - "Cannot access before initialization" gone
2. ✅ **No more button nesting warnings** - Valid HTML structure
3. ✅ **No more 406 errors** - Update handles missing rows gracefully
4. ⚠️ **Embed loading issue** - Still present, requires deeper fix

---

## Known Issues

### Embed Loading (Unfixed)
The loading overlay issue requires architectural changes:

**Option A**: Optimistic Updates
```typescript
onMutate: async (newData) => {
  // Cancel outgoing refetches
  await queryClient.cancelQueries({ queryKey: sectionKeys.all });
  
  // Snapshot previous value
  const previous = queryClient.getQueryData(sectionKeys.byProposal(proposalId));
  
  // Optimistically update
  queryClient.setQueryData(sectionKeys.byProposal(proposalId), newData);
  
  return { previous };
},
onError: (err, newData, context) => {
  // Rollback on error
  queryClient.setQueryData(sectionKeys.byProposal(proposalId), context.previous);
},
```

**Option B**: Background Refetch
```typescript
return useQuery({
  queryKey: sectionKeys.byProposal(proposalId),
  queryFn: ...,
  refetchOnMount: 'always',
  refetchOnWindowFocus: false,
  // Don't show loading spinner during background refetch
  notifyOnChangeProps: ['data', 'error'],
});
```

**Option C**: Better Loading State
```typescript
// Only show loading for initial load, not refetches
if (proposalLoading && !proposal) {
  return <LoadingScreen />;
}

if (sectionsLoading && !sections) {
  return <LoadingScreen />;
}
```

---

## Commits

- Fix auto-save initialization error + button nesting warning
- Fix 406 error in section update query

**Date**: October 7, 2025  
**Author**: GitHub Copilot
