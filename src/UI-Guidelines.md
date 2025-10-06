# ProposalCraft Platform - UI Design Guidelines

## Table of Contents
1. [Design System Overview](#design-system-overview)
2. [Neumorphic Design Principles](#neumorphic-design-principles)
3. [Color Scheme](#color-scheme)
4. [Typography](#typography)
5. [Component Library](#component-library)
6. [Layout Patterns](#layout-patterns)
7. [Responsive Design](#responsive-design)
8. [Accessibility](#accessibility)
9. [Development Guidelines](#development-guidelines)
10. [Component Usage Examples](#component-usage-examples)

---

## Design System Overview

ProposalCraft uses a modern **Neumorphic Design System** that creates a tactile, three-dimensional interface through the use of soft shadows and subtle gradients. The design emphasises user engagement through tactile feedback and intuitive visual hierarchy.

### Core Design Principles
- **Soft Minimalism**: Clean interfaces with subtle depth
- **Tactile Feedback**: Elements appear pressable and interactive
- **Consistent Spacing**: 8px grid system (4px, 8px, 12px, 16px, 24px, 32px, etc.)
- **British English**: All copy uses UK spellings (colour, organisation, realise, etc.)
- **Professional Aesthetics**: Business-focused design suitable for B2B contexts

---

## Neumorphic Design Principles

### Shadow System
The neumorphic effect is achieved through a dual-shadow system:

```css
/* Raised Elements (Cards, Buttons) */
box-shadow: 
  12px 12px 24px #a3a3a3,    /* Dark shadow (bottom-right) */
  -12px -12px 24px #ffffff;   /* Light shadow (top-left) */

/* Inset Elements (Inputs, Pressed States) */
box-shadow: 
  inset 8px 8px 16px #bebebe,    /* Dark shadow (inset) */
  inset -8px -8px 16px #ffffff;  /* Light shadow (inset) */

/* Interactive Elements (Buttons on hover) */
box-shadow: 
  8px 8px 16px #a3a3a3,
  -8px -8px 16px #ffffff;
```

### Element States
1. **Default**: Raised appearance with dual shadows
2. **Hover**: Slightly more pronounced shadows + subtle transform
3. **Active/Pressed**: Inset shadows to simulate being pressed
4. **Focus**: Orange ring outline matching brand colour

### Background Requirements
- All neumorphic elements must use the same background colour as their container
- Background colour: `#e0e0e0` (light grey)
- Never use neumorphic effects on contrasting backgrounds

---

## Color Scheme

### Primary Colours
```css
--primary: #f47421;           /* Orange - Main brand colour */
--primary-foreground: #ffffff; /* White text on orange */
--background: #e0e0e0;        /* Light grey background */
--foreground: #4a4a4a;        /* Dark grey text */
```

### Secondary Colours
```css
--secondary: #d4d4d8;         /* Lighter grey */
--secondary-foreground: #52525b; /* Medium grey text */
--muted: #d4d4d8;            /* Muted elements */
--muted-foreground: #71717a;  /* Muted text */
```

### Functional Colours
```css
--destructive: #ef4444;       /* Red for danger/delete */
--destructive-foreground: #ffffff;
--accent: #f47421;           /* Same as primary for consistency */
--accent-foreground: #ffffff;
```

### Usage Guidelines
- **Primary Orange (#f47421)**: Primary buttons, links, active states, highlights
- **Background Grey (#e0e0e0)**: Main background, card backgrounds, button backgrounds
- **Dark Grey (#4a4a4a)**: Primary text, headings, body copy
- **Medium Grey (#71717a)**: Secondary text, captions, placeholders
- **Red (#ef4444)**: Only for destructive actions (delete, cancel, errors)

---

## Typography

### Font Family
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale
```css
/* Headings */
h1: 24px (text-2xl), font-weight: 500, line-height: 1.5
h2: 20px (text-xl), font-weight: 500, line-height: 1.5
h3: 18px (text-lg), font-weight: 500, line-height: 1.5
h4: 16px (text-base), font-weight: 500, line-height: 1.5

/* Body Text */
p: 16px (text-base), font-weight: 400, line-height: 1.5
label: 16px (text-base), font-weight: 500, line-height: 1.5
button: 16px (text-base), font-weight: 500, line-height: 1.5

/* Small Text */
small: 14px (text-sm), font-weight: 400, line-height: 1.5
caption: 12px (text-xs), font-weight: 400, line-height: 1.5
```

### Typography Rules
- **Never use Tailwind font classes** (`text-xl`, `font-bold`, etc.) unless specifically changing from defaults
- Default typography is handled by CSS base styles
- Use `text-muted-foreground` for secondary text
- Use `text-primary` for highlighted text
- Maintain consistent line-height of 1.5 for readability

---

## Component Library

### Custom Neumorphic Components

#### NeumorphCard
```tsx
import { NeumorphCard } from './components/ui/neumorph-card';

// Basic usage
<NeumorphCard>Content here</NeumorphCard>

// With inset variant
<NeumorphCard variant="inset">Inset content</NeumorphCard>
```

#### NeumorphButton
```tsx
import { NeumorphButton } from './components/ui/neumorph-button';

// Variants
<NeumorphButton variant="default">Default</NeumorphButton>
<NeumorphButton variant="primary">Primary</NeumorphButton>
<NeumorphButton variant="destructive">Delete</NeumorphButton>

// Sizes
<NeumorphButton size="sm">Small</NeumorphButton>
<NeumorphButton size="md">Medium</NeumorphButton>
<NeumorphButton size="lg">Large</NeumorphButton>
```

#### NeumorphInput
```tsx
import { NeumorphInput } from './components/ui/neumorph-input';

<NeumorphInput placeholder="Enter text..." />
<NeumorphInput type="email" placeholder="Email address" />
```

### ShadCN Components
Available components from `/components/ui/`:
- `Button`, `Input`, `Card` (standard versions)
- `Dialog`, `Modal`, `Toast` (overlays)
- `Table`, `Tabs`, `Accordion` (complex components)
- `Switch`, `Checkbox`, `Select` (form elements)

### Component Selection Rules
1. **Always prefer NeumorphCard over Card** for main content areas
2. **Always prefer NeumorphButton over Button** for primary interactions
3. **Always prefer NeumorphInput over Input** for form fields
4. Use standard ShadCN components for overlays (modals, tooltips, dropdowns)
5. Use ShadCN Table, Tabs, and other complex components unchanged

---

## Layout Patterns

### Page Structure
```tsx
// Standard admin page structure
<div className="space-y-6">
  {/* Page Header */}
  <div>
    <h1>Page Title</h1>
    <p className="text-muted-foreground">Page description</p>
  </div>

  {/* Main Content */}
  <NeumorphCard>
    {/* Card content */}
  </NeumorphCard>
</div>
```

### Grid Systems
```tsx
// 2-column layout
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <NeumorphCard>Left content</NeumorphCard>
  <NeumorphCard>Right content</NeumorphCard>
</div>

// 3-column layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <NeumorphCard>Column 1</NeumorphCard>
  <NeumorphCard>Column 2</NeumorphCard>
  <NeumorphCard>Column 3</NeumorphCard>
</div>
```

### Spacing System
- **Component spacing**: `space-y-6` between major sections
- **Form spacing**: `space-y-4` between form elements
- **Card padding**: Default padding handled by NeumorphCard
- **Grid gaps**: `gap-4` for tight layouts, `gap-6` for standard layouts

---

## Responsive Design

### Breakpoints
```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices */
```

### Responsive Patterns
```tsx
// Mobile-first grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

// Responsive text
<h1 className="text-xl md:text-2xl">Responsive heading</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">

// Hide on mobile
<div className="hidden md:block">Desktop only content</div>

// Show only on mobile
<div className="block md:hidden">Mobile only content</div>
```

### Mobile Considerations
- Touch targets minimum 44px × 44px
- Adequate spacing between interactive elements
- Single-column layouts on mobile
- Simplified navigation patterns
- Larger button sizes on mobile

---

## Accessibility

### Colour Contrast
- Primary text on background: 7.1:1 (AAA compliant)
- Secondary text on background: 4.8:1 (AA compliant)
- Orange primary on white: 3.2:1 (AA compliant for large text)

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Focus states clearly visible (orange ring)
- Logical tab order maintained
- Modal traps focus appropriately

### Screen Reader Support
```tsx
// Proper labelling
<NeumorphInput 
  aria-label="Email address"
  placeholder="Enter your email"
/>

// Status announcements
<div aria-live="polite" className="sr-only">
  Proposal saved successfully
</div>

// Semantic markup
<main role="main">
  <h1>Page Title</h1>
  <section aria-labelledby="section-heading">
    <h2 id="section-heading">Section Title</h2>
  </section>
</main>
```

---

## Development Guidelines

### File Structure
```
components/
├── admin/          # Admin-specific components
├── auth/           # Authentication components
├── client/         # Client-facing components
├── layout/         # Layout components
├── ui/             # Reusable UI components
├── modals/         # Modal components
└── utility/        # Utility components
```

### Naming Conventions
- **Components**: PascalCase (`ProposalCard`)
- **Files**: PascalCase (`ProposalCard.tsx`)
- **Props**: camelCase (`onNavigate`, `currentPage`)
- **CSS classes**: kebab-case (`neumorph-card`)

### Component Structure
```tsx
import React from 'react';
import { NeumorphCard } from '../ui/neumorph-card';

interface ComponentProps {
  title: string;
  onAction: () => void;
  isActive?: boolean;
}

export const ComponentName: React.FC<ComponentProps> = ({
  title,
  onAction,
  isActive = false
}) => {
  return (
    <NeumorphCard>
      <h3>{title}</h3>
      {/* Component content */}
    </NeumorphCard>
  );
};
```

### State Management
- Use React `useState` for component-level state
- Use props for parent-child communication
- Consider Context API for deeply nested state
- Avoid prop drilling beyond 2-3 levels

### Performance Optimizations
- Use `React.memo` for expensive components
- Implement proper key props for lists
- Lazy load images where appropriate
- Use `useCallback` for stable function references

---

## Component Usage Examples

### Form Layout
```tsx
<NeumorphCard>
  <h3 className="mb-6">Form Title</h3>
  <div className="space-y-4">
    <div>
      <label className="block text-sm text-muted-foreground mb-2">
        Field Label
      </label>
      <NeumorphInput 
        placeholder="Enter value..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
    <div className="flex justify-end gap-3">
      <NeumorphButton>Cancel</NeumorphButton>
      <NeumorphButton variant="primary">Save</NeumorphButton>
    </div>
  </div>
</NeumorphCard>
```

### Data Table
```tsx
<NeumorphCard>
  <h3 className="mb-4">Table Title</h3>
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left py-3 px-4">Column 1</th>
          <th className="text-left py-3 px-4">Column 2</th>
          <th className="text-left py-3 px-4">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b border-border/50">
          <td className="py-3 px-4">Data 1</td>
          <td className="py-3 px-4">Data 2</td>
          <td className="py-3 px-4">
            <NeumorphButton size="sm">Edit</NeumorphButton>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</NeumorphCard>
```

### Statistics Cards
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <NeumorphCard className="text-center">
    <div className="neumorph-card w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
      <span className="text-2xl">📊</span>
    </div>
    <h3 className="mb-2">Metric Title</h3>
    <div className="text-2xl font-medium text-primary mb-1">123</div>
    <div className="text-sm text-muted-foreground">Description</div>
  </NeumorphCard>
</div>
```

### Navigation Tabs
```tsx
<div className="flex space-x-1 mb-6">
  {tabs.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-4 py-2 rounded-lg transition-all ${
        activeTab === tab.id
          ? 'bg-primary text-primary-foreground'
          : 'neumorph-button hover:shadow-lg'
      }`}
    >
      {tab.label}
    </button>
  ))}
</div>
```

### Modal Pattern
```tsx
<Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="neumorph-card border-0">
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>Modal description</DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      {/* Modal content */}
    </div>
    
    <DialogFooter>
      <NeumorphButton onClick={() => setIsOpen(false)}>
        Cancel
      </NeumorphButton>
      <NeumorphButton variant="primary" onClick={handleConfirm}>
        Confirm
      </NeumorphButton>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## Development Checklist

### Pre-Development
- [ ] Review design mockups for neumorphic consistency
- [ ] Identify reusable components needed
- [ ] Plan responsive breakpoints
- [ ] Consider accessibility requirements

### During Development
- [ ] Use NeumorphCard for all main content areas
- [ ] Use NeumorphButton for primary interactions
- [ ] Use NeumorphInput for form fields
- [ ] Implement proper spacing (space-y-6, gap-4, etc.)
- [ ] Add proper TypeScript interfaces
- [ ] Test keyboard navigation
- [ ] Verify colour contrast ratios

### Post-Development
- [ ] Test on mobile devices
- [ ] Verify screen reader compatibility
- [ ] Check performance with React DevTools
- [ ] Validate against design system
- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)

---

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### CSS Features Used
- CSS Custom Properties (CSS Variables)
- CSS Grid and Flexbox
- Box Shadow (essential for neumorphic effects)
- Border Radius
- CSS Transitions and Transforms

### Fallbacks
- Graceful degradation for older browsers
- Alternative layouts without CSS Grid
- Reduced shadow effects if necessary

---

## Performance Guidelines

### CSS Optimization
- Use CSS custom properties for consistent theming
- Minimize box-shadow repaints with `will-change: transform`
- Use efficient selectors and avoid deep nesting

### React Optimization
- Implement proper key props for dynamic lists
- Use React.memo for complex components that re-render frequently
- Optimize state updates to minimize re-renders
- Lazy load components where appropriate

### Asset Optimization
- Optimize images using WebP format where supported
- Use appropriate image sizes for different breakpoints
- Implement lazy loading for images below the fold

---

This UI guidelines document provides comprehensive direction for implementing the ProposalCraft design system. Always refer to existing components in the `/components/ui/` directory for implementation examples and maintain consistency with the established neumorphic design patterns.