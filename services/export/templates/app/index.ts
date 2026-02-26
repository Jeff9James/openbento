/**
 * Generate the complete App.tsx for the exported project with SEO support
 */

import { SiteData } from '../../../../types';
import { ImageMap } from '../../imageExtractor';
import { generateImports } from './imports';
import { generateTypes } from './types';
import { generateSocialPlatformsConfig } from './socialPlatforms';
import { generateTiltHook, generateAnalyticsHook } from './hooks';
import { generateBlockComponent } from './blockComponent';
import {
  generateDesktopLayout,
  generateMobileLayout,
  generateMobileLayoutHelper,
  generateFooter,
  generateBackgroundBlur,
} from './layouts';
import { escapeHtml } from '../../helpers';

export const generateAppTsx = (data: SiteData, imageMap: ImageMap, siteId?: string): string => {
  const { profile, blocks } = data;
  const avatarSrc = imageMap['profile_avatar'] || profile.avatarUrl;

  // Avatar style configuration
  const avatarStyle = profile.avatarStyle || {
    shape: 'rounded',
    shadow: true,
    border: true,
    borderColor: '#ffffff',
    borderWidth: 4,
  };
  const avatarRadius =
    avatarStyle.shape === 'circle' ? '9999px' : avatarStyle.shape === 'square' ? '0' : '1.5rem';
  const avatarShadow = avatarStyle.shadow !== false ? '0 25px 50px -12px rgba(0,0,0,0.15)' : 'none';
  const avatarBorder =
    avatarStyle.border !== false
      ? `${avatarStyle.borderWidth || 4}px solid ${avatarStyle.borderColor || '#ffffff'}`
      : 'none';

  // Background style
  const bgStyle = profile.backgroundImage
    ? `{ backgroundImage: "url('${profile.backgroundImage}')", backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }`
    : `{ backgroundColor: '${profile.backgroundColor || '#f8fafc'}' }`;

  // Generate JSON data for blocks and profile
  const blocksJson = JSON.stringify(
    blocks.map((b) => ({
      ...b,
      imageUrl: b.imageUrl && imageMap[`block_${b.id}`] ? imageMap[`block_${b.id}`] : b.imageUrl,
    }))
  );

  const profileJson = JSON.stringify({
    ...profile,
    avatarUrl: avatarSrc,
  });

  // Layout parameters
  const layoutParams = {
    avatarRadius,
    avatarShadow,
    avatarBorder,
    bgStyle,
    showSocialInHeader: !!profile.showSocialInHeader,
    hasSocialAccounts: !!(profile.socialAccounts && profile.socialAccounts.length > 0),
    showBranding: profile.showBranding !== false,
    backgroundBlur: profile.backgroundBlur,
    backgroundImage: profile.backgroundImage,
  };

  // Site ID for analytics (use provided siteId or fallback)
  const analyticsId = data.profile.analytics?.enabled ? siteId || 'default' : '';

  // SEO metadata
  const title = escapeHtml(profile.name);
  const description = escapeHtml(profile.bio || `${profile.name}'s link-in-bio page`);
  const ogTitle = escapeHtml(profile.openGraph?.title || profile.name);
  const ogDescription = escapeHtml(profile.openGraph?.description || profile.bio || description);
  const ogImage = profile.openGraph?.image || profile.avatarUrl || '';
  const ogSiteName = escapeHtml(profile.openGraph?.siteName || profile.name);
  const twitterHandle = profile.openGraph?.twitterHandle ? `@${profile.openGraph.twitterHandle.replace('@', '')}` : '';
  const twitterCardType = profile.openGraph?.twitterCardType || 'summary_large_image';
  const primaryColor = profile.primaryColor || '#6366f1';

  // Assemble the complete App.tsx
  return `${generateImports()}
import { HelmetProvider, Helmet } from 'react-helmet-async'
${generateTypes()}
${generateSocialPlatformsConfig()}
${generateTiltHook()}
${generateBlockComponent()}

// Profile data
const profile = ${profileJson}
const blocks: BlockData[] = ${blocksJson}
${generateAnalyticsHook(analyticsId)}
${generateMobileLayoutHelper()}
// Sort blocks for mobile
const sortedBlocks = [...blocks].sort((a, b) => {
  const aRow = a.gridRow ?? 999
  const bRow = b.gridRow ?? 999
  const aCol = a.gridColumn ?? 999
  const bCol = b.gridColumn ?? 999
  if (aRow !== bRow) return aRow - bRow
  return aCol - bCol
})

function SEO() {
  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>${title}</title>
      <meta name="description" content="${description}" />
      <meta name="theme-color" content="${primaryColor}" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="${ogTitle}" />
      <meta property="og:description" content="${ogDescription}" />
      ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
      <meta property="og:site_name" content="${ogSiteName}" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="${twitterCardType}" />
      ${twitterHandle ? `<meta property="twitter:site" content="${twitterHandle}" />` : ''}
      <meta property="twitter:title" content="${ogTitle}" />
      <meta property="twitter:description" content="${ogDescription}" />
      ${ogImage ? `<meta property="twitter:image" content="${ogImage}" />` : ''}
    </Helmet>
  )
}

function AppContent() {
  useAnalytics()

  const avatarStyle = { borderRadius: '${avatarRadius}', boxShadow: '${avatarShadow}', border: '${avatarBorder}' }
  const bgStyle: React.CSSProperties = ${bgStyle}

  return (
    <div className="min-h-screen font-sans" style={bgStyle}>
      <SEO />
      ${generateBackgroundBlur(profile.backgroundImage, profile.backgroundBlur)}
      <div className="relative z-10">
${generateDesktopLayout(layoutParams)}

${generateMobileLayout(layoutParams)}

${generateFooter(layoutParams.showBranding)}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <HelmetProvider>
      <AppContent />
    </HelmetProvider>
  )
}
`;
};
