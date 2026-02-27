import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Shield, Globe, Sparkles, Loader2, CreditCard, Lock } from 'lucide-react';
import { createCheckoutSession, PRICING, isDodoConfigured } from '../lib/dodo';
import { useAuth } from '../lib/AuthContext';

interface ProUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const features = [
  {
    icon: Globe,
    title: 'Custom Domain',
    description: 'Use your own domain name for your bento page',
  },
  {
    icon: Shield,
    title: 'Remove Branding',
    description: 'Hide the "Made with OpenBento" watermark',
  },
  {
    icon: Zap,
    title: 'Priority Support',
    description: 'Get help faster with priority customer support',
  },
  {
    icon: Sparkles,
    title: 'Advanced Analytics',
    description: 'Detailed insights with charts and visitor tracking',
  },
  {
    icon: CreditCard,
    title: 'AI Website Editor',
    description: 'Free local AI suggestions with WebLLM',
  },
  {
    icon: Globe,
    title: '3D Room Views',
    description: 'Interactive Three.js blocks for immersive experiences',
  },
  {
    icon: Lock,
    title: 'No Ads',
    description: 'Enjoy an ad-free experience across all pages',
  },
  {
    icon: Sparkles,
    title: 'Live Preview Editor',
    description: 'Webflow-like editing with custom CSS support',
  },
];

export default function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const { user, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const dodoConfigured = isDodoConfigured();

  const handleUpgrade = async () => {
    if (!isAuthenticated) {
      setError('Please sign in first to upgrade to Pro');
      return;
    }

    if (!dodoConfigured) {
      setError('Payment system is currently being set up. Please try again later.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const productId =
        billingInterval === 'monthly'
          ? PRICING.PRO_MONTHLY.productId
          : PRICING.PRO_YEARLY.productId;

      if (!productId) {
        setError('Product configuration not found. Please contact support.');
        setIsLoading(false);
        return;
      }

      const session = await createCheckoutSession(productId, user?.email);

      if (session?.checkout_url) {
        window.location.href = session.checkout_url;
      } else {
        setError('Failed to start checkout. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden ring-1 ring-gray-900/5 max-h-[90vh] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Upgrade to Pro"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-amber-400 via-orange-500 to-pink-500 px-6 py-8 text-white">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Crown className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Upgrade to Pro</h2>
                <p className="text-white/80">Unlock all premium features</p>
              </div>
            </div>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="inline-flex bg-white/20 rounded-xl p-1">
                <button
                  onClick={() => setBillingInterval('monthly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    billingInterval === 'monthly'
                      ? 'bg-white text-orange-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingInterval('yearly')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    billingInterval === 'yearly'
                      ? 'bg-white text-orange-600'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Yearly
                  <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                    Save 27%
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-baseline justify-center gap-1 mt-4">
              <span className="text-4xl font-bold">
                ${billingInterval === 'monthly' ? PRICING.PRO_MONTHLY.amount : PRICING.PRO_YEARLY.amount}
              </span>
              <span className="text-white/80">/{billingInterval === 'monthly' ? 'month' : 'year'}</span>
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you get:</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{feature.title}</p>
                    <p className="text-sm text-gray-500">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Free vs Pro comparison */}
            <div className="bg-gray-50 rounded-2xl p-4 mb-6">
              <div className="grid grid-cols-3 gap-4 text-center text-sm">
                <div></div>
                <div className="font-medium text-gray-500">Free</div>
                <div className="font-medium text-amber-600">Pro</div>

                <div className="text-left text-gray-600">Custom Domain</div>
                <div className="text-gray-400">—</div>
                <div className="text-amber-600"><Check className="w-4 h-4 mx-auto" /></div>

                <div className="text-left text-gray-600">Branding</div>
                <div className="text-gray-400">Visible</div>
                <div className="text-amber-600">Hidden</div>

                <div className="text-left text-gray-600">Projects</div>
                <div className="text-gray-600">3</div>
                <div className="text-amber-600">Unlimited</div>

                <div className="text-left text-gray-600">Analytics</div>
                <div className="text-gray-600">Basic</div>
                <div className="text-amber-600">Advanced</div>

                <div className="text-left text-gray-600">AI Editor</div>
                <div className="text-gray-400">—</div>
                <div className="text-amber-600"><Check className="w-4 h-4 mx-auto" /></div>

                <div className="text-left text-gray-600">3D Blocks</div>
                <div className="text-gray-400">—</div>
                <div className="text-amber-600"><Check className="w-4 h-4 mx-auto" /></div>

                <div className="text-left text-gray-600">Advertisements</div>
                <div className="text-gray-600">Shown</div>
                <div className="text-amber-600">Removed</div>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {error}
              </div>
            )}

            {!isAuthenticated && (
              <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                Please sign in first to upgrade to Pro
              </div>
            )}

            {!dodoConfigured && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm">
                DodoPayments is being configured. Contact support to upgrade.
              </div>
            )}

            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              disabled={isLoading || !isAuthenticated || !dodoConfigured}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5" />
                  Upgrade Now
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Secure payment powered by DodoPayments. Cancel anytime. No questions asked.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
