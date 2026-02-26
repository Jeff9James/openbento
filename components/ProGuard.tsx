import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, X, Sparkles, Zap, Shield, Globe, Code, Box } from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import type { ProFeatureLimits } from '../hooks/useProFeatures';

type ProFeature = keyof ProFeatureLimits;

interface ProGuardProps {
  feature: ProFeature;
  children?: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradePrompt?: boolean;
  onUpgradeClick?: () => void;
}

const featureMetadata: Record<
  ProFeature,
  { icon: React.ElementType; title: string; description: string }
> = {
  maxProjects: {
    icon: Globe,
    title: 'More Projects',
    description: 'Create unlimited bento projects',
  },
  maxBlocksPerProject: {
    icon: Box,
    title: 'More Blocks',
    description: 'Add unlimited blocks to your projects',
  },
  canUseCustomDomain: {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Use your own domain name',
  },
  canRemoveBranding: {
    icon: Shield,
    title: 'Remove Branding',
    description: 'Hide OpenBento branding',
  },
  canUseAdvancedAnalytics: {
    icon: Zap,
    title: 'Advanced Analytics',
    description: 'Detailed insights and charts',
  },
  canUseWebLLM: {
    icon: Sparkles,
    title: 'AI WebLLM',
    description: 'Free local AI for layout suggestions',
  },
  canUse3DBlocks: {
    icon: Box,
    title: '3D Blocks',
    description: 'Interactive 3D room views',
  },
  canUseCustomCSS: {
    icon: Code,
    title: 'Custom CSS',
    description: 'Add your own custom styles',
  },
  canUseLivePreview: {
    icon: Zap,
    title: 'Live Preview',
    description: 'Real-time preview while editing',
  },
  canExportToAllPlatforms: {
    icon: Globe,
    title: 'All Platforms',
    description: 'Export to all deployment platforms',
  },
  hasPrioritySupport: {
    icon: Shield,
    title: 'Priority Support',
    description: 'Get help faster',
  },
  hasNoAds: {
    icon: Shield,
    title: 'No Ads',
    description: 'Remove all advertisements',
  },
};

export const ProGuard: React.FC<ProGuardProps> = ({
  feature,
  children,
  fallback,
  showUpgradePrompt = true,
  onUpgradeClick,
}) => {
  const { checkFeature } = useProFeatures();
  const hasAccess = checkFeature(feature);

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradePrompt) {
    return null;
  }

  const meta = featureMetadata[feature];
  const Icon = meta.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
    >
      <div className="absolute -right-6 -top-6 opacity-10">
        <Crown className="h-32 w-32 text-amber-500" />
      </div>

      <div className="relative flex flex-col items-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg">
          <Lock className="h-8 w-8 text-white" />
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">{meta.title}</h3>
        <p className="mb-6 max-w-xs text-sm text-gray-600">{meta.description}</p>

        <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 shadow-sm">
          <Icon className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium text-gray-700">Pro Feature</span>
        </div>

        {onUpgradeClick && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgradeClick}
            className="mt-6 flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            <Crown className="h-5 w-5" />
            Upgrade to Pro
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

interface ProBadgeProps {
  className?: string;
}

export const ProBadge: React.FC<ProBadgeProps> = ({ className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-2 py-0.5 text-xs font-bold text-white ${className}`}
    >
      <Crown className="h-3 w-3" />
      PRO
    </span>
  );
};

interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({
  isOpen,
  onClose,
  onUpgrade,
  feature = 'this feature',
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 p-8 text-center text-white">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm"
          >
            <Crown className="h-10 w-10" />
          </motion.div>
          <h2 className="mb-2 text-2xl font-bold">Upgrade to Pro</h2>
          <p className="text-white/90">Unlock {feature} and more</p>
        </div>

        <div className="p-6">
          <div className="mb-6 space-y-3">
            {Object.entries(featureMetadata)
              .slice(2, 7)
              .map(([key, meta]) => (
                <div key={key} className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
                    <meta.icon className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{meta.title}</span>
                </div>
              ))}
          </div>

          <div className="mb-6 flex items-center justify-center gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">$9</div>
              <div className="text-sm text-gray-500">/month</div>
            </div>
            <div className="text-gray-300">or</div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">$79</div>
              <div className="text-sm text-gray-500">/year</div>
              <div className="text-xs font-medium text-green-600">Save 27%</div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onUpgrade}
            className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 py-4 font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
          >
            Upgrade Now
          </motion.button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Cancel anytime. No questions asked.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProGuard;
