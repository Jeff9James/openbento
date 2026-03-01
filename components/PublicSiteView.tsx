import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SiteData, BlockData, BlockType } from '../types';
import { getSocialPlatformOption, buildSocialUrl } from '../socialPlatforms';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  Youtube,
  MapPin,
  Share2,
  QrCode,
  Star,
  BarChart3,
  Code,
} from 'lucide-react';

const PublicSiteView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [siteData, setSiteData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSite = async () => {
      if (!slug) {
        setError('Site not found');
        setLoading(false);
        return;
      }

      try {
        // Get Supabase URL from environment
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        if (!supabaseUrl) {
          throw new Error('Configuration error');
        }

        const response = await fetch(
          `${supabaseUrl}/functions/v1/openbento-serve-site?slug=${encodeURIComponent(slug)}`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Failed to load site');
        }

        const data = await response.json();
        if (!data.site) {
          throw new Error('Site not found');
        }

        setSiteData(data.site.data);
      } catch (err) {
        console.error('Error loading site:', err);
        setError(err instanceof Error ? err.message : 'Failed to load site');
      } finally {
        setLoading(false);
      }
    };

    loadSite();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading site...</p>
        </div>
      </div>
    );
  }

  if (error || !siteData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 size={32} className="text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Site Not Found</h1>
          <p className="text-gray-600 mb-4">{error || 'This site does not exist or has been unpublished.'}</p>
          <a href="/" className="text-violet-600 hover:text-violet-700 font-semibold">
            Go to OpenBento
          </a>
        </div>
      </div>
    );
  }

  const profile = siteData.profile;
  const blocks = siteData.blocks;

  // Background style
  const backgroundStyle: React.CSSProperties = profile.backgroundImage
    ? {
        backgroundImage: `url(${profile.backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    : profile.backgroundColor
      ? { backgroundColor: profile.backgroundColor }
      : { backgroundColor: '#f9fafb' };

  // Avatar style
  const getAvatarContainerClasses = () => {
    const style = profile.avatarStyle || { shape: 'rounded', shadow: true, border: true };
    const classes: string[] = [
      'w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-gray-100',
    ];

    if (style.shape === 'circle') classes.push('rounded-full');
    else if (style.shape === 'square') classes.push('rounded-none');
    else classes.push('rounded-3xl');

    if (style.shadow) classes.push('shadow-2xl');

    return classes.join(' ');
  };

  const getAvatarContainerStyle = (): React.CSSProperties => {
    const style = profile.avatarStyle || {
      shape: 'rounded',
      shadow: true,
      border: true,
      borderColor: '#ffffff',
      borderWidth: 4,
    };
    const styles: React.CSSProperties = {};

    if (style.border) {
      styles.border = `${style.borderWidth || 4}px solid ${style.borderColor || '#ffffff'}`;
    }

    return styles;
  };

  // Render block content
  const renderBlock = (block: BlockData) => {
    const bgColor = block.color || 'bg-white';
    const textColor = block.textColor || 'text-gray-900';

    switch (block.type) {
      case BlockType.LINK:
        return (
          <a
            href={block.content}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full w-full"
          >
            <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full flex flex-col justify-between hover:scale-[1.02] transition-transform shadow-sm`}>
              <div>
                {block.title && <h3 className="font-bold text-lg mb-1">{block.title}</h3>}
                {block.subtext && <p className="text-sm opacity-70">{block.subtext}</p>}
              </div>
              <ExternalLink size={16} className="opacity-50" />
            </div>
          </a>
        );

      case BlockType.TEXT:
        return (
          <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full shadow-sm`}>
            {block.title && <h3 className="font-bold text-lg mb-2">{block.title}</h3>}
            {block.content && <p className="text-sm whitespace-pre-wrap">{block.content}</p>}
          </div>
        );

      case BlockType.MEDIA:
        return (
          <div className={`${bgColor} rounded-2xl h-full overflow-hidden shadow-sm`}>
            {block.imageUrl && (
              <img
                src={block.imageUrl}
                alt={block.title || 'Media'}
                className="w-full h-full object-cover"
                style={{
                  objectPosition: block.mediaPosition
                    ? `${block.mediaPosition.x}% ${block.mediaPosition.y}%`
                    : 'center',
                }}
              />
            )}
          </div>
        );

      case BlockType.SOCIAL:
        if (!block.socialPlatform) return null;
        const socialOption = getSocialPlatformOption(block.socialPlatform);
        if (!socialOption) return null;
        const BrandIcon = socialOption.brandIcon;
        const FallbackIcon = socialOption.icon;
        const socialUrl = buildSocialUrl(block.socialPlatform, block.socialHandle || '');

        return (
          <a
            href={socialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div
              className={`${bgColor} ${textColor} rounded-2xl p-6 h-full flex items-center justify-between hover:scale-[1.02] transition-transform shadow-sm`}
              style={
                BrandIcon && socialOption.brandColor
                  ? { backgroundColor: `${socialOption.brandColor}15` }
                  : undefined
              }
            >
              <div className="flex items-center gap-3">
                {BrandIcon ? (
                  <span style={{ color: socialOption.brandColor }}>
                    <BrandIcon size={24} />
                  </span>
                ) : (
                  <FallbackIcon size={24} />
                )}
                <div>
                  <p className="font-bold text-lg">{socialOption.label}</p>
                  {block.socialHandle && (
                    <p className="text-sm opacity-70">@{block.socialHandle}</p>
                  )}
                </div>
              </div>
              <ExternalLink size={16} className="opacity-50" />
            </div>
          </a>
        );

      case BlockType.YOUTUBE:
        if (block.youtubeMode === 'single' && block.youtubeVideoId) {
          return (
            <div className={`${bgColor} rounded-2xl overflow-hidden shadow-sm`}>
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${block.youtubeVideoId}`}
                title={block.title || 'YouTube video'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="aspect-video"
              />
            </div>
          );
        }
        return null;

      case BlockType.MAP:
      case BlockType.MAP_EMBED:
        if (block.mapEmbedUrl) {
          return (
            <div className={`${bgColor} rounded-2xl overflow-hidden shadow-sm`}>
              <iframe
                src={block.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          );
        }
        return (
          <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full flex flex-col items-center justify-center shadow-sm`}>
            <MapPin size={32} className="opacity-50 mb-2" />
            <p className="text-sm opacity-70">Map location</p>
          </div>
        );

      case BlockType.SOCIAL_ICON:
        if (!block.socialPlatform) return null;
        const iconOption = getSocialPlatformOption(block.socialPlatform);
        if (!iconOption) return null;
        const IconBrandIcon = iconOption.brandIcon;
        const IconFallbackIcon = iconOption.icon;
        const iconUrl = buildSocialUrl(block.socialPlatform, block.socialHandle || '');

        return (
          <a
            href={iconUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <div
              className={`${bgColor} rounded-2xl h-full flex items-center justify-center hover:scale-110 transition-transform shadow-sm`}
              style={
                IconBrandIcon && iconOption.brandColor
                  ? { backgroundColor: `${iconOption.brandColor}15` }
                  : undefined
              }
            >
              {IconBrandIcon ? (
                <span style={{ color: iconOption.brandColor }}>
                  <IconBrandIcon size={20} />
                </span>
              ) : (
                <IconFallbackIcon size={20} />
              )}
            </div>
          </a>
        );

      case BlockType.RATING:
        return (
          <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full shadow-sm`}>
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-2xl">{block.ratingValue || 4.5}</span>
            </div>
            {block.ratingCount && (
              <p className="text-sm opacity-70">{block.ratingCount} reviews</p>
            )}
          </div>
        );

      case BlockType.QR_CODE:
        return (
          <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full flex flex-col items-center justify-center shadow-sm`}>
            <QrCode size={48} className="opacity-50 mb-2" />
            <p className="text-sm opacity-70">{block.qrLabel || 'Scan to visit'}</p>
          </div>
        );

      case BlockType.CHART:
        return (
          <div className={`${bgColor} ${textColor} rounded-2xl p-6 h-full flex flex-col items-center justify-center shadow-sm`}>
            <BarChart3 size={48} className="opacity-50 mb-2" />
            <p className="text-sm opacity-70">{block.chartConfig?.title || 'Analytics Chart'}</p>
          </div>
        );

      case BlockType.CUSTOM_HTML:
        return (
          <div className={`${bgColor} rounded-2xl h-full shadow-sm overflow-hidden`}>
            {block.customHtml && (
              <div dangerouslySetInnerHTML={{ __html: block.customHtml }} />
            )}
          </div>
        );

      case BlockType.SPACER:
        return <div className="h-full" />;

      default:
        return null;
    }
  };

  // Mobile view (single column)
  const MobileView = () => (
    <div className="max-w-md mx-auto px-4 py-8 space-y-4">
      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center text-center mb-8"
      >
        <div className={getAvatarContainerClasses()} style={getAvatarContainerStyle()}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
              {profile.name.charAt(0)}
            </div>
          )}
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-2">{profile.name}</h1>
        <p className="text-gray-600 whitespace-pre-wrap">{profile.bio}</p>

        {/* Social icons */}
        {profile.showSocialInHeader &&
          profile.socialAccounts &&
          profile.socialAccounts.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-4 justify-center">
              {profile.socialAccounts.map((account) => {
                const option = getSocialPlatformOption(account.platform);
                if (!option) return null;
                const BrandIcon = option.brandIcon;
                const FallbackIcon = option.icon;
                const url = buildSocialUrl(account.platform, account.handle);
                return (
                  <a
                    key={account.platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                  >
                    {BrandIcon ? (
                      <span style={{ color: option.brandColor }}>
                        <BrandIcon size={24} />
                      </span>
                    ) : (
                      <FallbackIcon size={24} />
                    )}
                  </a>
                );
              })}
            </div>
          )}
      </motion.div>

      {/* Blocks */}
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <motion.div
            key={block.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {renderBlock(block)}
          </motion.div>
        ))}
      </div>

      {/* Branding */}
      {profile.showBranding !== false && (
        <div className="text-center pt-8">
          <p className="text-xs text-gray-400">
            Built with <span className="font-semibold">OpenBento</span>
          </p>
        </div>
      )}
    </div>
  );

  // Desktop view (grid)
  const DesktopView = () => (
    <div className="min-h-screen flex">
      {/* Left sidebar - Profile */}
      <div className="hidden lg:flex fixed left-0 top-0 w-[420px] h-screen flex-col justify-center items-start px-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col items-start"
        >
          <div className={getAvatarContainerClasses()} style={getAvatarContainerStyle()}>
            {profile.avatarUrl ? (
              <img src={profile.avatarUrl} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-3">{profile.name}</h1>
          <p className="text-gray-600 whitespace-pre-wrap max-w-md">{profile.bio}</p>

          {/* Social icons */}
          {profile.showSocialInHeader &&
            profile.socialAccounts &&
            profile.socialAccounts.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-4">
                {profile.socialAccounts.map((account) => {
                  const option = getSocialPlatformOption(account.platform);
                  if (!option) return null;
                  const BrandIcon = option.brandIcon;
                  const FallbackIcon = option.icon;
                  const url = buildSocialUrl(account.platform, account.handle);
                  return (
                    <a
                      key={account.platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-white rounded-full shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      {BrandIcon ? (
                        <span style={{ color: option.brandColor }}>
                          <BrandIcon size={24} />
                        </span>
                      ) : (
                        <FallbackIcon size={24} />
                      )}
                    </a>
                  );
                })}
              </div>
            )}
        </motion.div>
      </div>

      {/* Right - Grid */}
      <div className="lg:ml-[420px] flex-1 p-8 lg:p-12 pt-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks.map((block, index) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{
                  gridColumn: `span ${Math.min(block.colSpan, 3)}`,
                  gridRow: `span ${block.rowSpan}`,
                }}
                className="min-h-[150px]"
              >
                {renderBlock(block)}
              </motion.div>
            ))}
          </div>

          {/* Branding */}
          {profile.showBranding !== false && (
            <div className="text-center pt-12">
              <p className="text-sm text-gray-400">
                Built with <span className="font-semibold">OpenBento</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Mobile view */}
      <div className="lg:hidden">
        <MobileView />
      </div>

      {/* Desktop view */}
      <div className="hidden lg:block">
        <DesktopView />
      </div>
    </div>
  );
};

export default PublicSiteView;
