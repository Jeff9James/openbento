import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Search,
  Check,
  Loader2,
  Coffee,
  ShoppingBag,
  Scissors,
  Palette,
  Utensils,
  Store,
  Sparkles,
} from 'lucide-react';
import { BlockData, BlockType, UserProfile, SiteData } from '../types';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: SiteData) => void;
}

interface Template {
  id: string;
  name: string;
  category: 'retail' | 'food' | 'services' | 'creative';
  description: string;
  preview?: string;
  data: SiteData;
}

const CATEGORY_CONFIG = {
  retail: { label: 'Retail', icon: ShoppingBag, color: 'bg-blue-500' },
  food: { label: 'Food & Drink', icon: Coffee, color: 'bg-orange-500' },
  services: { label: 'Services', icon: Scissors, color: 'bg-purple-500' },
  creative: { label: 'Creative', icon: Palette, color: 'bg-pink-500' },
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const createTemplate = (
  name: string,
  category: Template['category'],
  description: string,
  profile: Partial<UserProfile>,
  blocks: Partial<BlockData>[]
): Template => ({
  id: generateId(),
  name,
  category,
  description,
  data: {
    profile: {
      name: profile.name || 'My Business',
      bio: profile.bio || 'Welcome to our store!',
      avatarUrl: profile.avatarUrl || 'https://picsum.photos/200/200',
      theme: 'light',
      primaryColor: 'blue',
      showBranding: true,
      socialAccounts: profile.socialAccounts || [],
      ...profile,
    },
    blocks: blocks.map((b, index) => ({
      id: generateId(),
      type: b.type || BlockType.LINK,
      title: b.title || '',
      content: b.content || '',
      subtext: b.subtext,
      colSpan: b.colSpan || 3,
      rowSpan: b.rowSpan || 3,
      gridColumn: b.gridColumn || (index % 3) * 3 + 1,
      gridRow: b.gridRow || Math.floor(index / 3) * 3 + 1,
      color: b.color || 'bg-white',
      textColor: b.textColor || 'text-gray-900',
      ...b,
    })),
  },
});

const TEMPLATES: Template[] = [
  // RETAIL TEMPLATES (25+)
  ...Array.from({ length: 25 }, (_, i) => {
    const retailNames = [
      'Fashion Boutique', 'Electronics Store', 'Book Shop', 'Jewelry Store', 'Gift Shop',
      'Home Decor', 'Sports Store', 'Toy Store', 'Pet Shop', 'Garden Center',
      'Antique Shop', 'Vintage Store', 'Art Gallery', 'Music Store', 'Camera Shop',
      'Shoe Store', 'Watch Shop', 'Flower Shop', 'Stationery', 'Hardware Store',
      'Furniture Store', 'Kitchen Store', 'Baby Store', 'Outdoor Gear', 'Thrift Store'
    ];
    const colors = ['bg-rose-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'];
    return createTemplate(
      retailNames[i],
      'retail',
      `Professional template for ${retailNames[i].toLowerCase()}`,
      {
        name: retailNames[i],
        bio: `Welcome to ${retailNames[i]}! Quality products, great prices.`,
        primaryColor: colors[i % colors.length].replace('bg-', ''),
      },
      [
        { type: BlockType.LINK, title: 'Shop Now', content: '#shop', color: colors[i % colors.length], textColor: 'text-white', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1 },
        { type: BlockType.RATING, title: 'Customer Reviews', ratingValue: 4.7 + (i % 3) * 0.1, ratingCount: 150 + i * 10, color: 'bg-yellow-50', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1 },
        { type: BlockType.LINK, title: 'New Arrivals', content: '#new', color: 'bg-gray-100', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 4 },
        { type: BlockType.LINK, title: 'Best Sellers', content: '#best', color: 'bg-gray-900', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 4 },
        { type: BlockType.MAP_EMBED, title: 'Visit Us', mapAddress: '123 Main Street', mapShowDirections: true, colSpan: 4, rowSpan: 4, gridColumn: 7, gridRow: 4 },
        { type: BlockType.QR_CODE, title: 'Scan for Deals', qrLabel: 'Get 10% off!', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 7 },
        { type: BlockType.SOCIAL, title: 'Instagram', socialPlatform: 'instagram', socialHandle: 'shop', color: 'bg-pink-500', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 7 },
        { type: BlockType.LINK, title: 'Contact', content: '#contact', subtext: 'Get in touch', color: 'bg-gray-100', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 8 },
      ]
    );
  }),

  // FOOD TEMPLATES (25+)
  ...Array.from({ length: 25 }, (_, i) => {
    const foodNames = [
      'Coffee Shop', 'Bakery', 'Pizzeria', 'Sushi Bar', 'Burger Joint',
      'Ice Cream Parlor', 'Tea House', 'Wine Bar', 'Smoothie Bar', 'Food Truck',
      'Diner', 'Cafe', 'Restaurant', 'Pub', 'Taco Stand',
      'Sandwich Shop', 'Dessert Shop', 'Juice Bar', 'Grill', 'Seafood Restaurant',
      'Vegan Cafe', 'BBQ Joint', 'Noodle House', 'Brunch Spot', 'Tapas Bar'
    ];
    const colors = ['bg-orange-500', 'bg-red-500', 'bg-amber-500', 'bg-emerald-500', 'bg-rose-500'];
    return createTemplate(
      foodNames[i],
      'food',
      `Tasty template for ${foodNames[i].toLowerCase()}`,
      {
        name: foodNames[i],
        bio: `Delicious food & drinks at ${foodNames[i]}. Come visit us!`,
        primaryColor: colors[i % colors.length].replace('bg-', ''),
      },
      [
        { type: BlockType.LINK, title: 'Our Menu', content: '#menu', color: colors[i % colors.length], textColor: 'text-white', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1 },
        { type: BlockType.RATING, title: 'Reviews', ratingValue: 4.6 + (i % 4) * 0.1, ratingCount: 200 + i * 15, color: 'bg-yellow-50', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1 },
        { type: BlockType.LINK, title: 'Order Online', content: '#order', color: 'bg-gray-900', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 4 },
        { type: BlockType.LINK, title: 'Reservations', content: '#reserve', color: 'bg-gray-100', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 4 },
        { type: BlockType.MAP_EMBED, title: 'Find Us', mapAddress: '456 Food Street', mapShowDirections: true, colSpan: 3, rowSpan: 6, gridColumn: 7, gridRow: 4 },
        { type: BlockType.QR_CODE, title: 'Digital Menu', qrLabel: 'Scan to view', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 7 },
        { type: BlockType.SOCIAL, title: 'Instagram', socialPlatform: 'instagram', socialHandle: foodNames[i].toLowerCase().replace(' ', ''), color: 'bg-gradient-to-br from-orange-400 to-rose-500', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 7 },
      ]
    );
  }),

  // SERVICES TEMPLATES (25+)
  ...Array.from({ length: 25 }, (_, i) => {
    const serviceNames = [
      'Hair Salon', 'Spa & Wellness', 'Fitness Center', 'Dental Clinic', 'Law Firm',
      'Accounting Firm', 'Real Estate', 'Insurance Agency', 'Travel Agency', 'Pet Grooming',
      'Auto Repair', 'Plumbing Service', 'Electrician', 'Cleaning Service', 'Moving Company',
      'Photography Studio', 'Wedding Planner', 'Event Planner', 'Catering Service', 'Tutoring Center',
      'Yoga Studio', 'Massage Therapy', 'Chiropractor', 'Veterinary Clinic', 'IT Services'
    ];
    const colors = ['bg-purple-500', 'bg-blue-500', 'bg-teal-500', 'bg-indigo-500', 'bg-cyan-500'];
    return createTemplate(
      serviceNames[i],
      'services',
      `Professional template for ${serviceNames[i].toLowerCase()}`,
      {
        name: serviceNames[i],
        bio: `Expert ${serviceNames[i].toLowerCase()} services. Quality guaranteed.`,
        primaryColor: colors[i % colors.length].replace('bg-', ''),
      },
      [
        { type: BlockType.LINK, title: 'Book Now', content: '#book', color: colors[i % colors.length], textColor: 'text-white', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1 },
        { type: BlockType.RATING, title: 'Client Reviews', ratingValue: 4.8 + (i % 2) * 0.1, ratingCount: 100 + i * 8, color: 'bg-yellow-50', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1 },
        { type: BlockType.LINK, title: 'Our Services', content: '#services', color: 'bg-gray-100', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 4 },
        { type: BlockType.LINK, title: 'About Us', content: '#about', color: 'bg-gray-900', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 4 },
        { type: BlockType.MAP_EMBED, title: 'Our Location', mapAddress: '789 Service Ave', mapShowDirections: true, colSpan: 3, rowSpan: 6, gridColumn: 7, gridRow: 4 },
        { type: BlockType.QR_CODE, title: 'Contact Card', qrLabel: 'Save our info', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 7 },
        { type: BlockType.SOCIAL, title: 'LinkedIn', socialPlatform: 'linkedin', socialHandle: 'company', color: 'bg-blue-600', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 7 },
      ]
    );
  }),

  // CREATIVE TEMPLATES (25+)
  ...Array.from({ length: 25 }, (_, i) => {
    const creativeNames = [
      'Artist Portfolio', 'Photographer', 'Designer Studio', 'Music Producer', 'Writer',
      'Illustrator', 'Animator', 'Video Editor', 'Voice Actor', 'Dancer',
      'Actor Portfolio', 'Model Portfolio', 'Fashion Designer', 'Graphic Designer', 'UX Designer',
      'Architect', 'Interior Designer', 'Tattoo Artist', 'Makeup Artist', 'Pottery Studio',
      'Glass Artist', 'Sculptor', 'Painter Studio', 'Digital Artist', 'Content Creator'
    ];
    const colors = ['bg-pink-500', 'bg-violet-500', 'bg-fuchsia-500', 'bg-rose-500', 'bg-purple-500'];
    return createTemplate(
      creativeNames[i],
      'creative',
      `Creative template for ${creativeNames[i].toLowerCase()}`,
      {
        name: creativeNames[i],
        bio: `Creative work by ${creativeNames[i]}. Let's create something amazing together.`,
        primaryColor: colors[i % colors.length].replace('bg-', ''),
      },
      [
        { type: BlockType.LINK, title: 'Portfolio', content: '#work', color: colors[i % colors.length], textColor: 'text-white', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1 },
        { type: BlockType.RATING, title: 'Testimonials', ratingValue: 4.9, ratingCount: 50 + i * 5, color: 'bg-yellow-50', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1 },
        { type: BlockType.LINK, title: 'Hire Me', content: '#hire', color: 'bg-gray-900', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 4 },
        { type: BlockType.LINK, title: 'Blog', content: '#blog', color: 'bg-gray-100', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 4 },
        { type: BlockType.QR_CODE, title: 'My Portfolio', qrLabel: 'Scan to view', colSpan: 3, rowSpan: 6, gridColumn: 7, gridRow: 4 },
        { type: BlockType.SOCIAL, title: 'Instagram', socialPlatform: 'instagram', socialHandle: creativeNames[i].toLowerCase().replace(' ', ''), color: 'bg-gradient-to-br from-purple-500 to-pink-500', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 1, gridRow: 7 },
        { type: BlockType.SOCIAL, title: 'Behance', socialPlatform: 'custom', socialHandle: 'behance.net/artist', color: 'bg-blue-600', textColor: 'text-white', colSpan: 3, rowSpan: 3, gridColumn: 4, gridRow: 7 },
      ]
    );
  }),
];

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onApplyTemplate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const filteredTemplates = TEMPLATES.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyTemplate = async (template: Template) => {
    setIsApplying(true);
    setSelectedTemplate(template);
    
    // Simulate a brief delay for UX feedback
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    onApplyTemplate(template.data);
    setIsApplying(false);
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Template Gallery</h2>
                <p className="text-sm text-gray-500 mt-1">
                  {filteredTemplates.length} templates available
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Search & Filters */}
            <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    !selectedCategory
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {Object.entries(CATEGORY_CONFIG).map(([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCategory(key)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedCategory === key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <config.icon size={14} />
                    {config.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Template Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredTemplates.map((template) => (
                  <motion.div
                    key={template.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-violet-300 transition-all cursor-pointer"
                    onClick={() => handleApplyTemplate(template)}
                  >
                    {/* Preview */}
                    <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-50 relative overflow-hidden">
                      {/* Mini grid preview */}
                      <div className="absolute inset-3 grid grid-cols-3 grid-rows-3 gap-1">
                        {template.data.blocks.slice(0, 6).map((block, idx) => (
                          <div
                            key={idx}
                            className={`rounded ${
                              block.color?.includes('gradient')
                                ? block.color
                                : block.color || 'bg-gray-200'
                            } ${block.textColor === 'text-white' ? 'opacity-90' : 'opacity-70'}`}
                          />
                        ))}
                      </div>
                      
                      {/* Category badge */}
                      <div className="absolute top-2 left-2">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-semibold text-white ${
                          CATEGORY_CONFIG[template.category].color
                        }`}>
                          {CATEGORY_CONFIG[template.category].label}
                        </span>
                      </div>

                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        {isApplying && selectedTemplate?.id === template.id ? (
                          <div className="flex items-center gap-2 text-white">
                            <Loader2 className="animate-spin" size={20} />
                            <span className="font-medium">Applying...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-white">
                            <Check size={20} />
                            <span className="font-medium">Use Template</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {filteredTemplates.length === 0 && (
                <div className="text-center py-12">
                  <Sparkles className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500">No templates found matching your search.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <p className="text-sm text-gray-500">
                <span className="font-medium">Tip:</span> Click any template to apply it to your page
              </p>
              <div className="flex items-center gap-2">
                <Store size={16} className="text-gray-400" />
                <Utensils size={16} className="text-gray-400" />
                <Scissors size={16} className="text-gray-400" />
                <Palette size={16} className="text-gray-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TemplateGallery;
