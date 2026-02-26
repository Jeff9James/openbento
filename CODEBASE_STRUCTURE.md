# OpenBento Codebase Structure

This document provides an overview of the OpenBento codebase structure, including all directories, files, and their purposes.

## Project Root

```
openbento/
├── .github/                    # GitHub workflows and configuration
│   └── workflows/              # CI/CD workflows
│       └── ci.yml             # Continuous integration pipeline
├── components/                 # React components (main UI)
│   ├── docs/                  # Documentation components
│   │   └── DocsPage.tsx       # Documentation page
│   ├── AIGeneratorModal.tsx   # AI content generator modal
│   ├── AccountSettingsModal.tsx # User account settings
│   ├── AdBanner.tsx           # Advertisement banner component
│   ├── AnalyticsPage.tsx      # Analytics dashboard page
│   ├── AuthButton.tsx         # Authentication button
│   ├── AuthModal.tsx          # Authentication modal
│   ├── AvatarStyleModal.tsx   # Avatar customization modal
│   ├── Block.tsx              # Individual bento block component
│   ├── BlockPreview.tsx       # Block preview component
│   ├── Builder.tsx            # Main builder/editor component
│   ├── CustomDomainSettings.tsx # Custom domain configuration
│   ├── EditableWebsiteMode.tsx # Editable website mode
│   ├── EditorSidebar.tsx      # Editor sidebar with block options
│   ├── HelpModal.tsx          # Help/FAQ modal
│   ├── ImageCropModal.tsx     # Image cropping tool
│   ├── LandingPage.tsx        # Landing page component
│   ├── OnboardingWizard.tsx   # New user onboarding
│   ├── PreviewPage.tsx        # Preview bento page
│   ├── ProAnalyticsDashboard.tsx # Pro analytics dashboard
│   ├── ProGuard.tsx           # Pro feature guard
│   ├── ProUpgradeModal.tsx    # Pro upgrade modal
│   ├── ProfileDropdown.tsx    # User profile dropdown
│   ├── SettingsModal.tsx      # Global settings modal
│   ├── TemplateGallery.tsx    # Template gallery modal
│   ├── ThreeDBlock.tsx        # Three.js 3D block component
│   ├── UserDropdown.tsx       # User account dropdown
│   └── WebLLMModal.tsx        # WebLLM integration modal
├── docs/                      # Documentation directory
│   ├── CONTRIBUTING.md        # Contributing guidelines
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── TESTING.md             # Testing guide
│   ├── and BUGS.md            # Known issues and bugs
│   └── SECURITY.md            # Security documentation
├── hooks/                     # Custom React hooks
│   ├── useAnalytics.ts        # Analytics tracking hook
│   ├── useHistory.ts          # Undo/redo history hook
│   ├── useProFeatures.ts      # Pro features hook
│   └── useSaveStatus.ts       # Save status indicator hook
├── lib/                       # Library and utility files
│   ├── AuthContext.tsx        # Authentication context
│   └── supabaseClient.ts      # Supabase client configuration
├── public/                    # Static assets
│   ├── favicon.svg           # Site favicon
│   └── og-image.png          # Open Graph image
├── scripts/                   # Build and utility scripts
│   ├── generate-doc-routes.mjs # Generate documentation routes
│   └── supabase-analytics-init.mjs # Initialize Supabase analytics
├── services/                  # Service layer for business logic
│   ├── commonStyles.ts       # Common styles and utilities
│   ├── export.ts             # Export functionality (HTML, React project)
│   └── storageService.ts     # localStorage CRUD operations
├── supabase/                  # Supabase configuration
│   ├── functions/            # Edge functions (if any)
│   └── migrations/           # Database migrations
├── types/                     # TypeScript type definitions
│   └── index.ts              # Type definitions (BlockData, UserProfile, etc.)
├── utils/                     # Utility functions
│   ├── accessibility.ts      # Accessibility utilities
│   ├── imageUtils.ts         # Image processing utilities
│   └── validation.ts         # Input validation utilities
├── .dockerignore             # Docker ignore file
├── .env                     # Environment variables (local)
├── .env.example             # Environment variables template
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── ANALYTICS.md             # Analytics documentation
├── App.tsx                  # Main app component with routing
├── Caddyfile               # Caddy web server configuration
├── CODE_OF_CONDUCT.md      # Code of conduct
├── constants.ts            # App constants and configuration
├── Dockerfile              # Docker configuration
├── CONTRIBUTING.md         # Contributing guidelines
├── DEPLOYMENT.md           # Deployment guide
├── eslint.config.js        # ESLint configuration
├── index.html              # Main HTML file with meta tags
├── index.tsx               # Application entry point
├── LICENSE                 # License file
├── metadata.json           # Project metadata
├── package.json            # Project dependencies and scripts
├── README.md               # Main README
├── SECURITY.md             # Security documentation
├── socialPlatforms.ts      # Social platform configurations
├── TESTING.md             # Testing guide
├── tsconfig.json           # TypeScript configuration
├── types.ts               # TypeScript type definitions
├── utils.ts               # Utility functions
└── vite.config.ts         # Vite configuration
```

## Key Directories Explained

### `/components`
Contains all React components for the UI. Each component is typically a self-contained module.

**Main Components:**
- `Builder.tsx` - The main editor interface where users create and edit bento grids
- `Block.tsx` - Individual block components (links, text, media, etc.)
- `EditorSidebar.tsx` - Sidebar with block type options and editing tools
- `SettingsModal.tsx` - Global settings for colors, themes, avatar, etc.

**Modals:**
- `HelpModal.tsx` - Help and FAQ modal
- `AIGeneratorModal.tsx` - AI-powered content generator
- `TemplateGallery.tsx` - Pre-designed templates
- `AuthModal.tsx` - Authentication modal
- Various other feature-specific modals

### `/hooks`
Custom React hooks for reusable logic:
- `useAnalytics.ts` - Track page views and clicks
- `useHistory.ts` - Undo/redo functionality
- `useProFeatures.ts` - Pro feature detection and access control
- `useSaveStatus.ts` - Auto-save status indicator

### `/services`
Business logic and data operations:
- `storageService.ts` - localStorage CRUD operations for bentos
- `export.ts` - Export functionality (HTML, React project, ZIP, image)
- `commonStyles.ts` - Shared styles and utilities

### `/lib`
Library integrations:
- `AuthContext.tsx` - Authentication state management
- `supabaseClient.ts` - Supabase client configuration for analytics

### `/types`
TypeScript type definitions:
- `BlockData` - Block type and properties
- `UserProfile` - User profile data
- `BlockType` - Enum of all block types
- `SavedBento` - Saved bento structure
- And more...

### `/utils`
Helper functions:
- `accessibility.ts` - ARIA labels, focus management
- `imageUtils.ts` - Image processing, resizing, compression
- `validation.ts` - Input validation and sanitization

### `/public`
Static assets served directly:
- `favicon.svg` - Site icon
- `og-image.png` - Open Graph image for social sharing

### `/scripts`
Build and deployment scripts:
- `generate-doc-routes.mjs` - Generate routes for documentation
- `supabase-analytics-init.mjs` - Initialize Supabase analytics tables

### `/supabase`
Supabase backend configuration:
- `functions/` - Edge functions (future)
- `migrations/` - Database migrations for analytics

## File Responsibilities

### Entry Points

**`index.tsx`** - Application entry point, mounts React app to DOM

**`App.tsx`** - Main app component with routing logic:
- Landing page vs Builder
- Preview page routing (`/preview`)
- Analytics page routing (`/analytics`)
- Documentation routing (`/doc/*`)

### Core Components

**`Builder.tsx`** - Main editor (~1200 lines):
- Grid system (9x9)
- Block management (add, edit, delete, move, resize)
- Drag and drop
- Undo/redo
- Auto-save
- Settings integration
- Export functionality

**`Block.tsx`** - Individual block (~600 lines):
- Render different block types
- Block-specific editing
- Hover states and selection
- Delete confirmation

**`EditorSidebar.tsx`** - Sidebar (~500 lines):
- Block type list
- Block editor panel
- Property inputs
- Style controls

### Modal Components

All modals follow similar pattern:
- Open/close state
- Animation with Framer Motion
- Form inputs
- Save/cancel actions
- Accessibility features

### Configuration Files

**`vite.config.ts`** - Vite build configuration:
- Build optimizations
- Plugin configuration
- Supabase integration
- Code splitting

**`tsconfig.json`** - TypeScript configuration:
- Path aliases
- Compiler options
- Type checking

**`package.json`** - Dependencies and scripts:
- React, TypeScript, Vite
- UI libraries (Framer Motion, Tailwind)
- Feature libraries (Three.js, Chart.js, QR codes)
- Supabase, Stripe
- Build and development scripts

**`.env.example`** - Environment variable template:
- Supabase URL and keys
- Feature flags
- Configuration options

## Key Files Added in Phase 5

### New Components
1. **`HelpModal.tsx`** - Comprehensive help and FAQ modal with:
   - Searchable FAQ database
   - Category filtering
   - Keyboard navigation
   - Accessibility features
   - 25+ FAQ items covering all features

### New Documentation
1. **`DEPLOYMENT.md`** - Complete deployment guide:
   - Vercel, Netlify, GitHub Pages
   - Custom domain setup
   - Supabase analytics configuration
   - Stripe integration
   - PWA configuration
   - Environment variables
   - Troubleshooting

2. **`TESTING.md`** - Comprehensive testing guide:
   - Core features testing
   - Block types testing
   - Advanced features testing
   - Integration testing
   - Accessibility testing
   - Performance testing
   - Cross-browser testing
   - Mobile testing
   - Security testing
   - Bug reporting template

3. **`BUGS.md`** - Known issues and potential bugs:
   - Critical issues
   - High priority issues
   - Medium priority issues
   - Low priority issues
   - Browser-specific issues
   - Platform-specific issues
   - Edge cases
   - Performance issues
   - Security considerations
   - Fixes implemented status

### Enhanced Files
1. **`index.html`** - Enhanced with:
   - Complete SEO meta tags
   - Open Graph tags
   - Twitter Card tags
   - Structured data (JSON-LD)
   - PWA hints
   - Accessibility improvements
   - Skip to content link
   - Reduced motion support

## Data Flow

### User Interaction Flow
```
User Input → Component Event Handler → State Update → localStorage Persistence → UI Re-render
```

### Block Management Flow
```
Add Block → Create Block Data → Assign Grid Position → Render Block → Update Occupied Cells
```

### Save Flow
```
User Changes → Debounce Save → Serialize Data → localStorage → Show Save Status
```

### Export Flow
```
Export Click → Generate HTML/React Project → ZIP/Download → Deploy
```

### Analytics Flow
```
Page View/Click → Track Event → Send to Supabase → Store in Database → Display in Dashboard
```

## Architecture Patterns

### Component Composition
- Small, reusable components
- Props for configuration
- Event callbacks for actions
- Context for shared state

### State Management
- Local component state (useState)
- Context for global state (Auth, Pro features)
- Custom hooks for reusable logic
- localStorage for persistence

### Styling
- Tailwind CSS for utility classes
- Custom CSS for special cases
- Framer Motion for animations
- Inline styles for dynamic values

### Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support

### Performance
- Code splitting (lazy loading)
- Memoization (useMemo, useCallback)
- Debouncing (save operations)
- Virtual scrolling (large lists)
- Lazy loading (images)

## Integration Points

### Supabase
- Analytics tracking
- User authentication (optional)
- Data persistence (optional)

### Stripe
- Payment processing
- Subscription management (Pro features)

### Three.js
- 3D block rendering
- Interactive 3D models

### Chart.js
- Analytics charts
- Data visualization

### QR Code Generation
- qrcode.react library
- Customizable QR codes

## Deployment Architecture

### Build Process
```
Source → TypeScript → Vite Build → Dist → Deploy
```

### Static Export
```
Build → HTML/CSS/JS → Deploy to Static Hosting
```

### React Project Export
```
Template + User Data → ZIP → Download → Deploy React App
```

## Future Enhancements

### Potential Additions
- Real-time collaboration
- More block types
- Advanced analytics
- More 3D models
- Custom themes marketplace
- Plugin system
- API for integrations

### Technical Improvements
- Unit tests (Jest)
- E2E tests (Playwright)
- Performance monitoring
- Error tracking (Sentry)
- A/B testing framework
- Progressive enhancement

## Summary

OpenBento follows a clean, modular architecture with clear separation of concerns:
- **Components** for UI
- **Hooks** for reusable logic
- **Services** for business logic
- **Types** for type safety
- **Utils** for helper functions

The codebase is optimized for:
- Performance (lazy loading, code splitting)
- Accessibility (ARIA, keyboard navigation)
- SEO (meta tags, structured data)
- Developer experience (TypeScript, modern React)
- User experience (smooth animations, intuitive UI)

All core features are implemented with proper error handling, accessibility, and performance optimizations.
