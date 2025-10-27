# ZPayNow Playground - Design System Documentation

## Overview
Modern, developer-focused UI for the ZPayNow Playground crypto payment gateway. This design emphasizes clarity, precision, and trust with a minimalistic aesthetic.

---

## Color Palette

### Primary Colors
- **Primary Teal**: `#0ea5a4` - Main brand color, used for active states and CTAs
- **Accent Teal**: `#14b8a6` - Hover states and secondary highlights
- **Gradient**: `from-primary to-accent` - Used on primary buttons and brand elements

### Light Theme
- **Background**: `#f8fafc` (slate-50)
- **Card Background**: `#ffffff` (white)
- **Text Primary**: `#1e293b` (slate-800)
- **Text Secondary**: `#64748b` (slate-500)
- **Border**: `#e2e8f0` (slate-200)

### Dark Theme
- **Background**: `#1e293b` (slate-900)
- **Card Background**: `#1e293b` (slate-800)
- **Text Primary**: `#ffffff` (white)
- **Text Secondary**: `#94a3b8` (slate-400)
- **Border**: `#334155` (slate-700)

### Code/Terminal Colors
- **Background**: `#0f172a` (slate-900) / `#000000` (black in dark mode)
- **Text**: `#cbd5e1` (slate-300)
- **Keywords**: `#14b8a6` (accent - for JSON keys)
- **Strings**: `#fbbf24` (yellow-400)
- **Numbers**: `#c084fc` (purple-400)
- **Punctuation**: `#64748b` (slate-500)

---

## Typography

### Font Families
- **UI/Interface**: `'Inter', sans-serif` - Clean, modern sans-serif for all UI elements
- **Code/Monospace**: `'Roboto Mono', monospace` - For JSON, code blocks, and technical data

### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Size Scale
- **Headings**:
  - H1: `text-lg` (18px) - Sidebar logo
  - H2: `text-lg` (18px) - Card headers
  - H3: `text-base` (16px) - Section headers
- **Body**: `text-sm` (14px) - Default text size
- **Small**: `text-xs` (12px) - Labels, metadata
- **Code**: `text-sm` (14px) - Monospace content

---

## Layout Structure

### Sidebar (Fixed Left)
- Width: `240px` (w-60)
- Fixed position
- Collapses on mobile (< 1024px)
- Contains: Logo, Navigation, Footer

### Top Bar (Fixed Top)
- Height: `64px` (h-16)
- Glassmorphism effect with backdrop blur
- Semi-transparent background
- Contains: Network selector, Connect Wallet, Theme toggle

### Main Content
- Left margin: `240px` (ml-60) on desktop
- Padding: `24px` (p-6)
- Two-column grid on XL screens
- Stacks vertically on mobile/tablet

### Cards
- Border radius: `12px` (rounded-xl)
- Shadow: `shadow-sm` with subtle borders
- Padding: `24px` (p-6)
- Hover effect: Lift with increased shadow

---

## Components

### Navigation Items
- Padding: `px-4 py-3`
- Border radius: `rounded-lg`
- Active state: `bg-primary/10 text-primary`
- Hover: Slight translateX animation
- Icons: Emoji (24px equivalent)

### Buttons

#### Primary Button
```html
<button class="px-5 py-3 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-semibold hover:shadow-lg">
  Send Request
</button>
```

#### Secondary Button
```html
<button class="px-5 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg font-medium hover:bg-slate-200 dark:hover:bg-slate-600">
  Clear
</button>
```

### Form Elements
- Input/Select padding: `px-4 py-2`
- Border radius: `rounded-lg`
- Border: `border-slate-300 dark:border-slate-600`
- Focus ring: `focus:ring-2 focus:ring-primary`

### Code Blocks
- Background: `bg-slate-900` (light mode) / `bg-black` (dark mode)
- Padding: `p-4`
- Border radius: `rounded-lg`
- Font: `font-mono text-sm`
- Syntax highlighting with semantic colors

---

## Visual Effects

### Transitions
- Duration: `0.2s` (200ms)
- Easing: `ease-in-out`
- Applied to: colors, transforms, shadows

### Glassmorphism (Top Bar)
```css
backdrop-filter: blur(10px);
background: rgba(255, 255, 255, 0.8); /* Light mode */
background: rgba(30, 41, 59, 0.8);    /* Dark mode */
```

### Shadows
- Default: `shadow-sm` - Subtle card elevation
- Hover: `shadow-lg` - Increased depth on interaction
- Values: Low-contrast, soft edges

### Hover Effects
- Cards: `translateY(-2px)` with shadow increase
- Nav items: `translateX(4px)` slide
- Buttons: Shadow increase, no transform

### Animations
- Theme toggle icons: Swap visibility
- Pulse effect: Used on "pending" status indicator
- Smooth transitions on all interactive elements

---

## Responsive Behavior

### Breakpoints
- **Mobile**: < 1024px
  - Sidebar hidden by default (translate-x-full)
  - Single column layout
  - Mobile menu button visible
  - No left margin on main content

- **Desktop**: >= 1024px
  - Sidebar always visible
  - Two-column grid layout
  - Mobile menu button hidden
  - Left margin on main content

### Mobile Sidebar
- Slides in from left
- Dark overlay on background
- Tap overlay to close
- Hamburger menu in top bar

---

## Theme System

### Implementation
```javascript
// Toggle between light/dark
html.classList.toggle('dark');
```

### Icon Swap
- Sun icon: Visible in dark mode
- Moon icon: Visible in light mode
- Uses `dark:block` and `dark:hidden` utilities

### Color Adaptation
All colors use Tailwind's `dark:` variant to automatically adapt:
```html
<div class="bg-white dark:bg-slate-800 text-slate-800 dark:text-white">
```

---

## Accessibility

### Focus States
- All interactive elements have visible focus rings
- Ring color: `ring-primary` (teal)
- Ring width: `ring-2`

### Color Contrast
- Light theme: Dark text on light backgrounds (WCAG AA+)
- Dark theme: Light text on dark backgrounds (WCAG AA+)
- Code blocks: High contrast syntax highlighting

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- Semantic navigation element
- Button elements for all clickable actions
- Label associations for form inputs

---

## Usage Instructions

### Viewing the Prototype
1. Open `index.html` in any modern browser
2. Toggle between light/dark themes using the top-right button
3. Resize browser to test responsive behavior
4. On mobile, use hamburger menu to access sidebar

### Customization
1. **Colors**: Edit the `tailwind.config` in the `<script>` tag
2. **Fonts**: Replace Google Fonts links in `<head>`
3. **Content**: Modify the HTML content directly
4. **Layout**: Adjust Tailwind classes on container elements

### Integration
This prototype uses:
- TailwindCSS (CDN) - For styling
- Google Fonts - For typography
- Vanilla JavaScript - For theme toggle and mobile menu

No build process required. Ready for immediate integration with React, Vue, or vanilla JS.

---

## File Structure
```
/playground
  ├── index.html      # Main prototype file
  └── DESIGN.md       # This documentation
```

---

## Next Steps

### Phase 2: Interactivity
- JSON editor with syntax highlighting
- Form validation
- API request simulation
- Real-time transaction updates

### Phase 3: Integration
- Connect to actual x402/8004 protocols
- Wallet integration (MetaMask, WalletConnect)
- Backend API connection
- Transaction history persistence

### Phase 4: Enhancement
- Additional protocol support
- Advanced templates
- Code generation
- Export/import configurations

---

## Design Principles

1. **Developer-First**: Code blocks, technical precision, monospace clarity
2. **Minimalist**: No unnecessary decoration, focus on functionality
3. **Trust & Security**: Professional aesthetic, clear status indicators
4. **Accessibility**: High contrast, keyboard navigation, screen reader friendly
5. **Performance**: Lightweight, fast transitions, optimized rendering

---

## Credits
- Design System: ZPayNow Team
- Framework: TailwindCSS
- Fonts: Inter (UI), Roboto Mono (Code)
- Icons: Heroicons (SVG), Emoji (Navigation)

---

**Version**: 1.0.0 Beta
**Last Updated**: 2024-10-26
**Status**: Static Prototype (No Backend Integration)
