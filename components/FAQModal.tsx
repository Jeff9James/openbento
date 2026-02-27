import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X, MessageCircle, ChevronDown, ChevronUp, Search, ExternalLink } from 'lucide-react';
import { Tooltip } from 'react-tooltip';

interface FAQItem {
  question: string;
  answer: string;
  category: 'getting-started' | 'blocks' | 'publishing' | 'pro' | 'account';
}

const FAQ_DATA: FAQItem[] = [
  {
    category: 'getting-started',
    question: 'How do I create my first bento?',
    answer: 'Click the "+" button in the sidebar to add a new block. Choose from different block types like Links, Social, Media, or Text. Drag blocks to position them on the grid, and click any block to edit its content.',
  },
  {
    category: 'getting-started',
    question: 'How do I change my profile picture?',
    answer: 'Click on your avatar/name area at the top of the builder. You can upload a new image, crop it, and choose from different styles (circle, square, rounded corners) with optional borders and shadows.',
  },
  {
    category: 'getting-started',
    question: 'How do I save my work?',
    answer: 'Your work is automatically saved to your browser\'s local storage. You can also use the Save button or export your bento as a JSON file for backup. Create multiple bentos using the menu in the top-left.',
  },
  {
    category: 'blocks',
    question: 'What block types are available?',
    answer: 'OpenBento offers: Links (for URLs), Text (for descriptions), Media (images/videos), Social (social media links), YouTube, Maps (embedded Google Maps), Ratings (Google reviews), QR Codes, Spacers, and Pro features like 3D rooms and charts.',
  },
  {
    category: 'blocks',
    question: 'How do I add a QR code?',
    answer: 'Add a new block and select "QR Code". Enter the URL or text you want to encode. You can enable a download button and add a label. The QR code updates automatically as you type.',
  },
  {
    category: 'blocks',
    question: 'Can I embed a Google Map?',
    answer: 'Yes! Add a "Map Embed" block. Paste a Google Maps embed URL (from Share > Embed on Google Maps). You can also enable a "Get Directions" button that opens directions in a new tab.',
  },
  {
    category: 'blocks',
    question: 'How do I add a YouTube video?',
    answer: 'Add a YouTube block and paste a video URL or channel URL. You can choose between showing a single video, a grid of videos, or a list from your channel.',
  },
  {
    category: 'publishing',
    question: 'How do I publish my bento?',
    answer: 'Click the "Export" button in the toolbar. You can download a complete React project, deploy directly to Vercel, or use the generated static files with any hosting provider.',
  },
  {
    category: 'publishing',
    question: 'Can I use a custom domain?',
    answer: 'Yes! After exporting, you can connect your custom domain through Vercel, Netlify, or any hosting provider. Go to Settings > Custom Domain in the export options for detailed instructions.',
  },
  {
    category: 'publishing',
    question: 'How does the preview work?',
    answer: 'Click the "Eye" icon to preview how your bento looks. The preview shows your actual page without the editor interface. You can also view mobile and desktop layouts.',
  },
  {
    category: 'pro',
    question: 'What is OpenBento Pro?',
    answer: 'Pro unlocks advanced features: 3D room views with Three.js, analytics dashboards, custom HTML/CSS blocks, chart blocks, unlimited bentos, priority support, and no ads. Visit the Pro page to upgrade.',
  },
  {
    category: 'pro',
    question: 'How do I enable analytics?',
    answer: 'Go to Settings > Analytics tab. You can connect a free Supabase project to track page views, clicks, referrers, and more. Follow the step-by-step setup wizard to configure your analytics.',
  },
  {
    category: 'account',
    question: 'Do I need an account?',
    answer: 'No! OpenBento is privacy-first and works without an account. All your data stays in your browser. Optionally, you can sign in with Google or email to sync across devices and access Pro features.',
  },
  {
    category: 'account',
    question: 'How do I import a template?',
    answer: 'Click the "Templates" button in the toolbar to browse pre-made bento layouts. Choose one you like and it will be imported into your current project. You can customize everything after importing.',
  },
];

interface FAQModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FAQModal: React.FC<FAQModalProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['getting-started']);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const categories = [
    { id: 'getting-started', label: 'Getting Started', icon: '🚀' },
    { id: 'blocks', label: 'Blocks & Content', icon: '📦' },
    { id: 'publishing', label: 'Publishing', icon: '🌐' },
    { id: 'pro', label: 'Pro Features', icon: '⭐' },
    { id: 'account', label: 'Account & Templates', icon: '👤' },
  ];

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId]
    );
  };

  const toggleItem = (index: number) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const filteredFAQ = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedFAQ = categories.reduce((acc, cat) => {
    acc[cat.id] = filteredFAQ.filter((item) => item.category === cat.id);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, y: '-45%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, y: '-45%' }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="faq-modal-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <HelpCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 id="faq-modal-title" className="text-xl font-bold text-gray-900">
                    Help Center
                  </h2>
                  <p className="text-sm text-gray-500">Frequently asked questions</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close help center"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  aria-label="Search help articles"
                />
              </div>
            </div>

            {/* FAQ Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {searchQuery ? (
                // Show flat list when searching
                <div className="space-y-3">
                  {filteredFAQ.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p>No results found for "{searchQuery}"</p>
                      <p className="text-sm mt-2">Try different keywords</p>
                    </div>
                  ) : (
                    filteredFAQ.map((item, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => toggleItem(index)}
                          className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          aria-expanded={expandedItems.has(index)}
                        >
                          <span className="font-medium text-gray-900">{item.question}</span>
                          {expandedItems.has(index) ? (
                            <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        <AnimatePresence>
                          {expandedItems.has(index) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                                {item.answer}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                // Show grouped by category
                categories.map((category) => {
                  const items = groupedFAQ[category.id];
                  if (items.length === 0) return null;

                  return (
                    <div key={category.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => toggleCategory(category.id)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors bg-gray-50/50"
                        aria-expanded={expandedCategories.includes(category.id)}
                      >
                        <span className="font-semibold text-gray-900 flex items-center gap-2">
                          <span>{category.icon}</span> {category.label}
                        </span>
                        {expandedCategories.includes(category.id) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      <AnimatePresence>
                        {expandedCategories.includes(category.id) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="divide-y divide-gray-100">
                              {items.map((item, idx) => {
                                const globalIndex = FAQ_DATA.indexOf(item);
                                return (
                                  <div key={idx}>
                                    <button
                                      onClick={() => toggleItem(globalIndex)}
                                      className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                                      aria-expanded={expandedItems.has(globalIndex)}
                                    >
                                      <span className="text-gray-700">{item.question}</span>
                                      {expandedItems.has(globalIndex) ? (
                                        <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                      )}
                                    </button>
                                    <AnimatePresence>
                                      {expandedItems.has(globalIndex) && (
                                        <motion.div
                                          initial={{ height: 0, opacity: 0 }}
                                          animate={{ height: 'auto', opacity: 1 }}
                                          exit={{ height: 0, opacity: 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <div className="px-4 pb-4 text-gray-600 leading-relaxed">
                                            {item.answer}
                                          </div>
                                        </motion.div>
                                      )}
                                    </AnimatePresence>
                                  </div>
                                );
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t bg-gray-50">
              <p className="text-sm text-gray-500 text-center">
                Still need help?{' '}
                <a
                  href="https://github.com/openbento/openbento/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline inline-flex items-center gap-1"
                >
                  Submit an issue <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Help Chat Bubble Component - Can be placed in corner of screen
export const HelpChatBubble: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <>
      <motion.button
        onClick={onClick}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-lg flex items-center justify-center z-30 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-tooltip-id="help-bubble-tooltip"
        data-tooltip-content="Get help & FAQ"
        aria-label="Open help center"
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
      <Tooltip id="help-bubble-tooltip" place="left" />
    </>
  );
};

export default FAQModal;
