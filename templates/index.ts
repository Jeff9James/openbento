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

export const retailTemplates: BentoTemplate[] = [
  {
    id: 'retail-boutique-1', name: 'Fashion Boutique', category: 'retail', description: 'Elegant boutique',
    profile: { name: 'Style Studio', bio: 'Curated fashion', avatarUrl: '', theme: 'light', primaryColor: 'pink', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'Shop Now', content: 'https://example.com', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-pink-500', textColor: 'text-white' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Instagram', content: '', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1, color: 'bg-pink-100', socialPlatform: 'instagram', socialHandle: 'stylestudio' },
      { id: genId(), type: BlockType.GOOGLE_MAP, title: 'Visit Us', content: 'New York, NY', colSpan: 4, rowSpan: 3, gridColumn: 1, gridRow: 4, showGetDirections: true },
      { id: genId(), type: BlockType.GOOGLE_RATING, title: 'Rating', colSpan: 2, rowSpan: 3, gridColumn: 5, gridRow: 4 },
      { id: genId(), type: BlockType.QR_CODE, title: 'Scan to Visit', qrCodeUrl: 'https://example.com', showQrDownload: true, colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 4 },
    ],
  },
];

export const foodTemplates: BentoTemplate[] = [
  {
    id: 'food-cafe-1', name: 'Cozy Cafe', category: 'food', description: 'Coffee shop',
    profile: { name: 'Morning Brew', bio: 'Best coffee in town', avatarUrl: '', theme: 'light', primaryColor: 'amber', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'Order Online', content: 'https://example.com', colSpan: 5, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-amber-600', textColor: 'text-white' },
      { id: genId(), type: BlockType.TEXT, title: 'Hours', content: 'Mon-Fri: 6AM-7PM', colSpan: 2, rowSpan: 3, gridColumn: 6, gridRow: 1, color: 'bg-amber-50' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Instagram', content: '', colSpan: 2, rowSpan: 3, gridColumn: 8, gridRow: 1, color: 'bg-pink-100', socialPlatform: 'instagram', socialHandle: 'morningbrew' },
      { id: genId(), type: BlockType.GOOGLE_MAP, title: 'Find Us', content: 'Brooklyn, NY', colSpan: 4, rowSpan: 4, gridColumn: 1, gridRow: 4, showGetDirections: true },
      { id: genId(), type: BlockType.GOOGLE_RATING, colSpan: 5, rowSpan: 4, gridColumn: 5, gridRow: 4 },
    ],
  },
];

export const servicesTemplates: BentoTemplate[] = [
  {
    id: 'services-salon-1', name: 'Hair Salon', category: 'services', description: 'Hair styling',
    profile: { name: 'Luxe Salon', bio: 'Style that defines you', avatarUrl: '', theme: 'light', primaryColor: 'pink', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'Book Appointment', content: 'https://example.com', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-pink-500', textColor: 'text-white' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Instagram', content: '', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1, color: 'bg-pink-100', socialPlatform: 'instagram', socialHandle: 'luxesalon' },
      { id: genId(), type: BlockType.GOOGLE_MAP, title: 'Salon', content: 'Beverly Hills, CA', colSpan: 4, rowSpan: 3, gridColumn: 1, gridRow: 4, showGetDirections: true },
      { id: genId(), type: BlockType.GOOGLE_RATING, title: 'Reviews', colSpan: 5, rowSpan: 3, gridColumn: 5, gridRow: 4 },
    ],
  },
];

export const creativeTemplates: BentoTemplate[] = [
  {
    id: 'creative-photographer-1', name: 'Photographer', category: 'creative', description: 'Photography',
    profile: { name: 'Lens Art', bio: 'Capturing moments', avatarUrl: '', theme: 'dark', primaryColor: 'gray', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'View Portfolio', content: 'https://example.com', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-gray-800', textColor: 'text-white' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Instagram', content: '', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1, color: 'bg-pink-100', socialPlatform: 'instagram', socialHandle: 'lensart' },
      { id: genId(), type: BlockType.QR_CODE, title: 'Contact Card', qrCodeUrl: 'https://example.com', showQrDownload: true, colSpan: 4, rowSpan: 3, gridColumn: 1, gridRow: 4 },
      { id: genId(), type: BlockType.GOOGLE_MAP, title: 'Studio', content: 'Los Angeles, CA', colSpan: 5, rowSpan: 3, gridColumn: 5, gridRow: 4, showGetDirections: true },
    ],
  },
];

export const personalTemplates: BentoTemplate[] = [
  {
    id: 'personal-blog-1', name: 'Personal Blog', category: 'personal', description: 'Blog',
    profile: { name: 'My Life', bio: 'Sharing my journey', avatarUrl: '', theme: 'light', primaryColor: 'blue', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'Read Blog', content: 'https://example.com', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-blue-600', textColor: 'text-white' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Twitter', content: '', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1, color: 'bg-black', socialPlatform: 'x', socialHandle: 'mylife' },
      { id: genId(), type: BlockType.QR_CODE, title: 'Subscribe', qrCodeUrl: 'https://example.com', showQrDownload: true, colSpan: 9, rowSpan: 3, gridColumn: 1, gridRow: 4 },
    ],
  },
];

export const businessTemplates: BentoTemplate[] = [
  {
    id: 'business-startup-1', name: 'Startup', category: 'business', description: 'Tech startup',
    profile: { name: 'TechStart', bio: 'Innovating the future', avatarUrl: '', theme: 'dark', primaryColor: 'indigo', showBranding: true, socialAccounts: [] },
    blocks: [
      { id: genId(), type: BlockType.LINK, title: 'Our Product', content: 'https://example.com', colSpan: 6, rowSpan: 3, gridColumn: 1, gridRow: 1, color: 'bg-indigo-700', textColor: 'text-white' },
      { id: genId(), type: BlockType.SOCIAL, title: 'Twitter', content: '', colSpan: 3, rowSpan: 3, gridColumn: 7, gridRow: 1, color: 'bg-black', socialPlatform: 'x', socialHandle: 'techstart' },
      { id: genId(), type: BlockType.GOOGLE_MAP, title: 'Office', content: 'San Francisco, CA', colSpan: 4, rowSpan: 3, gridColumn: 1, gridRow: 4, showGetDirections: true },
      { id: genId(), type: BlockType.GOOGLE_RATING, colSpan: 5, rowSpan: 3, gridColumn: 5, gridRow: 4 },
    ],
  },
];

export const allTemplates: BentoTemplate[] = [
  ...retailTemplates, ...foodTemplates, ...servicesTemplates, ...creativeTemplates, ...personalTemplates, ...businessTemplates,
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
