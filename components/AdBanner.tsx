import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import { ZeroClickAd } from './ZeroClickAd';

interface AdBannerProps {
  variant?: 'banner' | 'sidebar' | 'inline' | 'modal';
  onUpgradeClick?: () => void;
  className?: string;
}

const AdContent = {
  banner: {
    title: 'Remove Ads with Pro',
    description: 'Get an ad-free experience and unlock premium features',
    cta: 'Upgrade Now',
  },
  sidebar: {
    title: 'Go Pro',
    description: 'Remove ads & unlock all features',
    cta: 'Upgrade',
  },
  inline: {
    title: 'Pro Feature',
    description: 'Upgrade to remove ads',
    cta: 'Learn More',
  },
  modal: {
    title: 'Support OpenBento',
    description: 'Upgrade to Pro for an ad-free experience and premium features',
    cta: 'Upgrade to Pro',
  },
};

export const AdBanner: React.FC<AdBannerProps> = ({
  variant = 'banner',
  onUpgradeClick,
  className = '',
}) => {
  const { hasNoAds, isPro } = useProFeatures();

  // Don't show ads for Pro users
  if (hasNoAds) {
    return null;
  }

  const content = AdContent[variant];

  if (variant === 'banner') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative overflow-hidden ${className}`}
      >
        {/* ZeroClick Ad at the top */}
        <ZeroClickAd
          query="productivity software developer tools"
          format="inline"
          className="mb-3"
        />
        {/* Pro upgrade banner */}
        <div className="rounded-xl bg-gradient-to-r from-amber-100 via-orange-50 to-pink-100 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500">
                <Crown className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">{content.title}</p>
                <p className="text-xs text-gray-600">{content.description}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpgradeClick}
              className="shrink-0 rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
            >
              {content.cta}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`space-y-4 ${className}`}
      >
        {/* ZeroClick Ad */}
        <ZeroClickAd
          query="software tools SaaS"
          format="card"
        />
        {/* Pro upgrade card */}
        <div className="rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-5">
          <div className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h4 className="mb-1 font-semibold text-gray-900">{content.title}</h4>
            <p className="mb-4 text-sm text-gray-600">{content.description}</p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onUpgradeClick}
              className="w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
            >
              {content.cta}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === 'inline') {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`space-y-3 ${className}`}
      >
        <ZeroClickAd
          query="developer tools"
          format="compact"
        />
        <div className="flex items-center justify-between rounded-lg border border-dashed border-gray-300 bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Crown className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-gray-600">{content.description}</span>
          </div>
          <button
            onClick={onUpgradeClick}
            className="text-sm font-medium text-violet-600 hover:text-violet-700"
          >
            {content.cta}
          </button>
        </div>
      </motion.div>
    );
  }

  // Modal variant
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-2xl bg-white p-6 shadow-xl ${className}`}
    >
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500">
          <Crown className="h-8 w-8 text-white" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-900">{content.title}</h3>
        <p className="mb-6 text-gray-600">{content.description}</p>

        {/* Show a ZeroClick ad in the modal */}
        <div className="mb-6">
          <ZeroClickAd
            query="premium software"
            format="inline"
          />
        </div>

        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradeClick}
            className="flex-1 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 py-3 font-semibold text-white"
          >
            {content.cta}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// ZeroClick Ad wrapper for direct use
interface ZeroClickAdWrapperProps {
  query?: string;
  format?: 'card' | 'inline' | 'compact';
  className?: string;
}

export const ZeroClickAdWrapper: React.FC<ZeroClickAdWrapperProps> = ({
  query = 'software tools',
  format = 'card',
  className = '',
}) => {
  const { hasNoAds } = useProFeatures();

  if (hasNoAds) {
    return null;
  }

  return <ZeroClickAd query={query} format={format} className={className} />;
};

// Legacy GoogleAd component - now redirects to ZeroClick
// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface GoogleAdProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
}

// This component is kept for backwards compatibility but now uses ZeroClick
export const GoogleAd: React.FC<GoogleAdProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  slot,
  format = 'auto',
  className = '',
}) => {
  const { hasNoAds } = useProFeatures();

  if (hasNoAds) {
    return null;
  }

  // Map AdSense formats to ZeroClick formats
  const zeroClickFormat = format === 'vertical' ? 'card' : 'inline';

  return (
    <ZeroClickAd
      query="software SaaS tools"
      format={zeroClickFormat}
      className={className}
    />
  );
};

// Ad container that wraps content with ads
interface AdContainerProps {
  children: React.ReactNode;
  showTopAd?: boolean;
  showBottomAd?: boolean;
  showSidebarAd?: boolean;
  onUpgradeClick?: () => void;
}

export const AdContainer: React.FC<AdContainerProps> = ({
  children,
  showTopAd = false,
  showBottomAd = false,
  showSidebarAd = false,
  onUpgradeClick,
}) => {
  const { hasNoAds } = useProFeatures();

  if (hasNoAds) {
    return <>{children}</>;
  }

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-4">
        {showTopAd && <AdBanner variant="banner" onUpgradeClick={onUpgradeClick} />}
        {children}
        {showBottomAd && (
          <div className="pt-4">
            <AdBanner variant="banner" onUpgradeClick={onUpgradeClick} />
          </div>
        )}
      </div>
      {showSidebarAd && (
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-4 space-y-4">
            <AdBanner variant="sidebar" onUpgradeClick={onUpgradeClick} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdBanner;
