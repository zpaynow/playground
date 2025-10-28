# ZPayNow Playground - UI Prototype

A modern, developer-focused frontend interface for the ZPayNow crypto payment gateway supporting x402 and 8004 protocols.

## Quick Start

### Local Development

The project is deployed using Cloudflare Workers. For local development:

```bash
# Install dependencies
npm install

# Start local development server
npx wrangler dev

# Visit http://localhost:8787
```

### Deployment

```bash
# Deploy to Cloudflare Workers
npx wrangler deploy
```

### Configuration

Edit `wrangler.toml` to configure your deployment:

```toml
name = "zpaynow-playground-server"
main = "index.js"
compatibility_date = "2024-03-20"

[vars]
APIKEY = "your-apikey"
SERVICE = "https://api.zpaynow.com"
```

**Environment Variables:**
- `APIKEY`: Your ZPayNow API key for authenticating with the payment service
- `SERVICE`: ZPayNow API service endpoint (default: https://api.zpaynow.com)

## Features

### Current Implementation
**UI Components:**
- Modern dashboard layout with fixed sidebar and top bar
- Two-column playground interface (Request Builder + Response Viewer)
- Protocol selector tabs (x402 / 8004)
- JSON request/response viewers with syntax highlighting
- Transaction status timeline
- Light/Dark theme toggle
- Fully responsive (mobile-friendly)
- Glassmorphism effects
- Smooth animations and transitions

**Backend Integration:**
- Cloudflare Workers serverless architecture
- ZPayNow API integration for payment processing
- x402 protocol support (requirements & payments)
- Payment session management
- Webhook handling
- CORS-enabled API endpoints
- Static asset serving with Cloudflare Workers Assets

### Design Highlights
- **Color Scheme**: Teal accent (#0ea5a4) with balanced light/dark palettes
- **Typography**: Inter (UI) + Roboto Mono (code)
- **Style**: Minimalistic, developer-oriented, secure aesthetic
- **Framework**: TailwindCSS (CDN-based, no build required)

## File Structure

```
/playground
├── index.js         # Cloudflare Worker (API proxy + static file serving)
├── wrangler.toml    # Cloudflare Workers configuration
├── package.json     # Dependencies
├── payment.html     # Payment UI (default route)
├── x402.html        # x402 Protocol playground
├── 8004.html        # 8004 Protocol playground
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

### Phase 2: Enhanced Interactivity (Planned)
- Live JSON editing with validation
- Real-time status updates
- Enhanced form handling
- Transaction history UI

### Phase 3: Advanced Features (Planned)
- Enhanced wallet connection (MetaMask, WalletConnect)
- Additional protocol support (8004 full implementation)
- Template library
- Code generation
- Export/import configurations

### Phase 4: Developer Tools (Planned)
- API testing suite
- Webhook testing
- Analytics dashboard
- Developer documentation portal

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

### Frontend
- **TailwindCSS 3.x**: Utility-first CSS framework (CDN)
- **Google Fonts**: Inter + Roboto Mono
- **Vanilla JavaScript**: Theme toggle and mobile menu
- **HTML5**: Semantic markup

### Backend
- **Cloudflare Workers**: Serverless edge computing platform
- **Cloudflare Workers Assets**: Static file hosting
- **ZPayNow API**: Payment processing backend

## Backend Architecture

The Cloudflare Worker serves as both a static file server and an API proxy:

### API Endpoints

**Payment Session Management:**
- `POST /products` - Create a payment session for a product
- `GET /sessions/:id` - Fetch payment session status
- `POST /webhook` - Handle payment webhooks

**x402 Protocol:**
- `POST /x402/requirements` - Get payment requirements
- `POST /x402/payments` - Submit payment

**UI Routes:**
- `/` - Payment interface (payment.html)
- `/x402` - x402 Protocol playground (x402.html)
- `/8004` - 8004 Protocol playground (8004.html)

All API endpoints include CORS headers for cross-origin requests.

## No Build Required

The frontend uses CDN-based TailwindCSS and requires no build process. The Cloudflare Worker is deployed as-is with Wrangler CLI.

## Status

**Version**: 2.0.0
**Phase**: Backend Integration (Complete)
**Backend**: Cloudflare Worker with ZPayNow API proxy
**Deployment**: Production-ready on Cloudflare Workers

---

**Note**: The application is now fully integrated with the ZPayNow API for payment processing. The Cloudflare Worker handles API routing, CORS, and static file serving.

For questions or feedback, please refer to the design documentation in `DESIGN.md`.
