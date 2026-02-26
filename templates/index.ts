import { BentoTemplate, TemplateCategory, BlockType } from '../types';

export const TEMPLATE_CATEGORIES: { id: TemplateCategory; label: string; description: string }[] = [
  { id: 'retail', label: 'Retail', description: 'Shops & stores' },
  { id: 'food', label: 'Food & Drink', description: 'Restaurants & cafes' },
  { id: 'services', label: 'Services', description: 'Professional services' },
  { id: 'creative', label: 'Creative', description: 'Artists & designers' },
  { id: 'personal', label: 'Personal', description: 'Personal brands' },
  { id: 'business', label: 'Business', description: 'Corporate & B2B' },
];

const genId = () => 'block_' + Math.random().toString(36).substr(2, 9);

// Helper to create a simple profile
const createProfile = (name: string, bio: string, theme: 'light' | 'dark' = 'light', primaryColor: string = 'blue') => ({
  name,
  bio,
  avatarUrl: '',
  theme,
  primaryColor,
  showBranding: true,
  socialAccounts: [] as any[],
});

// Helper to create a link block
const linkBlock = (title: string, url: string, colSpan: number, rowSpan: number, gridCol: number, gridRow: number, color: string, textColor: string = 'text-white') => ({
  id: genId(), type: BlockType.LINK as const, title, content: url, colSpan, rowSpan, gridColumn: gridCol, gridRow, color, textColor,
});

// Helper to create a social block
const socialBlock = (title: string, platform: string, handle: string, colSpan: number, rowSpan: number, gridCol: number, gridRow: number, color: string = 'bg-gray-100') => ({
  id: genId(), type: BlockType.SOCIAL as const, title, content: '', colSpan, rowSpan, gridColumn: gridCol, gridRow, color, socialPlatform: platform as any, socialHandle: handle,
});

// Helper to create a map block
const mapBlock = (title: string, location: string, colSpan: number, rowSpan: number, gridCol: number, gridRow: number, showDirections: boolean = true) => ({
  id: genId(), type: BlockType.GOOGLE_MAP as const, title, content: location, colSpan, rowSpan, gridColumn: gridCol, gridRow, showGetDirections: showDirections,
});

// Helper to create a rating block
const ratingBlock = (colSpan: number, rowSpan: number, gridCol: number, gridRow: number, title?: string) => ({
  id: genId(), type: BlockType.GOOGLE_RATING as const, title: title || 'Rating', colSpan, rowSpan, gridColumn: gridCol, gridRow,
});

// Helper to create a QR block
const qrBlock = (title: string, url: string, colSpan: number, rowSpan: number, gridCol: number, gridRow: number, showDownload: boolean = true) => ({
  id: genId(), type: BlockType.QR_CODE as const, title, qrCodeUrl: url, colSpan, rowSpan, gridColumn: gridCol, gridRow, showQrDownload: showDownload,
});

// Helper to create a text block
const textBlock = (title: string, content: string, colSpan: number, rowSpan: number, gridCol: number, gridRow: number, color: string = 'bg-gray-50') => ({
  id: genId(), type: BlockType.TEXT as const, title, content, colSpan, rowSpan, gridColumn: gridCol, gridRow, color,
});

// ==================== RETAIL TEMPLATES ====================
export const retailTemplates: BentoTemplate[] = [
  // 1. Fashion Boutique
  {
    id: 'retail-boutique-1', name: 'Fashion Boutique', category: 'retail', description: 'Elegant boutique',
    profile: createProfile('Style Studio', 'Curated fashion', 'light', 'pink'),
    blocks: [
      linkBlock('Shop Now', 'https://example.com', 6, 3, 1, 1, 'bg-pink-500'),
      socialBlock('Instagram', 'instagram', 'stylestudio', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Visit Us', 'New York, NY', 4, 3, 1, 4, true),
      ratingBlock(2, 3, 5, 4),
      qrBlock('Scan to Visit', 'https://example.com', 3, 3, 7, 4),
    ],
  },
  // 2. Shoe Store
  {
    id: 'retail-shoes-1', name: 'Shoe Store', category: 'retail', description: 'Footwear shop',
    profile: createProfile('Sole Mates', 'Step in style', 'light', 'orange'),
    blocks: [
      linkBlock('Shop Shoes', 'https://example.com', 5, 3, 1, 1, 'bg-orange-500'),
      linkBlock('New Arrivals', 'https://example.com', 4, 3, 6, 1, 'bg-orange-400'),
      socialBlock('Instagram', 'instagram', 'solemates', 3, 3, 1, 4, 'bg-pink-100'),
      mapBlock('Store', 'Los Angeles, CA', 3, 3, 4, 4, true),
      qrBlock('Catalog', 'https://example.com', 3, 3, 7, 4),
    ],
  },
  // 3. Jewelry Store
  {
    id: 'retail-jewelry-1', name: 'Jewelry Store', category: 'retail', description: 'Fine jewelry',
    profile: createProfile('Gem & Gold', 'Luxury jewelry', 'light', 'yellow'),
    blocks: [
      linkBlock('View Collection', 'https://example.com', 9, 3, 1, 1, 'bg-yellow-600', 'text-white'),
      mapBlock('Boutique', 'Miami, FL', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 4. Bookstore
  {
    id: 'retail-books-1', name: 'Bookstore', category: 'retail', description: 'Books & more',
    profile: createProfile('Page Turner', 'Your literary destination', 'light', 'emerald'),
    blocks: [
      linkBlock('Browse Books', 'https://example.com', 4, 3, 1, 1, 'bg-emerald-600'),
      linkBlock('Events', 'https://example.com', 5, 3, 5, 1, 'bg-emerald-500'),
      socialBlock('Twitter', 'x', 'pageturner', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Join Club', 'https://example.com', 3, 3, 4, 4),
      mapBlock('Shop', 'Seattle, WA', 3, 3, 7, 4, true),
    ],
  },
  // 5. Pet Store
  {
    id: 'retail-pets-1', name: 'Pet Store', category: 'retail', description: 'Pet supplies',
    profile: createProfile('Paws & Claws', 'Everything for pets', 'light', 'amber'),
    blocks: [
      linkBlock('Shop Pet Food', 'https://example.com', 5, 3, 1, 1, 'bg-amber-600'),
      socialBlock('Instagram', 'instagram', 'pawsandclaws', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Store', 'Denver, CO', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 6. Electronics Store
  {
    id: 'retail-electronics-1', name: 'Electronics', category: 'retail', description: 'Gadgets & tech',
    profile: createProfile('Tech Hub', 'Latest gadgets', 'dark', 'blue'),
    blocks: [
      linkBlock('Shop Now', 'https://example.com', 6, 3, 1, 1, 'bg-blue-700', 'text-white'),
      socialBlock('Twitter', 'x', 'techhub', 3, 3, 7, 1, 'bg-gray-100'),
      mapBlock('Location', 'Austin, TX', 5, 3, 1, 4, true),
      qrBlock('Deals', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 7. Furniture Store
  {
    id: 'retail-furniture-1', name: 'Furniture', category: 'retail', description: 'Home furniture',
    profile: createProfile('Home Haven', 'Furnish your dreams', 'light', 'brown'),
    blocks: [
      linkBlock('View Catalog', 'https://example.com', 5, 3, 1, 1, 'bg-amber-800', 'text-white'),
      linkBlock('Design Services', 'https://example.com', 4, 3, 6, 1, 'bg-amber-700'),
      mapBlock('Showroom', 'Chicago, IL', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 8. Sports Store
  {
    id: 'retail-sports-1', name: 'Sports Store', category: 'retail', description: 'Athletic gear',
    profile: createProfile('Pro Sports', 'Gear up for victory', 'light', 'red'),
    blocks: [
      linkBlock('Shop Sports', 'https://example.com', 4, 3, 1, 1, 'bg-red-600'),
      linkBlock('Team Orders', 'https://example.com', 5, 3, 5, 1, 'bg-red-500'),
      socialBlock('Instagram', 'instagram', 'prosports', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('App', 'https://example.com', 3, 3, 4, 4),
      mapBlock('Store', 'Phoenix, AZ', 3, 3, 7, 4, true),
    ],
  },
  // 9. Beauty Store
  {
    id: 'retail-beauty-1', name: 'Beauty Store', category: 'retail', description: 'Beauty products',
    profile: createProfile('Glow Beauty', 'Beauty essentials', 'light', 'rose'),
    blocks: [
      linkBlock('Shop Beauty', 'https://example.com', 6, 3, 1, 1, 'bg-rose-500', 'text-white'),
      socialBlock('Instagram', 'instagram', 'glowbeauty', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Shop', 'San Diego, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 10. Toy Store
  {
    id: 'retail-toys-1', name: 'Toy Store', category: 'retail', description: 'Toys & games',
    profile: createProfile('Playtime Palace', 'Fun for all ages', 'light', 'purple'),
    blocks: [
      linkBlock('Shop Toys', 'https://example.com', 5, 3, 1, 1, 'bg-purple-500'),
      socialBlock('Instagram', 'instagram', 'playtimepalace', 4, 3, 6, 1, 'bg-pink-100'),
      qrBlock('Gift List', 'https://example.com', 3, 3, 1, 4),
      mapBlock('Store', 'Portland, OR', 3, 3, 4, 4, true),
      ratingBlock(3, 3, 7, 4),
    ],
  },
  // 11. Gift Shop
  {
    id: 'retail-gifts-1', name: 'Gift Shop', category: 'retail', description: 'Unique gifts',
    profile: createProfile('Gift Gallery', 'Perfect presents', 'light', 'teal'),
    blocks: [
      linkBlock('Browse Gifts', 'https://example.com', 6, 3, 1, 1, 'bg-teal-600'),
      linkBlock('Gift Cards', 'https://example.com', 3, 3, 7, 1, 'bg-teal-500'),
      mapBlock('Shop', 'Nashville, TN', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 12. Outdoor Store
  {
    id: 'retail-outdoor-1', name: 'Outdoor Store', category: 'retail', description: 'Camping & hiking',
    profile: createProfile('Trailblazer', 'Adventure gear', 'light', 'green'),
    blocks: [
      linkBlock('Shop Gear', 'https://example.com', 5, 3, 1, 1, 'bg-green-600'),
      linkBlock('Rentals', 'https://example.com', 4, 3, 6, 1, 'bg-green-500'),
      socialBlock('Instagram', 'instagram', 'trailblazer', 3, 3, 1, 4, 'bg-pink-100'),
      mapBlock('Shop', 'Boulder, CO', 6, 3, 4, 4, true),
    ],
  },
  // 13. Baby Store
  {
    id: 'retail-baby-1', name: 'Baby Store', category: 'retail', description: 'Baby products',
    profile: createProfile('Little Ones', 'Everything for baby', 'light', 'sky'),
    blocks: [
      linkBlock('Shop Baby', 'https://example.com', 9, 3, 1, 1, 'bg-sky-500', 'text-white'),
      mapBlock('Store', 'Boston, MA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 14. Health Store
  {
    id: 'retail-health-1', name: 'Health Store', category: 'retail', description: 'Natural health',
    profile: createProfile('Wellness Way', 'Natural health products', 'light', 'lime'),
    blocks: [
      linkBlock('Shop Supplements', 'https://example.com', 5, 3, 1, 1, 'bg-lime-600'),
      linkBlock('Wellness Tips', 'https://example.com', 4, 3, 6, 1, 'bg-lime-500'),
      mapBlock('Location', 'Portland, OR', 4, 3, 1, 4, true),
      qrBlock('Newsletter', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 15. Home Decor
  {
    id: 'retail-decor-1', name: 'Home Decor', category: 'retail', description: 'Home accessories',
    profile: createProfile('Cozy Corners', 'Style your space', 'light', 'stone'),
    blocks: [
      linkBlock('Shop Decor', 'https://example.com', 6, 3, 1, 1, 'bg-stone-600', 'text-white'),
      socialBlock('Pinterest', 'pinterest', 'cozycorners', 3, 3, 7, 1, 'bg-red-100'),
      mapBlock('Showroom', 'Atlanta, GA', 5, 3, 1, 4, true),
      ratingBlock(4, 3, 6, 4),
    ],
  },
  // 16. Florist
  {
    id: 'retail-florist-1', name: 'Florist', category: 'retail', description: 'Flowers & plants',
    profile: createProfile('Bloom Shop', 'Fresh flowers daily', 'light', 'pink'),
    blocks: [
      linkBlock('Order Flowers', 'https://example.com', 5, 3, 1, 1, 'bg-pink-500'),
      linkBlock('Weddings', 'https://example.com', 4, 3, 6, 1, 'bg-pink-400'),
      mapBlock('Shop', 'San Francisco, CA', 4, 3, 1, 4, true),
      qrBlock('Rewards', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 17. Thrift Store
  {
    id: 'retail-thrift-1', name: 'Thrift Store', category: 'retail', description: 'Vintage finds',
    profile: createProfile('Second Chance', 'Pre-loved treasures', 'light', 'gray'),
    blocks: [
      linkBlock('Shop Vintage', 'https://example.com', 5, 3, 1, 1, 'bg-gray-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'secondchance', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Store', 'Oakland, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 18. Chocolate Shop
  {
    id: 'retail-chocolate-1', name: 'Chocolate Shop', category: 'retail', description: 'Artisan chocolates',
    profile: createProfile('Cocoa Dreams', 'Handcrafted chocolates', 'light', 'amber'),
    blocks: [
      linkBlock('Shop Chocolates', 'https://example.com', 6, 3, 1, 1, 'bg-amber-700', 'text-white'),
      socialBlock('Instagram', 'instagram', 'cocoadreams', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Shop', 'Santa Barbara, CA', 4, 3, 1, 4, true),
      qrBlock('Gifts', 'https://example.com', 5, 3, 5, 4),
    ],
  },
];

// ==================== FOOD & DRINK TEMPLATES ====================
export const foodTemplates: BentoTemplate[] = [
  // 1. Cozy Cafe
  {
    id: 'food-cafe-1', name: 'Cozy Cafe', category: 'food', description: 'Coffee shop',
    profile: createProfile('Morning Brew', 'Best coffee in town', 'light', 'amber'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-amber-600', 'text-white'),
      textBlock('Hours', 'Mon-Fri: 6AM-7PM', 2, 3, 6, 1, 'bg-amber-50'),
      socialBlock('Instagram', 'instagram', 'morningbrew', 2, 3, 8, 1, 'bg-pink-100'),
      mapBlock('Find Us', 'Brooklyn, NY', 4, 4, 1, 4, true),
      ratingBlock(5, 4, 5, 4),
    ],
  },
  // 2. Bakery
  {
    id: 'food-bakery-1', name: 'Bakery', category: 'food', description: 'Fresh baked goods',
    profile: createProfile('Sweet Crumbs', 'Artisan bakery', 'light', 'orange'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-orange-500'),
      socialBlock('Instagram', 'instagram', 'sweetcrumbs', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Bakery', 'Manhattan, NY', 4, 3, 1, 4, true),
      qrBlock('Menu', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 3. Restaurant
  {
    id: 'food-restaurant-1', name: 'Restaurant', category: 'food', description: 'Fine dining',
    profile: createProfile('Taste of Italy', 'Authentic Italian cuisine', 'light', 'red'),
    blocks: [
      linkBlock('Reserve Table', 'https://example.com', 5, 3, 1, 1, 'bg-red-600', 'text-white'),
      linkBlock('View Menu', 'https://example.com', 4, 3, 6, 1, 'bg-red-500'),
      mapBlock('Location', 'Boston, MA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 4. Pizza Place
  {
    id: 'food-pizza-1', name: 'Pizza Place', category: 'food', description: 'Artisan pizza',
    profile: createProfile('Slice House', 'Best pizza in town', 'light', 'yellow'),
    blocks: [
      linkBlock('Order Now', 'https://example.com', 6, 3, 1, 1, 'bg-yellow-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'slicehouse', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Find Us', 'Chicago, IL', 5, 3, 1, 4, true),
      qrBlock('Rewards', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 5. Sushi Restaurant
  {
    id: 'food-sushi-1', name: 'Sushi Bar', category: 'food', description: 'Japanese cuisine',
    profile: createProfile('Zen Sushi', 'Fresh sushi daily', 'light', 'slate'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-slate-700', 'text-white'),
      linkBlock('Takeout', 'https://example.com', 4, 3, 6, 1, 'bg-slate-600'),
      mapBlock('Location', 'San Francisco, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 6. Ice Cream Shop
  {
    id: 'food-icecream-1', name: 'Ice Cream', category: 'food', description: 'Artisan ice cream',
    profile: createProfile('Scoop Dreams', 'Handcrafted ice cream', 'light', 'pink'),
    blocks: [
      linkBlock('Shop Flavors', 'https://example.com', 5, 3, 1, 1, 'bg-pink-500'),
      socialBlock('Instagram', 'instagram', 'scoopdreams', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Shop', 'Miami, FL', 4, 3, 1, 4, true),
      qrBlock('Flavor Club', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 7. Taco Shop
  {
    id: 'food-tacos-1', name: 'Taco Shop', category: 'food', description: 'Mexican street food',
    profile: createProfile('Taco Town', 'Authentic Mexican', 'light', 'lime'),
    blocks: [
      linkBlock('Order Now', 'https://example.com', 6, 3, 1, 1, 'bg-lime-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'tacotown', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Location', 'San Diego, CA', 5, 3, 1, 4, true),
      ratingBlock(4, 3, 6, 4),
    ],
  },
  // 8. Coffee Truck
  {
    id: 'food-coffeetruck-1', name: 'Coffee Truck', category: 'food', description: 'Mobile coffee',
    profile: createProfile('Bean Mobile', 'Coffee on the go', 'light', 'brown'),
    blocks: [
      linkBlock('Order Ahead', 'https://example.com', 5, 3, 1, 1, 'bg-amber-800', 'text-white'),
      textBlock('Schedule', 'Mon-Fri: 7AM-3PM', 4, 3, 6, 1, 'bg-amber-50'),
      mapBlock('Today\'s Location', 'Downtown', 4, 3, 1, 4, false),
      qrBlock('Loyalty', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 9. Tea House
  {
    id: 'food-tea-1', name: 'Tea House', category: 'food', description: 'Premium teas',
    profile: createProfile('Tea Sanctuary', 'Calm in every cup', 'light', 'emerald'),
    blocks: [
      linkBlock('Shop Tea', 'https://example.com', 5, 3, 1, 1, 'bg-emerald-600'),
      linkBlock('Events', 'https://example.com', 4, 3, 6, 1, 'bg-emerald-500'),
      mapBlock('Location', 'Seattle, WA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 10. BBQ Restaurant
  {
    id: 'food-bbq-1', name: 'BBQ Restaurant', category: 'food', description: 'Smoked meats',
    profile: createProfile('Smoke Stack', 'Low and slow', 'light', 'red'),
    blocks: [
      linkBlock('Order Now', 'https://example.com', 9, 3, 1, 1, 'bg-red-800', 'text-white'),
      mapBlock('Location', 'Austin, TX', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 11. Smoothie Bar
  {
    id: 'food-smoothie-1', name: 'Smoothie Bar', category: 'food', description: 'Healthy smoothies',
    profile: createProfile('Blend Station', 'Fresh and healthy', 'light', 'green'),
    blocks: [
      linkBlock('Order Smoothies', 'https://example.com', 5, 3, 1, 1, 'bg-green-500'),
      linkBlock('Menu', 'https://example.com', 4, 3, 6, 1, 'bg-green-400'),
      socialBlock('Instagram', 'instagram', 'blendstation', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('Rewards', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 12. Wine Bar
  {
    id: 'food-winebar-1', name: 'Wine Bar', category: 'food', description: 'Wine tasting',
    profile: createProfile('Vine & Vessel', 'Curated wines', 'dark', 'purple'),
    blocks: [
      linkBlock('Reserve', 'https://example.com', 5, 3, 1, 1, 'bg-purple-800', 'text-white'),
      socialBlock('Instagram', 'instagram', 'vineandvessel', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Location', 'Napa, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 13. Donut Shop
  {
    id: 'food-donuts-1', name: 'Donut Shop', category: 'food', description: 'Fresh donuts',
    profile: createProfile('Donut Panic', 'Donuts make life better', 'light', 'yellow'),
    blocks: [
      linkBlock('Order Donuts', 'https://example.com', 6, 3, 1, 1, 'bg-yellow-500'),
      socialBlock('Instagram', 'instagram', 'donutpanic', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Shop', 'Portland, OR', 5, 3, 1, 4, true),
      qrBlock('Rewards', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 14. Ramen Shop
  {
    id: 'food-ramen-1', name: 'Ramen Shop', category: 'food', description: 'Japanese noodles',
    profile: createProfile('Noodle House', 'Authentic ramen', 'light', 'yellow'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-yellow-700', 'text-white'),
      linkBlock('Takeout', 'https://example.com', 4, 3, 6, 1, 'bg-yellow-600'),
      mapBlock('Location', 'San Jose, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 15. Brunch Spot
  {
    id: 'food-brunch-1', name: 'Brunch Spot', category: 'food', description: 'Weekend brunch',
    profile: createProfile('Brunch Club', 'Brunch done right', 'light', 'rose'),
    blocks: [
      linkBlock('Reserve', 'https://example.com', 5, 3, 1, 1, 'bg-rose-500'),
      linkBlock('Menu', 'https://example.com', 4, 3, 6, 1, 'bg-rose-400'),
      socialBlock('Instagram', 'instagram', 'brunchclub', 3, 3, 1, 4, 'bg-pink-100'),
      mapBlock('Location', 'Los Angeles, CA', 6, 3, 4, 4, true),
    ],
  },
  // 16. Food Truck
  {
    id: 'food-truck-1', name: 'Food Truck', category: 'food', description: 'Gourmet food truck',
    profile: createProfile('Rolling Kitchen', 'Gourmet on wheels', 'light', 'red'),
    blocks: [
      linkBlock('Order Now', 'https://example.com', 6, 3, 1, 1, 'bg-red-600'),
      textBlock('Location', 'Check our social media for today\'s spot!', 3, 3, 7, 1, 'bg-red-50'),
      qrBlock('Menu', 'https://example.com', 4, 3, 1, 4),
      mapBlock('Track Us', 'Downtown', 5, 3, 5, 4, false),
    ],
  },
  // 17. Sandwich Shop
  {
    id: 'food-sandwich-1', name: 'Sandwich Shop', category: 'food', description: 'Gourmet subs',
    profile: createProfile('Sub Zone', 'Build your perfect sub', 'light', 'green'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-green-600'),
      linkBlock('Catering', 'https://example.com', 4, 3, 6, 1, 'bg-green-500'),
      mapBlock('Shop', 'Denver, CO', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 18. Cocktail Bar
  {
    id: 'food-cocktails-1', name: 'Cocktail Bar', category: 'food', description: 'Craft cocktails',
    profile: createProfile('Mixology Lab', 'Crafted cocktails', 'dark', 'violet'),
    blocks: [
      linkBlock('Reserve', 'https://example.com', 5, 3, 1, 1, 'bg-violet-900', 'text-white'),
      socialBlock('Instagram', 'instagram', 'mixology_lab', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Location', 'New Orleans, LA', 4, 3, 1, 4, true),
      qrBlock('Menu', 'https://example.com', 5, 3, 5, 4),
    ],
  },
];

// ==================== SERVICES TEMPLATES ====================
export const servicesTemplates: BentoTemplate[] = [
  // 1. Hair Salon
  {
    id: 'services-salon-1', name: 'Hair Salon', category: 'services', description: 'Hair styling',
    profile: createProfile('Luxe Salon', 'Style that defines you', 'light', 'pink'),
    blocks: [
      linkBlock('Book Appointment', 'https://example.com', 6, 3, 1, 1, 'bg-pink-500', 'text-white'),
      socialBlock('Instagram', 'instagram', 'luxesalon', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Salon', 'Beverly Hills, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 2. Auto Repair
  {
    id: 'services-auto-1', name: 'Auto Repair', category: 'services', description: 'Car repair',
    profile: createProfile('Quick Fix Auto', 'Reliable car care', 'light', 'blue'),
    blocks: [
      linkBlock('Schedule Service', 'https://example.com', 5, 3, 1, 1, 'bg-blue-600'),
      linkBlock('Tire Shop', 'https://example.com', 4, 3, 6, 1, 'bg-blue-500'),
      textBlock('Hours', 'Mon-Fri: 7AM-6PM', 3, 3, 1, 4, 'bg-blue-50'),
      mapBlock('Location', 'Houston, TX', 6, 3, 4, 4, true),
    ],
  },
  // 3. Cleaning Service
  {
    id: 'services-cleaning-1', name: 'Cleaning Service', category: 'services', description: 'Home cleaning',
    profile: createProfile('Sparkle Clean', 'Professional cleaning', 'light', 'cyan'),
    blocks: [
      linkBlock('Book Now', 'https://example.com', 5, 3, 1, 1, 'bg-cyan-600'),
      linkBlock('Services', 'https://example.com', 4, 3, 6, 1, 'bg-cyan-500'),
      mapBlock('Service Area', 'Los Angeles, CA', 4, 3, 1, 4, false),
      qrBlock('Quote', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 4. Fitness Trainer
  {
    id: 'services-fitness-1', name: 'Fitness Trainer', category: 'services', description: 'Personal training',
    profile: createProfile('Fit Life Pro', 'Your fitness journey', 'light', 'red'),
    blocks: [
      linkBlock('Train With Me', 'https://example.com', 6, 3, 1, 1, 'bg-red-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'fitlifepro', 3, 3, 7, 1, 'bg-pink-100'),
      linkBlock('Programs', 'https://example.com', 4, 3, 1, 4, 'bg-red-500'),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 5. Lawyer
  {
    id: 'services-lawyer-1', name: 'Lawyer', category: 'services', description: 'Legal services',
    profile: createProfile('Legal Experts', 'Protecting your rights', 'dark', 'slate'),
    blocks: [
      linkBlock('Consultation', 'https://example.com', 5, 3, 1, 1, 'bg-slate-800', 'text-white'),
      textBlock('Practice Areas', 'Family, Criminal, Business', 4, 3, 6, 1, 'bg-slate-100'),
      mapBlock('Office', 'New York, NY', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 6. Dentist
  {
    id: 'services-dentist-1', name: 'Dentist', category: 'services', description: 'Dental care',
    profile: createProfile('Bright Smile Dental', 'Your smile matters', 'light', 'sky'),
    blocks: [
      linkBlock('Book Appointment', 'https://example.com', 5, 3, 1, 1, 'bg-sky-600'),
      linkBlock('Insurance', 'https://example.com', 4, 3, 6, 1, 'bg-sky-500'),
      mapBlock('Location', 'Miami, FL', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 7. Plumber
  {
    id: 'services-plumber-1', name: 'Plumber', category: 'services', description: 'Plumbing services',
    profile: createProfile('Flow Masters', 'Expert plumbing', 'light', 'blue'),
    blocks: [
      linkBlock('Call Now', 'tel:+15551234567', 6, 3, 1, 1, 'bg-blue-600', 'text-white'),
      textBlock('24/7 Emergency', 'Available now', 3, 3, 7, 1, 'bg-blue-50'),
      mapBlock('Service Area', 'Dallas, TX', 5, 3, 1, 4, false),
      qrBlock('Estimate', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 8. Photographer
  {
    id: 'services-photographer-1', name: 'Photographer', category: 'services', description: 'Photography services',
    profile: createProfile('Capture Moments', 'Professional photography', 'light', 'violet'),
    blocks: [
      linkBlock('View Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-violet-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'capturemoments', 3, 3, 7, 1, 'bg-pink-100'),
      linkBlock('Book Session', 'https://example.com', 4, 3, 1, 4, 'bg-violet-500'),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 9. Accountant
  {
    id: 'services-accountant-1', name: 'Accountant', category: 'services', description: 'Tax & accounting',
    profile: createProfile('Tax Pros', 'Expert accounting', 'light', 'emerald'),
    blocks: [
      linkBlock('Tax Services', 'https://example.com', 5, 3, 1, 1, 'bg-emerald-600'),
      linkBlock('Book Consultation', 'https://example.com', 4, 3, 6, 1, 'bg-emerald-500'),
      mapBlock('Office', 'Chicago, IL', 4, 3, 1, 4, true),
      qrBlock('Tax Prep', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 10. Realtor
  {
    id: 'services-realtor-1', name: 'Realtor', category: 'services', description: 'Real estate',
    profile: createProfile('Home Finder', 'Find your dream home', 'light', 'indigo'),
    blocks: [
      linkBlock('Browse Homes', 'https://example.com', 6, 3, 1, 1, 'bg-indigo-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'homefinder', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Office', 'Phoenix, AZ', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 11. Pet Grooming
  {
    id: 'services-grooming-1', name: 'Pet Grooming', category: 'services', description: 'Pet spa',
    profile: createProfile('Paw Spa', 'Luxury pet grooming', 'light', 'rose'),
    blocks: [
      linkBlock('Book Grooming', 'https://example.com', 5, 3, 1, 1, 'bg-rose-500'),
      linkBlock('Spa Packages', 'https://example.com', 4, 3, 6, 1, 'bg-rose-400'),
      mapBlock('Location', 'San Diego, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 12. Electrician
  {
    id: 'services-electrician-1', name: 'Electrician', category: 'services', description: 'Electrical services',
    profile: createProfile('Power Pros', 'Licensed electricians', 'light', 'yellow'),
    blocks: [
      linkBlock('Service Request', 'https://example.com', 5, 3, 1, 1, 'bg-yellow-600', 'text-white'),
      textBlock('24/7 Emergency', 'Available now', 4, 3, 6, 1, 'bg-yellow-50'),
      mapBlock('Service Area', 'Atlanta, GA', 4, 3, 1, 4, false),
      qrBlock('Estimate', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 13. Wedding Planner
  {
    id: 'services-wedding-1', name: 'Wedding Planner', category: 'services', description: 'Wedding services',
    profile: createProfile('Ever After Events', 'Dream weddings', 'light', 'pink'),
    blocks: [
      linkBlock('Our Services', 'https://example.com', 5, 3, 1, 1, 'bg-pink-600'),
      socialBlock('Instagram', 'instagram', 'everafter', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Office', 'Charleston, SC', 4, 3, 1, 4, true),
      qrBlock('Portfolio', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 14. Landscaper
  {
    id: 'services-landscape-1', name: 'Landscaper', category: 'services', description: 'Garden design',
    profile: createProfile('Green Thumb', 'Outdoor design', 'light', 'green'),
    blocks: [
      linkBlock('Our Services', 'https://example.com', 5, 3, 1, 1, 'bg-green-600'),
      linkBlock('Gallery', 'https://example.com', 4, 3, 6, 1, 'bg-green-500'),
      mapBlock('Service Area', 'Sacramento, CA', 4, 3, 1, 4, false),
      qrBlock('Quote', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 15. Massage Therapist
  {
    id: 'services-massage-1', name: 'Massage Therapy', category: 'services', description: 'Relaxation',
    profile: createProfile('Zen Touch', 'Healing hands', 'light', 'teal'),
    blocks: [
      linkBlock('Book Massage', 'https://example.com', 6, 3, 1, 1, 'bg-teal-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'zentouch', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Location', 'Denver, CO', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 16. Insurance Agent
  {
    id: 'services-insurance-1', name: 'Insurance Agent', category: 'services', description: 'Insurance coverage',
    profile: createProfile('Safe Guard Insurance', 'Protecting what matters', 'light', 'blue'),
    blocks: [
      linkBlock('Get a Quote', 'https://example.com', 5, 3, 1, 1, 'bg-blue-700', 'text-white'),
      linkBlock('Policies', 'https://example.com', 4, 3, 6, 1, 'bg-blue-600'),
      mapBlock('Office', 'Boston, MA', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 17. Moving Company
  {
    id: 'services-moving-1', name: 'Moving Company', category: 'services', description: 'Moving services',
    profile: createProfile('Smooth Moves', 'Stress-free moving', 'light', 'orange'),
    blocks: [
      linkBlock('Get a Quote', 'https://example.com', 6, 3, 1, 1, 'bg-orange-600', 'text-white'),
      textBlock('Local & Long Distance', 'Full service moving', 3, 3, 7, 1, 'bg-orange-50'),
      mapBlock('Service Area', 'Seattle, WA', 5, 3, 1, 4, false),
      qrBlock('Checklist', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 18. HVAC Service
  {
    id: 'services-hvac-1', name: 'HVAC Service', category: 'services', description: 'Heating & cooling',
    profile: createProfile('Climate Control', 'Comfort experts', 'light', 'sky'),
    blocks: [
      linkBlock('Service Request', 'https://example.com', 5, 3, 1, 1, 'bg-sky-700', 'text-white'),
      textBlock('24/7 Emergency', 'Always available', 4, 3, 6, 1, 'bg-sky-50'),
      mapBlock('Service Area', 'Phoenix, AZ', 4, 3, 1, 4, false),
      qrBlock('Maintenance', 'https://example.com', 5, 3, 5, 4),
    ],
  },
];

// ==================== CREATIVE TEMPLATES ====================
export const creativeTemplates: BentoTemplate[] = [
  // 1. Photographer
  {
    id: 'creative-photographer-1', name: 'Photographer', category: 'creative', description: 'Photography',
    profile: createProfile('Lens Art', 'Capturing moments', 'dark', 'gray'),
    blocks: [
      linkBlock('View Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-gray-800', 'text-white'),
      socialBlock('Instagram', 'instagram', 'lensart', 3, 3, 7, 1, 'bg-pink-100'),
      qrBlock('Contact Card', 'https://example.com', 4, 3, 1, 4),
      mapBlock('Studio', 'Los Angeles, CA', 5, 3, 5, 4, true),
    ],
  },
  // 2. Graphic Designer
  {
    id: 'creative-designer-1', name: 'Graphic Designer', category: 'creative', description: 'Design services',
    profile: createProfile('Pixel Perfect', 'Creative design', 'light', 'violet'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-violet-600', 'text-white'),
      socialBlock('Behance', 'behance', 'pixelperfect', 3, 3, 7, 1, 'bg-blue-100'),
      linkBlock('Contact', 'https://example.com', 4, 3, 1, 4, 'bg-violet-500'),
      qrBlock('Business Card', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 3. Musician
  {
    id: 'creative-musician-1', name: 'Musician', category: 'creative', description: 'Music artist',
    profile: createProfile('Sound Waves', 'Music producer', 'dark', 'purple'),
    blocks: [
      linkBlock('Listen Now', 'https://example.com', 5, 3, 1, 1, 'bg-purple-800', 'text-white'),
      socialBlock('Spotify', 'spotify', 'soundwaves', 4, 3, 6, 1, 'bg-green-100'),
      socialBlock('Instagram', 'instagram', 'soundwaves', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('Merch', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 4. Artist
  {
    id: 'creative-artist-1', name: 'Artist', category: 'creative', description: 'Fine art',
    profile: createProfile('Canvas Dreams', 'Original artwork', 'light', 'rose'),
    blocks: [
      linkBlock('Art Gallery', 'https://example.com', 6, 3, 1, 1, 'bg-rose-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'canvasdreams', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Studio', 'Santa Fe, NM', 4, 3, 1, 4, true),
      qrBlock('Commission', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 5. Videographer
  {
    id: 'creative-video-1', name: 'Videographer', category: 'creative', description: 'Video production',
    profile: createProfile('Motion Studio', 'Cinematic video', 'dark', 'slate'),
    blocks: [
      linkBlock('Showreel', 'https://example.com', 6, 3, 1, 1, 'bg-slate-800', 'text-white'),
      socialBlock('Vimeo', 'vimeo', 'motionstudio', 3, 3, 7, 1, 'bg-cyan-100'),
      linkBlock('Services', 'https://example.com', 4, 3, 1, 4, 'bg-slate-700'),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 6. Tattoo Artist
  {
    id: 'creative-tattoo-1', name: 'Tattoo Artist', category: 'creative', description: 'Custom tattoos',
    profile: createProfile('Ink Master', 'Custom tattoo art', 'dark', 'zinc'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-zinc-800', 'text-white'),
      socialBlock('Instagram', 'instagram', 'inkmaster', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Shop', 'New Orleans, LA', 4, 3, 1, 4, true),
      qrBlock('Book Now', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 7. Illustrator
  {
    id: 'creative-illustration-1', name: 'Illustrator', category: 'creative', description: 'Digital art',
    profile: createProfile('Draw Life', 'Digital illustrations', 'light', 'indigo'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 5, 3, 1, 1, 'bg-indigo-600'),
      socialBlock('Instagram', 'instagram', 'drawlife', 4, 3, 6, 1, 'bg-pink-100'),
      linkBlock('Shop Prints', 'https://example.com', 4, 3, 1, 4, 'bg-indigo-500'),
      qrBlock('Commissions', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 8. Interior Designer
  {
    id: 'creative-interior-1', name: 'Interior Designer', category: 'creative', description: 'Home design',
    profile: createProfile('Home Style', 'Interior design', 'light', 'stone'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-stone-700', 'text-white'),
      socialBlock('Pinterest', 'pinterest', 'homestyle', 3, 3, 7, 1, 'bg-red-100'),
      mapBlock('Studio', 'San Francisco, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 9. Fashion Designer
  {
    id: 'creative-fashion-1', name: 'Fashion Designer', category: 'creative', description: 'Custom clothing',
    profile: createProfile('Style Forge', 'Bespoke fashion', 'light', 'rose'),
    blocks: [
      linkBlock('Collections', 'https://example.com', 6, 3, 1, 1, 'bg-rose-700', 'text-white'),
      socialBlock('Instagram', 'instagram', 'styleforge', 3, 3, 7, 1, 'bg-pink-100'),
      linkBlock('Book Consultation', 'https://example.com', 4, 3, 1, 4, 'bg-rose-600'),
      qrBlock('Lookbook', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 10. Web Designer
  {
    id: 'creative-web-1', name: 'Web Designer', category: 'creative', description: 'Web development',
    profile: createProfile('Code Canvas', 'Creative web design', 'dark', 'cyan'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 5, 3, 1, 1, 'bg-cyan-800', 'text-white'),
      socialBlock('Dribbble', 'dribbble', 'codecanvas', 4, 3, 6, 1, 'bg-pink-100'),
      linkBlock('Get a Quote', 'https://example.com', 4, 3, 1, 4, 'bg-cyan-700'),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 11. Content Creator
  {
    id: 'creative-creator-1', name: 'Content Creator', category: 'creative', description: 'YouTuber/Influencer',
    profile: createProfile('Creator Hub', 'Daily content', 'light', 'red'),
    blocks: [
      linkBlock('Subscribe', 'https://youtube.com', 5, 3, 1, 1, 'bg-red-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'creatorhub', 4, 3, 6, 1, 'bg-pink-100'),
      socialBlock('Twitter', 'x', 'creatorhub', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Merch Store', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 12. Voice Actor
  {
    id: 'creative-voice-1', name: 'Voice Actor', category: 'creative', description: 'Voice over services',
    profile: createProfile('Voice Vault', 'Professional voice over', 'dark', 'slate'),
    blocks: [
      linkBlock('Demos', 'https://example.com', 5, 3, 1, 1, 'bg-slate-700', 'text-white'),
      linkBlock('Book Now', 'https://example.com', 4, 3, 6, 1, 'bg-slate-600'),
      socialBlock('Instagram', 'instagram', 'voicevault', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('Contact', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 13. UX Designer
  {
    id: 'creative-ux-1', name: 'UX Designer', category: 'creative', description: 'User experience',
    profile: createProfile('User First', 'UX design studio', 'light', 'blue'),
    blocks: [
      linkBlock('Case Studies', 'https://example.com', 6, 3, 1, 1, 'bg-blue-600', 'text-white'),
      socialBlock('LinkedIn', 'linkedin', 'userfirst', 3, 3, 7, 1, 'bg-blue-100'),
      linkBlock('Contact', 'https://example.com', 4, 3, 1, 4, 'bg-blue-500'),
      qrBlock('Resume', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 14. 3D Artist
  {
    id: 'creative-3d-1', name: '3D Artist', category: 'creative', description: '3D modeling',
    profile: createProfile('Dimension Lab', '3D art & animation', 'dark', 'violet'),
    blocks: [
      linkBlock('Showreel', 'https://example.com', 6, 3, 1, 1, 'bg-violet-900', 'text-white'),
      socialBlock('ArtStation', 'artstation', 'dimensionlab', 3, 3, 7, 1, 'bg-orange-100'),
      mapBlock('Studio', 'Vancouver, BC', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 15. Jewelry Designer
  {
    id: 'creative-jewelry-1', name: 'Jewelry Designer', category: 'creative', description: 'Custom jewelry',
    profile: createProfile('Silver Lining', 'Handcrafted jewelry', 'light', 'gray'),
    blocks: [
      linkBlock('Collections', 'https://example.com', 6, 3, 1, 1, 'bg-gray-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'silverlining', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Studio', 'Providence, RI', 4, 3, 1, 4, true),
      qrBlock('Commissions', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 16. Animator
  {
    id: 'creative-animator-1', name: 'Animator', category: 'creative', description: 'Animation studio',
    profile: createProfile('Frame by Frame', 'Animation studio', 'dark', 'orange'),
    blocks: [
      linkBlock('Showreel', 'https://example.com', 6, 3, 1, 1, 'bg-orange-800', 'text-white'),
      socialBlock('Vimeo', 'vimeo', 'framebyframe', 3, 3, 7, 1, 'bg-cyan-100'),
      linkBlock('Services', 'https://example.com', 4, 3, 1, 4, 'bg-orange-700'),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 17. Craft Artist
  {
    id: 'creative-craft-1', name: 'Craft Artist', category: 'creative', description: 'Handmade goods',
    profile: createProfile('Handmade Hub', 'Unique crafts', 'light', 'amber'),
    blocks: [
      linkBlock('Shop', 'https://example.com', 5, 3, 1, 1, 'bg-amber-600'),
      socialBlock('Instagram', 'instagram', 'handmadehub', 4, 3, 6, 1, 'bg-pink-100'),
      mapBlock('Studio', 'Asheville, NC', 4, 3, 1, 4, true),
      qrBlock('Workshops', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 18. Podcast Host
  {
    id: 'creative-podcast-1', name: 'Podcast Host', category: 'creative', description: 'Podcast show',
    profile: createProfile('Talk Time', 'Weekly conversations', 'dark', 'emerald'),
    blocks: [
      linkBlock('Listen Now', 'https://example.com', 5, 3, 1, 1, 'bg-emerald-800', 'text-white'),
      socialBlock('Spotify', 'spotify', 'talktime', 4, 3, 6, 1, 'bg-green-100'),
      socialBlock('Twitter', 'x', 'talktime', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Newsletter', 'https://example.com', 6, 3, 4, 4),
    ],
  },
];

// ==================== PERSONAL TEMPLATES ====================
export const personalTemplates: BentoTemplate[] = [
  // 1. Personal Blog
  {
    id: 'personal-blog-1', name: 'Personal Blog', category: 'personal', description: 'Blog',
    profile: createProfile('My Life', 'Sharing my journey', 'light', 'blue'),
    blocks: [
      linkBlock('Read Blog', 'https://example.com', 6, 3, 1, 1, 'bg-blue-600', 'text-white'),
      socialBlock('Twitter', 'x', 'mylife', 3, 3, 7, 1, 'bg-gray-100'),
      qrBlock('Subscribe', 'https://example.com', 9, 3, 1, 4),
    ],
  },
  // 2. Influencer
  {
    id: 'personal-influencer-1', name: 'Influencer', category: 'personal', description: 'Social media',
    profile: createProfile('Life & Style', 'Daily inspiration', 'light', 'pink'),
    blocks: [
      linkBlock('Latest Post', 'https://example.com', 5, 3, 1, 1, 'bg-pink-500', 'text-white'),
      socialBlock('Instagram', 'instagram', 'lifeandstyle', 4, 3, 6, 1, 'bg-pink-100'),
      socialBlock('TikTok', 'tiktok', 'lifeandstyle', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Shop My Favorites', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 3. Author
  {
    id: 'personal-author-1', name: 'Author', category: 'personal', description: 'Writer',
    profile: createProfile('Word Smith', 'Books & writing', 'light', 'indigo'),
    blocks: [
      linkBlock('My Books', 'https://example.com', 6, 3, 1, 1, 'bg-indigo-600', 'text-white'),
      socialBlock('Twitter', 'x', 'wordsmith', 3, 3, 7, 1, 'bg-gray-100'),
      linkBlock('Blog', 'https://example.com', 4, 3, 1, 4, 'bg-indigo-500'),
      qrBlock('Newsletter', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 4. Coach
  {
    id: 'personal-coach-1', name: 'Life Coach', category: 'personal', description: 'Life coaching',
    profile: createProfile('Growth Path', 'Unlock your potential', 'light', 'teal'),
    blocks: [
      linkBlock('Work With Me', 'https://example.com', 5, 3, 1, 1, 'bg-teal-600'),
      linkBlock('Resources', 'https://example.com', 4, 3, 6, 1, 'bg-teal-500'),
      socialBlock('Instagram', 'instagram', 'growthpath', 3, 3, 1, 4, 'bg-pink-100'),
      ratingBlock(6, 3, 4, 4),
    ],
  },
  // 5. YouTuber
  {
    id: 'personal-youtuber-1', name: 'YouTuber', category: 'personal', description: 'Video content',
    profile: createProfile('Daily Vlog', 'Life on camera', 'light', 'red'),
    blocks: [
      linkBlock('Subscribe', 'https://youtube.com', 6, 3, 1, 1, 'bg-red-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'dailyvlog', 3, 3, 7, 1, 'bg-pink-100'),
      socialBlock('Twitter', 'x', 'dailyvlog', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Merch', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 6. Consultant
  {
    id: 'personal-consultant-1', name: 'Consultant', category: 'personal', description: 'Expert advice',
    profile: createProfile('Expert Insights', 'Professional consulting', 'dark', 'slate'),
    blocks: [
      linkBlock('Hire Me', 'https://example.com', 5, 3, 1, 1, 'bg-slate-700', 'text-white'),
      linkBlock('Speaking', 'https://example.com', 4, 3, 6, 1, 'bg-slate-600'),
      mapBlock('Office', 'Washington, DC', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 7. Podcaster
  {
    id: 'personal-podcast-1', name: 'Podcaster', category: 'personal', description: 'Podcast show',
    profile: createProfile('Deep Talks', 'Conversations that matter', 'dark', 'purple'),
    blocks: [
      linkBlock('Listen Now', 'https://example.com', 5, 3, 1, 1, 'bg-purple-800', 'text-white'),
      socialBlock('Spotify', 'spotify', 'deeptalks', 4, 3, 6, 1, 'bg-green-100'),
      socialBlock('Twitter', 'x', 'deeptalks', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Newsletter', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 8. Student
  {
    id: 'personal-student-1', name: 'Student', category: 'personal', description: 'Personal brand',
    profile: createProfile('Future Innovator', 'CS Student', 'light', 'emerald'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 5, 3, 1, 1, 'bg-emerald-600'),
      socialBlock('GitHub', 'github', 'futureinnovator', 4, 3, 6, 1, 'bg-gray-100'),
      linkBlock('Resume', 'https://example.com', 4, 3, 1, 4, 'bg-emerald-500'),
      qrBlock('Connect', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 9. Chef
  {
    id: 'personal-chef-1', name: 'Home Chef', category: 'personal', description: 'Cooking',
    profile: createProfile('Kitchen Tales', 'Home cooking recipes', 'light', 'orange'),
    blocks: [
      linkBlock('Recipes', 'https://example.com', 5, 3, 1, 1, 'bg-orange-600'),
      socialBlock('Instagram', 'instagram', 'kitchentales', 4, 3, 6, 1, 'bg-pink-100'),
      linkBlock('Cookbook', 'https://example.com', 4, 3, 1, 4, 'bg-orange-500'),
      qrBlock('Cooking Class', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 10. Traveler
  {
    id: 'personal-travel-1', name: 'Traveler', category: 'personal', description: 'Travel blog',
    profile: createProfile('Wanderlust', 'World traveler', 'light', 'sky'),
    blocks: [
      linkBlock('Travel Blog', 'https://example.com', 6, 3, 1, 1, 'bg-sky-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'wanderlust', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Current Location', 'Bali, Indonesia', 4, 3, 1, 4, false),
      qrBlock('Travel Tips', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 11. DJ
  {
    id: 'personal-dj-1', name: 'DJ', category: 'personal', description: 'Music DJ',
    profile: createProfile('Beat Drop', 'DJ & producer', 'dark', 'fuchsia'),
    blocks: [
      linkBlock('Music', 'https://example.com', 5, 3, 1, 1, 'bg-fuchsia-800', 'text-white'),
      socialBlock('SoundCloud', 'soundcloud', 'beatdrop', 4, 3, 6, 1, 'bg-orange-100'),
      socialBlock('Instagram', 'instagram', 'beatdrop', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('Bookings', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 12. Model
  {
    id: 'personal-model-1', name: 'Model', category: 'personal', description: 'Fashion model',
    profile: createProfile('Face Forward', 'Professional model', 'light', 'rose'),
    blocks: [
      linkBlock('Portfolio', 'https://example.com', 6, 3, 1, 1, 'bg-rose-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'faceforward', 3, 3, 7, 1, 'bg-pink-100'),
      linkBlock('Bookings', 'https://example.com', 4, 3, 1, 4, 'bg-rose-500'),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 13. Doctor
  {
    id: 'personal-doctor-1', name: 'Doctor', category: 'personal', description: 'Healthcare',
    profile: createProfile('Dr. Wellness', 'Health & wellness', 'light', 'teal'),
    blocks: [
      linkBlock('Book Appointment', 'https://example.com', 5, 3, 1, 1, 'bg-teal-700', 'text-white'),
      linkBlock('Health Tips', 'https://example.com', 4, 3, 6, 1, 'bg-teal-600'),
      mapBlock('Clinic', 'San Diego, CA', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 14. Real Estate Agent
  {
    id: 'personal-realtor-1', name: 'Realtor', category: 'personal', description: 'Real estate',
    profile: createProfile('Home Expert', 'Find your dream home', 'light', 'indigo'),
    blocks: [
      linkBlock('Search Homes', 'https://example.com', 5, 3, 1, 1, 'bg-indigo-600'),
      linkBlock('Sell Your Home', 'https://example.com', 4, 3, 6, 1, 'bg-indigo-500'),
      socialBlock('Instagram', 'instagram', 'homeexpert', 3, 3, 1, 4, 'bg-pink-100'),
      qrBlock('Free Valuation', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 15. Nonprofit
  {
    id: 'personal-nonprofit-1', name: 'Nonprofit', category: 'personal', description: 'Charity',
    profile: createProfile('Give Hope', 'Making a difference', 'light', 'green'),
    blocks: [
      linkBlock('Donate', 'https://example.com', 5, 3, 1, 1, 'bg-green-600', 'text-white'),
      linkBlock('Volunteer', 'https://example.com', 4, 3, 6, 1, 'bg-green-500'),
      mapBlock('Office', 'Chicago, IL', 4, 3, 1, 4, true),
      qrBlock('Newsletter', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 16. Politician
  {
    id: 'personal-politician-1', name: 'Politician', category: 'personal', description: 'Public office',
    profile: createProfile('Community First', 'Public servant', 'dark', 'blue'),
    blocks: [
      linkBlock('Join Campaign', 'https://example.com', 5, 3, 1, 1, 'bg-blue-800', 'text-white'),
      textBlock('Mission', 'Serving our community', 4, 3, 6, 1, 'bg-blue-50'),
      mapBlock('Office', 'State Capitol', 4, 3, 1, 4, true),
      qrBlock('Contact', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 17. Religious Leader
  {
    id: 'personal-church-1', name: 'Church', category: 'personal', description: 'Faith community',
    profile: createProfile('Grace Church', 'Welcome home', 'light', 'violet'),
    blocks: [
      linkBlock('Join Us', 'https://example.com', 5, 3, 1, 1, 'bg-violet-600'),
      linkBlock('Give', 'https://example.com', 4, 3, 6, 1, 'bg-violet-500'),
      mapBlock('Location', 'Dallas, TX', 4, 3, 1, 4, true),
      qrBlock('Live Stream', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 18. Athlete
  {
    id: 'personal-athlete-1', name: 'Athlete', category: 'personal', description: 'Pro athlete',
    profile: createProfile('Pro Athlete', 'Elite performance', 'dark', 'red'),
    blocks: [
      linkBlock('Official Site', 'https://example.com', 6, 3, 1, 1, 'bg-red-800', 'text-white'),
      socialBlock('Instagram', 'instagram', 'proathlete', 3, 3, 7, 1, 'bg-pink-100'),
      linkBlock('Merchandise', 'https://example.com', 4, 3, 1, 4, 'bg-red-700'),
      qrBlock('Fan Club', 'https://example.com', 5, 3, 5, 4),
    ],
  },
];

// ==================== BUSINESS TEMPLATES ====================
export const businessTemplates: BentoTemplate[] = [
  // 1. Startup
  {
    id: 'business-startup-1', name: 'Startup', category: 'business', description: 'Tech startup',
    profile: createProfile('TechStart', 'Innovating the future', 'dark', 'indigo'),
    blocks: [
      linkBlock('Our Product', 'https://example.com', 6, 3, 1, 1, 'bg-indigo-700', 'text-white'),
      socialBlock('Twitter', 'x', 'techstart', 3, 3, 7, 1, 'bg-gray-100'),
      mapBlock('Office', 'San Francisco, CA', 4, 3, 1, 4, true),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 2. Agency
  {
    id: 'business-agency-1', name: 'Marketing Agency', category: 'business', description: 'Digital marketing',
    profile: createProfile('Growth Agency', 'Digital marketing experts', 'light', 'violet'),
    blocks: [
      linkBlock('Our Services', 'https://example.com', 5, 3, 1, 1, 'bg-violet-600'),
      linkBlock('Case Studies', 'https://example.com', 4, 3, 6, 1, 'bg-violet-500'),
      socialBlock('LinkedIn', 'linkedin', 'growthagency', 3, 3, 1, 4, 'bg-blue-100'),
      mapBlock('Office', 'New York, NY', 6, 3, 4, 4, true),
    ],
  },
  // 3. Software Company
  {
    id: 'business-software-1', name: 'Software Company', category: 'business', description: 'SaaS product',
    profile: createProfile('CloudSoft', 'Enterprise software', 'dark', 'sky'),
    blocks: [
      linkBlock('Product', 'https://example.com', 6, 3, 1, 1, 'bg-sky-800', 'text-white'),
      linkBlock('Pricing', 'https://example.com', 3, 3, 7, 1, 'bg-sky-700'),
      socialBlock('Twitter', 'x', 'cloudsoft', 3, 3, 1, 4, 'bg-gray-100'),
      qrBlock('Demo', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 4. Consulting Firm
  {
    id: 'business-consulting-1', name: 'Consulting Firm', category: 'business', description: 'Business consulting',
    profile: createProfile('Strategy Plus', 'Business transformation', 'dark', 'slate'),
    blocks: [
      linkBlock('Our Services', 'https://example.com', 5, 3, 1, 1, 'bg-slate-800', 'text-white'),
      linkBlock('Contact Us', 'https://example.com', 4, 3, 6, 1, 'bg-slate-700'),
      mapBlock('Headquarters', 'Boston, MA', 4, 3, 1, 4, true),
      qrBlock('Whitepapers', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 5. Financial Services
  {
    id: 'business-finance-1', name: 'Financial Services', category: 'business', description: 'Finance company',
    profile: createProfile('Wealth Partners', 'Financial planning', 'dark', 'emerald'),
    blocks: [
      linkBlock('Investments', 'https://example.com', 5, 3, 1, 1, 'bg-emerald-800', 'text-white'),
      linkBlock('Planning', 'https://example.com', 4, 3, 6, 1, 'bg-emerald-700'),
      mapBlock('Office', 'Chicago, IL', 4, 3, 1, 4, true),
      qrBlock('Free Consultation', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 6. Healthcare Company
  {
    id: 'business-healthcare-1', name: 'Healthcare', category: 'business', description: 'Medical services',
    profile: createProfile('MedCare Plus', 'Quality healthcare', 'light', 'teal'),
    blocks: [
      linkBlock('Find a Doctor', 'https://example.com', 5, 3, 1, 1, 'bg-teal-700', 'text-white'),
      linkBlock('Services', 'https://example.com', 4, 3, 6, 1, 'bg-teal-600'),
      mapBlock('Locations', 'Multiple locations', 4, 3, 1, 4, false),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 7. E-commerce
  {
    id: 'business-ecommerce-1', name: 'E-commerce', category: 'business', description: 'Online store',
    profile: createProfile('Shop Online', 'Quality products', 'light', 'pink'),
    blocks: [
      linkBlock('Shop Now', 'https://example.com', 6, 3, 1, 1, 'bg-pink-600', 'text-white'),
      socialBlock('Instagram', 'instagram', 'shoponline', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Warehouse', 'Louisville, KY', 4, 3, 1, 4, false),
      qrBlock('App', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 8. Real Estate Company
  {
    id: 'business-realestate-1', name: 'Real Estate Co', category: 'business', description: 'Property company',
    profile: createProfile('Prime Properties', 'Luxury real estate', 'light', 'stone'),
    blocks: [
      linkBlock('View Listings', 'https://example.com', 6, 3, 1, 1, 'bg-stone-700', 'text-white'),
      socialBlock('Instagram', 'instagram', 'primeprops', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Office', 'Beverly Hills, CA', 4, 3, 1, 4, true),
      qrBlock('VIP List', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 9. Education Company
  {
    id: 'business-education-1', name: 'Education', category: 'business', description: 'EdTech company',
    profile: createProfile('LearnHub', 'Online education', 'light', 'blue'),
    blocks: [
      linkBlock('Courses', 'https://example.com', 5, 3, 1, 1, 'bg-blue-600'),
      linkBlock('For Business', 'https://example.com', 4, 3, 6, 1, 'bg-blue-500'),
      socialBlock('LinkedIn', 'linkedin', 'learnhub', 3, 3, 1, 4, 'bg-blue-100'),
      qrBlock('Free Trial', 'https://example.com', 6, 3, 4, 4),
    ],
  },
  // 10. Construction Company
  {
    id: 'business-construction-1', name: 'Construction', category: 'business', description: 'Building company',
    profile: createProfile('BuildRight', 'Quality construction', 'light', 'orange'),
    blocks: [
      linkBlock('Our Projects', 'https://example.com', 5, 3, 1, 1, 'bg-orange-700', 'text-white'),
      linkBlock('Get a Quote', 'https://example.com', 4, 3, 6, 1, 'bg-orange-600'),
      mapBlock('Headquarters', 'Houston, TX', 4, 3, 1, 4, true),
      qrBlock('Careers', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 11. Restaurant Chain
  {
    id: 'business-restaurant-1', name: 'Restaurant Chain', category: 'business', description: 'Food chain',
    profile: createProfile('Food Co', 'Great food daily', 'light', 'red'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-red-600'),
      linkBlock('Careers', 'https://example.com', 4, 3, 6, 1, 'bg-red-500'),
      mapBlock('Find a Location', 'Nationwide', 4, 3, 1, 4, false),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 12. Gym Franchise
  {
    id: 'business-gym-1', name: 'Gym Franchise', category: 'business', description: 'Fitness centers',
    profile: createProfile('FitZone', 'Get fit today', 'light', 'green'),
    blocks: [
      linkBlock('Join Now', 'https://example.com', 5, 3, 1, 1, 'bg-green-600', 'text-white'),
      linkBlock('Locations', 'https://example.com', 4, 3, 6, 1, 'bg-green-500'),
      mapBlock('Find Gym', 'Nationwide', 4, 3, 1, 4, false),
      qrBlock('Free Pass', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 13. Hotel Chain
  {
    id: 'business-hotel-1', name: 'Hotel', category: 'business', description: 'Hospitality',
    profile: createProfile('Grand Hotels', 'Luxury stays', 'light', 'amber'),
    blocks: [
      linkBlock('Book Now', 'https://example.com', 6, 3, 1, 1, 'bg-amber-700', 'text-white'),
      socialBlock('Instagram', 'instagram', 'grandhotels', 3, 3, 7, 1, 'bg-pink-100'),
      mapBlock('Locations', 'Worldwide', 4, 3, 1, 4, false),
      ratingBlock(5, 3, 5, 4),
    ],
  },
  // 14. Car Dealership
  {
    id: 'business-car-1', name: 'Car Dealership', category: 'business', description: 'Auto sales',
    profile: createProfile('AutoMax', 'Quality vehicles', 'light', 'blue'),
    blocks: [
      linkBlock('Browse Cars', 'https://example.com', 6, 3, 1, 1, 'bg-blue-700', 'text-white'),
      linkBlock('Trade-In', 'https://example.com', 3, 3, 7, 1, 'bg-blue-600'),
      mapBlock('Dealership', 'Los Angeles, CA', 5, 3, 1, 4, true),
      qrBlock('Test Drive', 'https://example.com', 4, 3, 6, 4),
    ],
  },
  // 15. Insurance Company
  {
    id: 'business-insurance-1', name: 'Insurance', category: 'business', description: 'Insurance provider',
    profile: createProfile('SafeGuard Insurance', 'Protect what matters', 'light', 'cyan'),
    blocks: [
      linkBlock('Get a Quote', 'https://example.com', 5, 3, 1, 1, 'bg-cyan-700', 'text-white'),
      linkBlock('Claims', 'https://example.com', 4, 3, 6, 1, 'bg-cyan-600'),
      mapBlock('Office', 'Atlanta, GA', 4, 3, 1, 4, true),
      qrBlock('App', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 16. Event Planning
  {
    id: 'business-events-1', name: 'Event Planning', category: 'business', description: 'Event company',
    profile: createProfile('EventPro', 'Memorable events', 'light', 'violet'),
    blocks: [
      linkBlock('Our Services', 'https://example.com', 5, 3, 1, 1, 'bg-violet-600'),
      linkBlock('Gallery', 'https://example.com', 4, 3, 6, 1, 'bg-violet-500'),
      socialBlock('Instagram', 'instagram', 'eventpro', 3, 3, 1, 4, 'bg-pink-100'),
      mapBlock('Office', 'Las Vegas, NV', 6, 3, 4, 4, true),
    ],
  },
  // 17. Catering Company
  {
    id: 'business-catering-1', name: 'Catering', category: 'business', description: 'Event catering',
    profile: createProfile('Taste Catering', 'Exquisite catering', 'light', 'orange'),
    blocks: [
      linkBlock('Menu', 'https://example.com', 5, 3, 1, 1, 'bg-orange-600'),
      linkBlock('Book Event', 'https://example.com', 4, 3, 6, 1, 'bg-orange-500'),
      mapBlock('Kitchen', 'Miami, FL', 4, 3, 1, 4, true),
      qrBlock('Specials', 'https://example.com', 5, 3, 5, 4),
    ],
  },
  // 18. Printing Company
  {
    id: 'business-print-1', name: 'Printing', category: 'business', description: 'Print services',
    profile: createProfile('PrintMaster', 'Quality printing', 'light', 'gray'),
    blocks: [
      linkBlock('Order Online', 'https://example.com', 5, 3, 1, 1, 'bg-gray-700', 'text-white'),
      linkBlock('Services', 'https://example.com', 4, 3, 6, 1, 'bg-gray-600'),
      mapBlock('Print Shop', 'Denver, CO', 4, 3, 1, 4, true),
      qrBlock('Templates', 'https://example.com', 5, 3, 5, 4),
    ],
  },
];

// ==================== EXPORTS ====================
export const allTemplates: BentoTemplate[] = [
  ...retailTemplates,
  ...foodTemplates,
  ...servicesTemplates,
  ...creativeTemplates,
  ...personalTemplates,
  ...businessTemplates,
];

export function getTemplatesByCategory(category: TemplateCategory): BentoTemplate[] {
  switch (category) {
    case 'retail': return retailTemplates;
    case 'food': return foodTemplates;
    case 'services': return servicesTemplates;
    case 'creative': return creativeTemplates;
    case 'personal': return personalTemplates;
    case 'business': return businessTemplates;
    default: return allTemplates;
  }
}

export function getTemplateById(id: string): BentoTemplate | undefined {
  return allTemplates.find((t) => t.id === id);
}
