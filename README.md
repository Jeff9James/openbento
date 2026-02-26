# OpenBento

**A beautiful, open-source bento grid generator for creating stunning link-in-bio pages**

[![Deploy to GitHub Pages](https://github.com/yoanbernabeu/openbento/actions/workflows/deploy.yml/badge.svg)](https://github.com/yoanbernabeu/openbento/actions/workflows/deploy.yml)
[![Docker Build & Publish](https://github.com/yoanbernabeu/openbento/actions/workflows/docker-publish.yml/badge.svg)](https://github.com/yoanbernabeu/openbento/actions/workflows/docker-publish.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Docker Pulls](https://img.shields.io/docker/pulls/yoanbernabeu/openbento)](https://hub.docker.com/r/yoanbernabeu/openbento)

[Live Demo](https://yoanbernabeu.github.io/openbento/) • [Report Bug](https://github.com/yoanbernabeu/openbento/issues) • [Request Feature](https://github.com/yoanbernabeu/openbento/issues)

---

## ✨ Features

### 🧱 Block Types (10+ types)

- 🔗 **Links** - Clickable links with titles & subtitles
- 🖼️ **Media** - Images & GIFs with position control
- 📺 **YouTube** - Single video, grid, or list mode
- 📝 **Text** - Notes, quotes, and bio sections
- 🌐 **Social Icons** - 26+ platforms with branded colors
- 📍 **Maps** - Interactive Google Maps embed with directions
- ⭐ **Ratings** - Google Business rating embed
- 📱 **QR Codes** - Generate QR codes for any URL
- ⬜ **Spacer** - Empty blocks for layout control
- 🎲 **3D Blocks (Pro)** - Interactive Three.js 3D models
- 📊 **Analytics Charts (Pro)** - Visual data visualization
- 🔧 **Custom HTML (Pro)** - Embed any custom code

### 🎨 Core Features

- 🖱️ **Visual Drag & Drop** - Intuitive 9×9 grid editor. Drag, resize, and position blocks freely with real-time preview
- 🎭 **Full Customization** - Colors, gradients, custom backgrounds. Avatars with borders, shadows & multiple shapes
- 📦 **Export to React** - Download a complete Vite + React + TypeScript + Tailwind project, ready to deploy
- 🚀 **Multi-Platform Deploy** - Auto-generated configs for Vercel, Netlify, GitHub Pages, Docker, VPS & Heroku
- 🔒 **Privacy First** - No tracking, no account, no server required. All data stays in your browser localStorage
- 📁 **Multiple Bentos** - Save and manage multiple projects locally. Switch between them instantly
- 🤖 **AI Generator** - Generate bento content with AI (Gemini)
- 📋 **Template Gallery** - Pre-designed templates for quick starts
- ♿ **Accessibility** - Full keyboard navigation, ARIA labels, screen reader support
- 🔍 **Help & FAQ** - Built-in searchable help center

### 📊 Optional Analytics

Track visits with your own Supabase instance:
- Page views & unique visitors
- Referrer tracking
- Self-hosted on your Supabase project
- No third-party cookies or trackers
- Admin dashboard included

See [ANALYTICS.md](ANALYTICS.md) for setup instructions.

### ⌨️ Keyboard Shortcuts

- `Ctrl/Cmd + Z` - Undo
- `Ctrl/Cmd + Y` or `Shift + Z` - Redo
- `Ctrl/Cmd + S` - Force save
- `Ctrl/Cmd + E` - Export
- `Ctrl/Cmd + P` - Preview
- `Escape` - Close modals
- `Tab` - Navigate between blocks
- `Arrow keys` - Move selected block
- `Delete/Backspace` - Delete selected block

### 📚 Documentation

- 🚀 **[Deployment Guide](DEPLOYMENT.md)** - Complete guide for deploying to Vercel, Netlify, GitHub Pages, and more
- 🧪 **[Testing Guide](TESTING.md)** - Comprehensive testing instructions for all features
- 🐛 **[Known Issues](BUGS.md)** - Known bugs, potential issues, and workarounds
- 📖 **[Codebase Structure](CODEBASE_STRUCTURE.md)** - Overview of the codebase architecture
- 🔒 **[Security](SECURITY.md)** - Security best practices and considerations

### 🌐 26+ Social Platforms Supported

X (Twitter), Instagram, TikTok, YouTube, GitHub, GitLab, LinkedIn, Facebook, Twitch, Dribbble, Medium, Dev.to, Reddit, Pinterest, Threads, Bluesky, Mastodon, Substack, Patreon, Ko-fi, Buy Me a Coffee, Snapchat, Discord, Telegram, WhatsApp, and custom links.

### 🛠️ Tech Stack

**OpenBento Builder:**
- **React 19** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Framer Motion** for smooth animations
- **Lucide React** & **React Icons** for icons
- **React Tooltip** for helpful tooltips
- **React Helmet Async** for SEO meta tags
- **QRCode.react** for QR code generation
- **Three.js & @react-three/fiber** for 3D blocks
- **Chart.js** for analytics visualization
- **Supabase JS** for analytics backend (optional)
- **Stripe JS** for payments (optional)

**Exported Project:**
All the above plus: **Vite**, **TypeScript**, **Tailwind CSS**, deployment configs

## 🎉 Phase 5 Updates

### New Features
- ✅ **Help Modal** - Comprehensive searchable FAQ with 25+ topics
- ✅ **Enhanced Accessibility** - ARIA labels, keyboard navigation, screen reader support
- ✅ **SEO Optimization** - Complete meta tags, Open Graph, Twitter Cards, structured data
- ✅ **PWA Hints** - Manifest and service worker hints for mobile app experience
- ✅ **Performance Optimizations** - Code splitting, lazy loading, image optimization

### Documentation
- 📚 **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment for Vercel, Netlify, GitHub Pages, with Supabase and Stripe setup
- 🧪 **[Testing Guide](TESTING.md)** - Comprehensive testing instructions for all features, accessibility, and performance
- 🐛 **[Known Issues](BUGS.md)** - Documented bugs, edge cases, and fixes
- 📖 **[Codebase Structure](CODEBASE_STRUCTURE.md)** - Complete codebase overview and architecture

### Improvements
- 🎯 Better tooltips throughout the app
- 🔍 Skip to content link for keyboard users
- ♿ Reduced motion support for users with vestibular disorders
- 📱 Enhanced mobile touch targets
- 🚀 Optimized bundle size and load times

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yoanbernabeu/openbento.git
   cd openbento
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Landing Page (Optional)

By default, the app opens directly on the builder (no landing page) to make self-hosting easier.

To enable the landing page:
```bash
VITE_ENABLE_LANDING=true npm run dev
```

For production builds:
```bash
VITE_ENABLE_LANDING=true npm run build
```

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 🐳 Using Docker

OpenBento is available as a multi-platform Docker image supporting both AMD64 and ARM64 architectures (Intel/AMD servers, Mac M1/M2/M3, ARM servers, Raspberry Pi 4+).

### Quick Start with Docker

Pull and run the latest image:

```bash
docker run -d -p 8080:80 yoanbernabeu/openbento:latest
```

Then open [http://localhost:8080](http://localhost:8080) in your browser.

### Multi-Platform Support

The Docker image supports multiple architectures:
- **linux/amd64** - Intel/AMD 64-bit (standard servers, PCs)
- **linux/arm64** - ARM 64-bit (Mac M1/M2/M3, AWS Graviton, Raspberry Pi 4+)

Docker automatically selects the correct image for your architecture.

### Building Your Own Image

```bash
# Build for your current platform
docker build -t openbento .

# Build for multiple platforms
docker buildx build --platform linux/amd64,linux/arm64 -t openbento .
```

### Docker Compose

Create a `compose.yml`:

```yaml
services:
  openbento:
    image: yoanbernabeu/openbento:latest
    ports:
      - "8080:80"
    restart: unless-stopped
```

Run with:

```bash
docker compose up -d
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) and [Code of Conduct](CODE_OF_CONDUCT.md) before submitting a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

**Yoan Bernabeu**

- GitHub: [@yoanbernabeu](https://github.com/yoanbernabeu)
- Twitter: [@yOyO38](https://twitter.com/yOyO38)

**Anis AYARI**

- GitHub: [@anisayari](https://github.com/anisayari)
- X: [@DFintelligence](https://x.com/DFintelligence)

---

<div align="center">
Made with ❤️ by the open-source community
</div>
