# 🐛 ProposalEditor Bug Fixes

## Issues Fixed

### 1. ❌ "Add Page" Duplicate Key Error
**Error Message**: `Failed to create page: duplicate key value violates unique constraint "proposal_sections_proposal_id_order_index_key"`

**Root Cause**: 
- The database has a unique constraint on `(proposal_id, order_index)`
- When adding a new page, the code used `sections.length` as the `order_index`
- If pages were deleted, this could create duplicate indices
- Example: 3 pages (indices 0,1,2) → delete page 1 → 2 pages remain → add new page with index 2 → **CONFLICT!**

**Fix**:
```typescript
// BEFORE (WRONG)
const nextOrderIndex = sections ? sections.length : 0;

// AFTER (FIXED)
const maxOrderIndex = sections && sections.length > 0
  ? Math.max(...sections.map(s => s.order_index))
  : -1;
const nextOrderIndex = maxOrderIndex + 1;
```

Now it always uses `max(order_index) + 1`, ensuring no duplicates.

---

### 2. ❌ Element Deletion Not Persisting
**Problem**: 
- Elements could be deleted using Delete key or right-click
- Changes showed in UI but weren't saved to database
- Relied on auto-save (2-30 second delay)
- Refreshing page would restore deleted elements

**Root Cause**:
- Delete operations only updated local state (`setElements`)
- Auto-save had debounce delay of 2 seconds
- Users might navigate away before auto-save triggered

**Fix**:
Added immediate save after deletion in 3 places:

1. **Delete Key Handler** (Line 123-155)
2. **Toolbar Delete Button** (Line 931-955)
3. **Right-Click Context Menu** (Line 407-432)

All now call:
```typescript
const updatedElements = elements.filter(el => el.id !== selectedElement);
setElements(updatedElements);

// Immediately save to database
await updateSection.mutateAsync({
  id: currentSectionId,
  data: { elements: updatedElements },
});
setLastSaved(new Date());
```

---

### 3. ❌ Page Deletion Leaving Order Index Gaps
**Problem**:
- Deleting a page left gaps in order indices
- Example: Pages with indices [0, 1, 2] → delete 1 → indices [0, 2]
- This could cause issues with "Add Page" feature

**Fix**:
After deleting a section, automatically reorder remaining sections:

```typescript
// After successful deletion
const remainingSections = sections.filter(s => s.id !== sectionId);

// Reorder to sequential indices (0, 1, 2, ...)
const reorderUpdates = remainingSections.map((section, index) => ({
  id: section.id,
  order_index: index,
}));

// Update database
await Promise.all(
  reorderUpdates.map(({ id, order_index }) =>
    updateSection.mutateAsync({ id, data: { order_index } })
  )
);
```

---

## Technical Details

### Database Schema
The `proposal_sections` table has this constraint:
```sql
UNIQUE (proposal_id, order_index)
```

This ensures:
- ✅ No duplicate page numbers within same proposal
- ✅ Consistent ordering
- ❌ But requires careful order_index management

### Order Index Strategy
**Previous approach** (BROKEN):
- Add page: `order_index = sections.length`
- Delete page: No reordering
- Result: Gaps and duplicates possible

**New approach** (FIXED):
- Add page: `order_index = max(order_index) + 1`
- Delete page: Reorder remaining to [0, 1, 2, ...]
- Result: Always sequential, no gaps or duplicates

---

## Files Modified

1. **src/components/admin/ProposalEditor.tsx**
   - `handleAddSection()` - Fixed order_index calculation
   - `handleDeleteSection()` - Added automatic reordering
   - Delete key handler - Added immediate save
   - Toolbar delete button - Added immediate save
   - Context menu delete - Added immediate save

---

## Testing

After this fix, verify:

1. ✅ **Add Page**: Can add multiple pages without errors
2. ✅ **Delete Page**: Page deletion works smoothly
3. ✅ **Add After Delete**: Can add new pages after deleting old ones
4. ✅ **Element Delete (Key)**: Press Delete/Backspace → element gone immediately
5. ✅ **Element Delete (Button)**: Click 🗑️ → element removed and saved
6. ✅ **Element Delete (Right-click)**: Context menu delete works
7. ✅ **Persistence**: Refresh page → deleted elements stay deleted
8. ✅ **Order Indices**: Pages always numbered sequentially

---

## Commits

- Fix ProposalEditor: Add page duplicate key error
- Fix ProposalEditor: Element deletion not persisting
- Fix ProposalEditor: Page deletion reordering

**Date**: October 7, 2025
**Author**: GitHub Copilot
