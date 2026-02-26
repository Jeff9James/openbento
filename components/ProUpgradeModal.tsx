import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Crown, Check, Zap, Shield, Globe, Sparkles } from 'lucide-react';

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
    description: 'Detailed insights and visitor tracking',
  },
];

export default function ProUpgradeModal({ isOpen, onClose }: ProUpgradeModalProps) {
  const handleUpgrade = () => {
    // In a real implementation, this would redirect to Stripe checkout
    // For now, we'll show an alert
    alert('Stripe integration coming soon! For now, please contact support to upgrade.');
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden ring-1 ring-gray-900/5"
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
                <p className="text-white/80">Unlock all features</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold">$9</span>
              <span className="text-white/80">/month</span>
            </div>
          </div>

          {/* Features */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What you get:</h3>

            <div className="space-y-4 mb-6">
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
              </div>
            </div>

            {/* Upgrade Button */}
            <button
              onClick={handleUpgrade}
              className="w-full py-4 bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Crown className="w-5 h-5" />
              Upgrade Now
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
