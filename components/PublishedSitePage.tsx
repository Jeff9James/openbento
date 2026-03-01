import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PublishedSite, getPublishedSiteBySubdomain } from '../services/publicationService';
import Block from './Block';
import { BlockData, UserProfile } from '../types';
import { motion } from 'framer-motion';

interface PublishedSitePageProps {
  subdomain?: string;
}

// Helper to get avatar container classes based on style
const getAvatarContainerClasses = (style?: { shape: 'circle' | 'square' | 'rounded'; shadow?: boolean; border?: boolean }): string => {
  const s = style || { shape: 'rounded', shadow: true, border: true };
  const classes: string[] = [
    'w-32',
    'h-32',
    'mx-auto',
    'overflow-hidden',
    'relative',
    'z-10',
  ];

  if (s.shape === 'circle') classes.push('rounded-full');
  else if (s.shape === 'square') classes.push('rounded-none');
  else classes.push('rounded-3xl');

  if (s.shadow) classes.push('shadow-2xl');

  return classes.join(' ');
};

// Helper to get avatar container style
const getAvatarContainerStyle = (style?: { shape: 'circle' | 'square' | 'rounded'; shadow?: boolean; border?: boolean; borderColor?: string; borderWidth?: number }): React.CSSProperties => {
  const s = style || {
    shape: 'rounded' as const,
    shadow: true,
    border: true,
    borderColor: '#ffffff',
    borderWidth: 4,
  };
  const styles: React.CSSProperties = {};

  if (s.border) {
    styles.border = `${s.borderWidth || 4}px solid ${s.borderColor || '#ffffff'}`;
  }

  return styles;
};

// Theme colors mapping
const themeColors: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  pink: 'bg-pink-500',
  red: 'bg-red-500',
  orange: 'bg-orange-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  indigo: 'bg-indigo-500',
};

const PublishedSitePage: React.FC<PublishedSitePageProps> = ({ subdomain: propSubdomain }) => {
  const params = useParams();
  const [site, setSite] = useState<PublishedSite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const subdomain = propSubdomain || params.subdomain;
    if (!subdomain) {
      setError('No subdomain provided');
      setLoading(false);
      return;
    }

    const publishedSite = getPublishedSiteBySubdomain(subdomain);
    if (!publishedSite) {
      setError('Site not found');
      setLoading(false);
      return;
    }

    setSite(publishedSite);
    setLoading(false);
  }, [params.subdomain, propSubdomain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">404</h1>
          <p className="text-gray-600">{error || 'Site not found'}</p>
        </div>
      </div>
    );
  }

  const { profile, blocks } = site.data;
  const primaryColorClass = themeColors[profile.primaryColor] || themeColors.blue;

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

  return (
    <div className="min-h-screen" style={backgroundStyle}>
      {/* Background blur overlay */}
      {profile.backgroundImage && profile.backgroundBlur && profile.backgroundBlur > 0 && (
        <div
          className="fixed inset-0 z-0"
          style={{
            backdropFilter: `blur(${profile.backgroundBlur}px)`,
            WebkitBackdropFilter: `blur(${profile.backgroundBlur}px)`,
          }}
        />
      )}

      <div className="relative z-10 min-h-screen flex flex-col items-center px-4 py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          {/* Profile Header */}
          <div className="text-center mb-8 sm:mb-12">
            {/* Avatar */}
            <div
              className={getAvatarContainerClasses(profile.avatarStyle)}
              style={getAvatarContainerStyle(profile.avatarStyle)}
            >
              <img
                src={profile.avatarUrl || 'https://via.placeholder.com/128'}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Name */}
            <h1 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900">
              {profile.name}
            </h1>

            {/* Bio */}
            {profile.bio && (
              <p className="mt-2 text-gray-600 max-w-lg mx-auto whitespace-pre-line">
                {profile.bio}
              </p>
            )}

            {/* Social Accounts in Header */}
            {profile.showSocialInHeader && profile.socialAccounts && profile.socialAccounts.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {profile.socialAccounts.map((account, idx) => (
                  <a
                    key={idx}
                    href={`https://${account.platform}.com/${account.handle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-3 py-1.5 rounded-full text-sm font-medium text-white ${primaryColorClass} hover:opacity-90 transition-opacity`}
                  >
                    @{account.handle}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blocks
              .filter((block) => block.gridColumn !== undefined && block.gridRow !== undefined)
              .sort((a, b) => {
                const aRow = a.gridRow || 999;
                const bRow = b.gridRow || 999;
                if (aRow !== bRow) return aRow - bRow;
                return (a.gridColumn || 999) - (b.gridColumn || 999);
              })
              .map((block) => (
                <Block
                  key={block.id}
                  block={block}
                  profile={profile}
                  isPublishedView={true}
                  onEdit={() => {}}
                  onDelete={() => {}}
                  onDuplicate={() => {}}
                  onMove={() => {}}
                  onResize={() => {}}
                />
              ))}
          </div>

          {/* Footer / Branding */}
          {profile.showBranding && (
            <div className="mt-12 text-center">
              <a
                href="/"
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                Made with OpenBento
              </a>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PublishedSitePage;
