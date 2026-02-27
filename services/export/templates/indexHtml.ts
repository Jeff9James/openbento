/**
 * Generate index.html for exported project with SEO and PWA support
 */

import { escapeHtml } from '../helpers';
import { SiteData } from '../../../types';
import { MediaMap } from '../mediaExtractor';

export const generateIndexHtml = (data: SiteData, mediaMap?: MediaMap): string => {
  const { profile } = data;
  const title = escapeHtml(profile.name);
  const description = escapeHtml(profile.bio || `${profile.name}'s link-in-bio page`);
  const ogTitle = escapeHtml(profile.openGraph?.title || profile.name);
  const ogDescription = escapeHtml(profile.openGraph?.description || profile.bio || '');
  const ogImage = mediaMap?.['og_image'] || profile.openGraph?.image || mediaMap?.['profile_avatar'] || profile.avatarUrl || '';
  const ogSiteName = escapeHtml(profile.openGraph?.siteName || profile.name);
  const twitterHandle = profile.openGraph?.twitterHandle ? `@${profile.openGraph.twitterHandle.replace('@', '')}` : '';
  const twitterCardType = profile.openGraph?.twitterCardType || 'summary_large_image';

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="${description}" />
    <meta name="theme-color" content="${profile.primaryColor || '#6366f1'}" />
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${ogTitle}" />
    <meta property="og:description" content="${ogDescription}" />
    ${ogImage ? `<meta property="og:image" content="${ogImage}" />` : ''}
    <meta property="og:site_name" content="${ogSiteName}" />
    
    <!-- Twitter -->
    <meta property="twitter:card" content="${twitterCardType}" />
    ${twitterHandle ? `<meta property="twitter:site" content="${twitterHandle}" />` : ''}
    <meta property="twitter:title" content="${ogTitle}" />
    <meta property="twitter:description" content="${ogDescription}" />
    ${ogImage ? `<meta property="twitter:image" content="${ogImage}" />` : ''}
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    
    <!-- Apple Touch Icon -->
    <link rel="apple-touch-icon" href="/icon-192x192.png" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    <meta name="apple-mobile-web-app-title" content="${title}" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
    
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <title>${title}</title>
    
    <!-- PWA Register Service Worker -->
    <script>
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
          navigator.serviceWorker.register('/sw.js')
            .then((reg) => console.log('SW registered:', reg.scope))
            .catch((err) => console.log('SW registration failed:', err));
        });
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
};
