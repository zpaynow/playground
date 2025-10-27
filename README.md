# ZPayNow Playground - UI Prototype

A modern, developer-focused frontend interface for the ZPayNow crypto payment gateway supporting x402 and 8004 protocols.

## Quick Start

Simply open `index.html` in your browser:

```bash
open index.html
# or
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Features

### Current Implementation (Phase 1: UI Layout)
- Modern dashboard layout with fixed sidebar and top bar
- Two-column playground interface (Request Builder + Response Viewer)
- Protocol selector tabs (x402 / 8004)
- JSON request/response viewers with syntax highlighting
- Transaction status timeline
- Light/Dark theme toggle
- Fully responsive (mobile-friendly)
- Glassmorphism effects
- Smooth animations and transitions

### Design Highlights
- **Color Scheme**: Teal accent (#0ea5a4) with balanced light/dark palettes
- **Typography**: Inter (UI) + Roboto Mono (code)
- **Style**: Minimalistic, developer-oriented, secure aesthetic
- **Framework**: TailwindCSS (CDN-based, no build required)

## File Structure

```
/playground
├── index.html       # Main prototype (open this in browser)
├── DESIGN.md        # Complete design system documentation
└── README.md        # This file
```

## Key Components

### Left Sidebar
- ZPayNow branding
- Navigation: Playground, Transactions, Settings, Docs
- Active state indicators

### Top Bar
- Network selector (Mainnet/Testnet/Custom)
- Connect Wallet button (UI only)
- Theme toggle (Light/Dark)

### Request Builder (Left Column)
- Protocol tabs (x402 / 8004)
- Template dropdown
- JSON editor placeholder
- Send/Clear action buttons

### Response Viewer (Right Column)
- Transaction status timeline
- JSON response viewer
- Copy as cURL button
- Gas fee and time estimates

## Theme System

Toggle between light and dark themes using the sun/moon icon in the top-right corner.

**Light Theme**: Clean, professional, high-contrast
**Dark Theme**: Developer-friendly, reduced eye strain

## Responsive Design

- **Desktop (≥1024px)**: Full two-column layout with visible sidebar
- **Mobile (<1024px)**: Stacked layout, collapsible sidebar with hamburger menu

## Customization

All customization can be done directly in `index.html`:

1. **Colors**: Edit `tailwind.config` in the `<script>` tag
2. **Content**: Modify HTML sections
3. **Fonts**: Replace Google Fonts links
4. **Layout**: Adjust Tailwind utility classes

## Next Phases

### Phase 2: Interactivity (Planned)
- Live JSON editing with validation
- Mock API requests
- Real-time status updates
- Form handling

### Phase 3: Integration (Planned)
- x402/8004 protocol implementation
- Wallet connection (MetaMask, WalletConnect)
- Backend API integration
- Transaction history

### Phase 4: Advanced Features (Planned)
- Additional protocol support
- Template library
- Code generation
- Export/import configurations

## Documentation

See `DESIGN.md` for complete design system documentation including:
- Color palette specifications
- Typography scale
- Component library
- Layout principles
- Accessibility guidelines
- Visual effects reference

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Responsive design

## Technology Stack

- **TailwindCSS 3.x**: Utility-first CSS framework (CDN)
- **Google Fonts**: Inter + Roboto Mono
- **Vanilla JavaScript**: Theme toggle and mobile menu
- **HTML5**: Semantic markup

## No Build Required

This prototype uses CDN-based TailwindCSS and requires no build process. It's ready for immediate viewing and integration into any framework (React, Vue, vanilla JS, etc.).

## Status

**Version**: 1.0.0 Beta
**Phase**: UI Layout & Visual Style (Complete)
**Backend**: Not yet integrated
**Interactivity**: Placeholder only

---

**Note**: This is a static UI prototype. All buttons, forms, and interactions are visual placeholders. No actual payment processing or blockchain integration is implemented yet.

For questions or feedback, please refer to the design documentation in `DESIGN.md`.
