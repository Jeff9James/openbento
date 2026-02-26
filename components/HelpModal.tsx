import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  X,
  ChevronRight,
  Search,
  Layout,
  MousePointer2,
  Download,
  Share2,
  Settings,
  Sparkles,
  Globe,
  BarChart3,
  Smartphone,
  Monitor,
  Shield,
  CreditCard,
  Database,
  Zap,
  Clock,
  FileText,
  Palette,
  Image,
  Video,
  MapPin,
  Star,
  QrCode,
  Box,
  Cpu,
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
  category: string;
  keywords: string[];
}

const faqData: FAQItem[] = [
  {
    id: 'getting-started',
    question: 'How do I get started?',
    answer: 'Welcome to OpenBento! Start by clicking the "Add Block" button in the sidebar to add content to your bento grid. You can add links, text, images, social media icons, maps, ratings, QR codes, and more. Drag blocks to rearrange them, and customize colors and styles in the Settings panel.',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'Getting Started',
    keywords: ['beginner', 'start', 'first', 'new', 'how'],
  },
  {
    id: 'add-blocks',
    question: 'How do I add content blocks?',
    answer: 'Click the "Add Block" button in the left sidebar and select the type of content you want to add: Link, Text, Image, Social Icon, Map, Rating, QR Code, or Spacer. Each block type has specific options that you can customize in the editor panel.',
    icon: <Layout className="w-5 h-5" />,
    category: 'Getting Started',
    keywords: ['add', 'block', 'content', 'insert', 'create'],
  },
  {
    id: 'move-blocks',
    question: 'How do I move and resize blocks?',
    answer: 'Click and hold on any block to drag it to a new position. To resize, use the resize handles that appear when you hover over a block. Blocks automatically snap to a 9-column grid for perfect alignment.',
    icon: <MousePointer2 className="w-5 h-5" />,
    category: 'Editing',
    keywords: ['move', 'resize', 'drag', 'arrange', 'position', 'size'],
  },
  {
    id: 'customize-style',
    question: 'How do I customize colors and styles?',
    answer: 'Open the Settings panel (gear icon) to customize your bento\'s appearance. You can change background colors, add gradients, customize avatar styles, adjust spacing, and more. All changes are saved automatically.',
    icon: <Palette className="w-5 h-5" />,
    category: 'Customization',
    keywords: ['color', 'style', 'design', 'theme', 'custom', 'personalize'],
  },
  {
    id: 'add-image',
    question: 'How do I add images or videos?',
    answer: 'Add a Media block and either upload an image file or paste an image URL. You can also add YouTube videos by pasting the video URL. The image cropper tool lets you adjust and crop images to fit your design perfectly.',
    icon: <Image className="w-5 h-5" />,
    category: 'Media',
    keywords: ['image', 'photo', 'picture', 'video', 'youtube', 'upload', 'media'],
  },
  {
    id: 'add-map',
    question: 'How do I add a map?',
    answer: 'Add a Map block and enter a location (address, business name, or landmark). You can customize the map type (roadmap, satellite, terrain), zoom level, and enable directions. Perfect for brick-and-mortar businesses!',
    icon: <MapPin className="w-5 h-5" />,
    category: 'Media',
    keywords: ['map', 'location', 'address', 'directions', 'google maps', 'place'],
  },
  {
    id: 'add-rating',
    question: 'How do I add Google ratings?',
    answer: 'Add a Rating block and enter your Google Business Profile name or place ID. It will display your star rating, review count, and link directly to your Google reviews page. Great for building trust!',
    icon: <Star className="w-5 h-5" />,
    category: 'Media',
    keywords: ['rating', 'review', 'star', 'google', 'feedback', 'trust'],
  },
  {
    id: 'add-qr',
    question: 'How do I add a QR code?',
    answer: 'Add a QR Code block and enter the URL you want to encode. You can customize the QR code colors and add your logo. Visitors can scan the code with their phone camera to visit your link instantly.',
    icon: <QrCode className="w-5 h-5" />,
    category: 'Media',
    keywords: ['qr', 'code', 'scan', 'barcode', 'mobile', 'phone'],
  },
  {
    id: 'add-social',
    question: 'How do I add social media links?',
    answer: 'Add Social Icon blocks for each platform you use. Enter your username (without the @) and the icon will link directly to your profile. We support 26+ platforms including Instagram, TikTok, YouTube, Twitter/X, and more.',
    icon: <Share2 className="w-5 h-5" />,
    category: 'Social',
    keywords: ['social', 'instagram', 'facebook', 'twitter', 'tiktok', 'link', 'connect'],
  },
  {
    id: 'preview',
    question: 'How do I preview my bento?',
    answer: 'Click the Preview button (eye icon) to see how your bento looks on both desktop and mobile. Use the toggle at the top to switch between views. This helps ensure your design looks great on all devices.',
    icon: <Monitor className="w-5 h-5" />,
    category: 'Preview & Export',
    keywords: ['preview', 'view', 'see', 'check', 'look', 'mobile', 'desktop'],
  },
  {
    id: 'export',
    question: 'How do I export or publish my bento?',
    answer: 'Click the Export button to download your bento as a complete React project, HTML file, or image. You can deploy the React project to Vercel, Netlify, or any hosting service. You can also export as a ZIP file for backup.',
    icon: <Download className="w-5 h-5" />,
    category: 'Preview & Export',
    keywords: ['export', 'download', 'publish', 'deploy', 'host', 'save', 'backup'],
  },
  {
    id: 'save',
    question: 'How is my data saved?',
    answer: 'Your bento data is automatically saved to your browser\'s localStorage. This means your data stays on your device and is private. You can also download your bento as a JSON file for backup or to share with others.',
    icon: <Database className="w-5 h-5" />,
    category: 'Data & Privacy',
    keywords: ['save', 'storage', 'local', 'browser', 'privacy', 'data', 'backup'],
  },
  {
    id: 'multiple-bentos',
    question: 'Can I create multiple bento pages?',
    answer: 'Yes! Click on the profile dropdown (top right) to see all your saved bento pages. You can create new ones, switch between them, rename, and delete. Each bento is stored independently in your browser.',
    icon: <Box className="w-5 h-5" />,
    category: 'Data & Privacy',
    keywords: ['multiple', 'pages', 'create', 'switch', 'manage', 'list', 'separate'],
  },
  {
    id: 'undo-redo',
    question: 'Can I undo changes?',
    answer: 'Yes! Use keyboard shortcuts Ctrl+Z (Windows) or Cmd+Z (Mac) to undo, and Ctrl+Y or Cmd+Shift+Z to redo. You can also find undo/redo buttons in the settings panel. History is saved for up to 50 actions.',
    icon: <Clock className="w-5 h-5" />,
    category: 'Editing',
    keywords: ['undo', 'redo', 'back', 'revert', 'history', 'mistake', 'error'],
  },
  {
    id: 'ai-generator',
    question: 'How does the AI generator work?',
    answer: 'Click the AI button (sparkle icon) to let AI generate content for you. Enter a prompt like "Create a personal portfolio" or "Design a business profile" and AI will create blocks with suggested content. You can then customize everything to your liking.',
    icon: <Sparkles className="w-5 h-5" />,
    category: 'AI Features',
    keywords: ['ai', 'generator', 'auto', 'magic', 'smart', 'gemini', 'generate'],
  },
  {
    id: 'templates',
    question: 'How do I use templates?',
    answer: 'Click the Templates button to browse pre-designed bento layouts. Templates are organized by category (Personal, Business, Creator, etc.). Click on a template to apply it instantly - your current blocks will be replaced.',
    icon: <Layout className="w-5 h-5" />,
    category: 'Templates',
    keywords: ['template', 'preset', 'design', 'example', 'ready-made', 'quick'],
  },
  {
    id: 'analytics',
    question: 'How do I view analytics?',
    answer: 'Click the Analytics button to see page views, clicks, and referrers. Basic analytics use localStorage. For advanced analytics, connect Supabase to get detailed insights, export reports, and view data over time. Requires a Supabase account.',
    icon: <BarChart3 className="w-5 h-5" />,
    category: 'Analytics',
    keywords: ['analytics', 'stats', 'statistics', 'views', 'clicks', 'data', 'insights'],
  },
  {
    id: 'supabase',
    question: 'How do I set up Supabase analytics?',
    answer: '1. Create a free account at supabase.com\n2. Create a new project\n3. Go to Project Settings > API\n4. Copy your project URL and anon key\n5. In OpenBento, go to Settings > Analytics\n6. Enter your Supabase URL and key\n7. Run the setup script to create tables\n\nSee ANALYTICS.md for detailed instructions.',
    icon: <Database className="w-5 h-5" />,
    category: 'Analytics',
    keywords: ['supabase', 'setup', 'configure', 'database', 'advanced analytics', 'backend'],
  },
  {
    id: 'pro-features',
    question: 'What are the Pro features?',
    answer: 'Pro features include:\n• Advanced analytics dashboard with charts\n• 3D room view blocks (Three.js)\n• Custom HTML/CSS blocks\n• Analytics chart blocks\n• Priority support\n• Remove ads\n\nPro is optional - all core features are free forever!',
    icon: <Cpu className="w-5 h-5" />,
    category: 'Pro Features',
    keywords: ['pro', 'premium', 'paid', 'upgrade', 'subscription', 'features', 'plus'],
  },
  {
    id: '3d-blocks',
    question: 'How do I use 3D blocks?',
    answer: '3D blocks let you create interactive 3D room views using Three.js. Add a 3D block and customize the room layout, colors, and objects. Users can rotate and zoom the 3D view. Great for showcasing spaces, products, or creating immersive experiences.',
    icon: <Box className="w-5 h-5" />,
    category: 'Pro Features',
    keywords: ['3d', 'three', 'threejs', 'room', 'immersive', 'interactive'],
  },
  {
    id: 'custom-domain',
    question: 'Can I use a custom domain?',
    answer: 'Yes! When you export your bento as a React project, you can deploy it to any hosting service with a custom domain. Vercel, Netlify, and GitHub Pages all support custom domains. Check the deployment guide for step-by-step instructions.',
    icon: <Globe className="w-5 h-5" />,
    category: 'Deployment',
    keywords: ['domain', 'custom', 'url', 'vercel', 'netlify', 'deploy', 'hosting'],
  },
  {
    id: 'stripe',
    question: 'How do I integrate Stripe?',
    answer: 'For payment integration, export your bento as a React project and add Stripe components. You can use Stripe Checkout links, Payment Links, or the full Stripe SDK. See the deployment guide for examples of adding payment buttons to your bento.',
    icon: <CreditCard className="w-5 h-5" />,
    category: 'Deployment',
    keywords: ['stripe', 'payment', 'checkout', 'buy', 'sell', 'ecommerce', 'money'],
  },
  {
    id: 'pwa',
    question: 'Can I make it a PWA (mobile app)?',
    answer: 'Yes! Export as a React project and add a PWA manifest and service worker. The exported project includes instructions for setting up PWA functionality, including app icons, splash screens, and offline support. Install on mobile like a native app!',
    icon: <Smartphone className="w-5 h-5" />,
    category: 'Deployment',
    keywords: ['pwa', 'app', 'mobile', 'install', 'native', 'offline'],
  },
  {
    id: 'keyboard',
    question: 'What keyboard shortcuts are available?',
    answer: 'Ctrl/Cmd + Z: Undo\nCtrl/Cmd + Y / Shift+Z: Redo\nCtrl/Cmd + S: Save\nCtrl/Cmd + E: Export\nCtrl/Cmd + P: Preview\nEscape: Close modals\nTab: Navigate between blocks\nArrow keys: Move selected block\nDelete/Backspace: Delete selected block',
    icon: <Zap className="w-5 h-5" />,
    category: 'Tips & Tricks',
    keywords: ['keyboard', 'shortcut', 'hotkey', 'fast', 'quick', 'keys', 'commands'],
  },
  {
    id: 'privacy',
    question: 'Is my data private?',
    answer: 'Absolutely! All data is stored locally in your browser. We don\'t collect, store, or share your personal information. No account required. When you use Supabase analytics, data goes to your own Supabase project that you control.',
    icon: <Shield className="w-5 h-5" />,
    category: 'Privacy',
    keywords: ['privacy', 'private', 'secure', 'safe', 'data', 'tracking', 'anonymous'],
  },
  {
    id: 'troubleshooting',
    question: 'Something\'s not working. What should I do?',
    answer: '1. Try refreshing the page\n2. Clear your browser cache and try again\n3. Check browser console for errors (F12)\n4. Try a different browser\n5. Export your data as JSON for backup\n6. Report issues on GitHub with detailed steps\n\nMost issues are resolved by clearing cache.',
    icon: <HelpCircle className="w-5 h-5" />,
    category: 'Troubleshooting',
    keywords: ['error', 'problem', 'issue', 'bug', 'broken', 'fix', 'help', 'support'],
  },
];

const categories = ['All', 'Getting Started', 'Editing', 'Customization', 'Media', 'Social', 'Preview & Export', 'Data & Privacy', 'AI Features', 'Templates', 'Analytics', 'Pro Features', 'Deployment', 'Tips & Tricks', 'Privacy', 'Troubleshooting'];

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HelpModal({ isOpen, onClose }: HelpModalProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <>
      {/* Floating Help Button */}
      <button
        onClick={() => onClose()}
        data-tooltip-id="help-button"
        data-tooltip-content="Get help & answers"
        className="fixed bottom-6 right-6 z-40 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-indigo-300"
        aria-label="Open help"
        aria-haspopup="dialog"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
      <Tooltip id="help-button" place="left" />

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              aria-hidden="true"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[800px] md:max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col"
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-modal-title"
              onKeyDown={handleKeyDown}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <HelpCircle className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 id="help-modal-title" className="text-2xl font-bold text-gray-900">
                    Help Center
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  aria-label="Close help"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="p-6 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search for help... (try 'export', 'add block', 'ai')"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-base"
                    aria-label="Search help topics"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="px-6 pt-4 border-b border-gray-200">
                <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar" role="tablist">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      role="tab"
                      aria-selected={selectedCategory === category}
                      aria-controls={`faq-panel-${category}`}
                      className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        selectedCategory === category
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* FAQ List */}
              <div className="flex-1 overflow-y-auto p-6" role="tabpanel" id="faq-panel">
                {filteredFAQs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">No results found</p>
                    <p className="text-sm mt-2">Try different keywords or browse categories</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredFAQs.map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-xl overflow-hidden transition-all duration-200 hover:border-indigo-300 hover:shadow-md"
                      >
                        <button
                          onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                          className="w-full flex items-start gap-4 p-4 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                          aria-expanded={expandedItem === item.id}
                          aria-controls={`faq-answer-${item.id}`}
                        >
                          <div className="mt-1 text-indigo-600 flex-shrink-0">{item.icon}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-3">
                              <p className="font-semibold text-gray-900 pr-8">{item.question}</p>
                              <ChevronRight
                                className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform flex-shrink-0 ${
                                  expandedItem === item.id ? 'rotate-90' : ''
                                }`}
                              />
                            </div>
                            <span className="inline-block mt-2 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                              {item.category}
                            </span>
                          </div>
                        </button>
                        <AnimatePresence>
                          {expandedItem === item.id && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              id={`faq-answer-${item.id}`}
                              role="region"
                              aria-labelledby={`faq-question-${item.id}`}
                            >
                              <div className="px-4 pb-4 pt-2 ml-12 text-gray-700 leading-relaxed whitespace-pre-line">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" />
                    <span>Still need help? Check the docs or report on GitHub</span>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href="/docs"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      Documentation
                    </a>
                    <a
                      href="https://github.com/cactus-compute/openbento/issues"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      GitHub Issues
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
