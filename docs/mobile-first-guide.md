# Mobile-First Development Guide

## Overview

This guide outlines our approach to mobile-first development for the My Face Coach application. Mobile-first means designing and developing for the smallest screens first, then progressively enhancing the experience for larger screens.

## Core Principles

1. **Design for mobile first**
   - Start with the smallest screen size
   - Focus on core content and functionality
   - Progressively enhance for larger screens

2. **Progressive enhancement**
   - Add features and complexity as screen size increases
   - Don't hide critical functionality on mobile
   - Use responsive breakpoints to enhance, not degrade

3. **Performance focus**
   - Optimize for mobile networks and devices
   - Minimize initial load size
   - Lazy load non-critical resources

## Tailwind CSS Implementation

### Breakpoint Strategy

Our mobile-first approach uses Tailwind's responsive prefixes:

```
Base (mobile): No prefix
Tablet: md: (768px and up)
Desktop: lg: (1024px and up)
Large Desktop: xl: (1280px and up)
Extra Large: 2xl: (1536px and up)
```

### Writing Mobile-First CSS

```jsx
// ❌ Desktop-first (avoid this)
<div className="flex-row md:flex-col">
  {/* Desktop: side by side, Mobile: stacked */}
</div>

// ✅ Mobile-first (do this)
<div className="flex-col md:flex-row">
  {/* Mobile: stacked, Desktop: side by side */}
</div>
```

### Common Patterns

#### Layout Structure

```jsx
// Mobile: Full width, stacked
// Desktop: Sidebar + main content
<div className="flex flex-col lg:flex-row">
  <aside className="w-full lg:w-64 lg:shrink-0">
    {/* Sidebar content */}
  </aside>
  <main className="flex-1">
    {/* Main content */}
  </main>
</div>
```

#### Card Layouts

```jsx
// Mobile: Single column
// Tablet: Two columns
// Desktop: Three or four columns
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {/* Cards */}
</div>
```

#### Typography

Our typography system is already mobile-first with fluid sizing:

```jsx
// Headings automatically scale based on viewport
<H1>This scales from mobile to desktop</H1>

// For manual control:
<h2 className="text-xl md:text-2xl lg:text-3xl">Heading</h2>
```

#### Spacing

```jsx
// Compact on mobile, more spacious on larger screens
<div className="p-4 md:p-6 lg:p-8">
  {/* Content */}
</div>
```

#### Navigation

- Mobile: Bottom navigation bar
- Desktop: Sidebar navigation
- Both are implemented and shown/hidden based on screen size

## Component Templates

We've created mobile-first component templates to use as starting points:

- `MobileFirstCard`: A card component with mobile-first design
- `MobileFirstLayout`: A page layout template with mobile-first principles

## Testing

1. **Always test mobile first**
   - Start development with mobile viewport
   - Test on actual mobile devices when possible
   - Use Chrome DevTools device emulation

2. **Test across breakpoints**
   - Check how the UI adapts at each breakpoint
   - Ensure no content is lost or functionality broken

3. **Performance testing**
   - Test load times on throttled connections
   - Monitor bundle sizes
   - Use Lighthouse for mobile performance scores

## Resources

- [Tailwind Responsive Design](https://tailwindcss.com/docs/responsive-design)
- [MDN Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)
- [Google Mobile-First Indexing](https://developers.google.com/search/mobile-sites/mobile-first-indexing)

## Implementation Checklist

When creating new components or pages:

- [ ] Design mobile layout first
- [ ] Write base styles for mobile (no breakpoint prefixes)
- [ ] Add tablet adaptations with `md:` prefix
- [ ] Add desktop adaptations with `lg:` prefix
- [ ] Test on multiple viewport sizes
- [ ] Ensure all functionality works on mobile
- [ ] Check performance on throttled connections 