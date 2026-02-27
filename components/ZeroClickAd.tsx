import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Loader2 } from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';

// ZeroClick Offer type based on API documentation
interface ZeroClickOffer {
  id: string;
  title: string;
  subtitle?: string;
  content?: string;
  cta?: string;
  clickUrl: string;
  imageUrl?: string;
  brand?: {
    name: string;
    url?: string;
    imageUrl?: string;
  };
  price?: {
    amount: string;
    currency: string;
  };
  rating?: {
    value: number;
    count: number;
  };
}

interface ZeroClickAdProps {
  query?: string;
  limit?: number;
  format?: 'card' | 'inline' | 'compact';
  className?: string;
  onImpressionTracked?: () => void;
}

const ZEROCLOCK_API_BASE = 'https://zeroclick.dev';

export const ZeroClickAd: React.FC<ZeroClickAdProps> = ({
  query = 'software tools',
  limit = 1,
  format = 'card',
  className = '',
  onImpressionTracked,
}) => {
  const { hasNoAds } = useProFeatures();
  const [offers, setOffers] = useState<ZeroClickOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [impressionsTracked, setImpressionsTracked] = useState<Set<string>>(new Set());

  const apiKey = import.meta.env.VITE_ZEROCLICK_API_KEY;

  // Fetch offers from ZeroClick API
  const fetchOffers = useCallback(async () => {
    if (!apiKey) {
      setIsLoading(false);
      setError('ZeroClick API key not configured');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`${ZEROCLOCK_API_BASE}/api/v2/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zc-api-key': apiKey,
        },
        body: JSON.stringify({
          method: 'client',
          query,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch offers: ${response.status}`);
      }

      const data = await response.json();
      setOffers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('ZeroClick fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load ads');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey, query, limit]);

  // Track impressions
  const trackImpressions = useCallback(async (offerIds: string[]) => {
    if (!offerIds.length) return;

    // Filter out already tracked impressions
    const newIds = offerIds.filter((id) => !impressionsTracked.has(id));
    if (!newIds.length) return;

    try {
      await fetch(`${ZEROCLOCK_API_BASE}/api/v2/impressions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: newIds,
        }),
      });

      // Mark as tracked
      setImpressionsTracked((prev) => {
        const next = new Set(prev);
        newIds.forEach((id) => next.add(id));
        return next;
      });

      onImpressionTracked?.();
    } catch (err) {
      console.error('Failed to track impressions:', err);
    }
  }, [impressionsTracked, onImpressionTracked]);

  // Fetch offers on mount
  useEffect(() => {
    if (!hasNoAds) {
      fetchOffers();
    }
  }, [fetchOffers, hasNoAds]);

  // Track impressions when offers change
  useEffect(() => {
    if (offers.length > 0) {
      trackImpressions(offers.map((o) => o.id));
    }
  }, [offers, trackImpressions]);

  // Don't render for Pro users
  if (hasNoAds) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center rounded-xl bg-gray-50 ${
          format === 'card' ? 'min-h-[180px]' : 'min-h-[60px]'
        } ${className}`}
      >
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
      </div>
    );
  }

  // Error or no offers state - show fallback promo
  if (error || offers.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 ${
          format === 'card' ? 'p-4' : 'px-3 py-2'
        } ${className}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-amber-700">
            ✨ Upgrade to Pro for an ad-free experience
          </span>
        </div>
      </motion.div>
    );
  }

  const offer = offers[0];

  // Compact format (small inline ad)
  if (format === 'compact') {
    return (
      <motion.a
        href={offer.clickUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.01 }}
        className={`flex items-center gap-3 rounded-lg bg-gray-50 border border-gray-200 px-3 py-2 hover:bg-gray-100 transition-colors ${className}`}
      >
        {offer.brand?.imageUrl && (
          <img
            src={offer.brand.imageUrl}
            alt={offer.brand.name}
            className="h-5 w-5 rounded object-contain"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{offer.title}</p>
          {offer.subtitle && (
            <p className="text-xs text-gray-500 truncate">{offer.subtitle}</p>
          )}
        </div>
        <ExternalLink className="h-3 w-3 text-gray-400 flex-shrink-0" />
      </motion.a>
    );
  }

  // Inline format (horizontal)
  if (format === 'inline') {
    return (
      <motion.a
        href={offer.clickUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ scale: 1.01 }}
        className={`flex items-center gap-4 rounded-xl bg-white border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all ${className}`}
      >
        {offer.imageUrl ? (
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="h-16 w-16 rounded-lg object-cover flex-shrink-0"
          />
        ) : offer.brand?.imageUrl ? (
          <div className="h-16 w-16 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
            <img
              src={offer.brand.imageUrl}
              alt={offer.brand.name}
              className="h-10 w-10 object-contain"
            />
          </div>
        ) : null}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {offer.brand?.name && (
              <span className="text-xs font-semibold text-violet-600">{offer.brand.name}</span>
            )}
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Sponsored</span>
          </div>
          <h4 className="font-semibold text-gray-900 truncate">{offer.title}</h4>
          {offer.content && (
            <p className="text-sm text-gray-600 line-clamp-1">{offer.content}</p>
          )}
        </div>
        {offer.cta && (
          <button className="shrink-0 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
            {offer.cta}
          </button>
        )}
      </motion.a>
    );
  }

  // Card format (default - larger display)
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl bg-white border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-shadow ${className}`}
    >
      {offer.imageUrl && (
        <div className="relative h-32 bg-gray-100">
          <img
            src={offer.imageUrl}
            alt={offer.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium rounded-full">
              Sponsored
            </span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {offer.brand?.name && (
              <div className="flex items-center gap-2 mb-1">
                {offer.brand.imageUrl && (
                  <img
                    src={offer.brand.imageUrl}
                    alt={offer.brand.name}
                    className="h-4 w-4 object-contain"
                  />
                )}
                <span className="text-xs font-semibold text-gray-500">{offer.brand.name}</span>
              </div>
            )}
            <h4 className="font-semibold text-gray-900 mb-1">{offer.title}</h4>
            {offer.content && (
              <p className="text-sm text-gray-600 line-clamp-2">{offer.content}</p>
            )}
          </div>
          {offer.price && (
            <div className="text-right shrink-0">
              <span className="text-lg font-bold text-gray-900">
                {offer.price.currency === 'USD' ? '$' : offer.price.currency}
                {offer.price.amount}
              </span>
            </div>
          )}
        </div>
        <a
          href={offer.clickUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
        >
          {offer.cta || 'Learn More'}
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>
    </motion.div>
  );
};

// Hook to use ZeroClick ads
export const useZeroClickAds = () => {
  const [offers, setOffers] = useState<ZeroClickOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiKey = import.meta.env.VITE_ZEROCLICK_API_KEY;

  const fetchOffers = useCallback(async (query: string, limit: number = 3) => {
    if (!apiKey) {
      setError('ZeroClick API key not configured');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ZEROCLOCK_API_BASE}/api/v2/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zc-api-key': apiKey,
        },
        body: JSON.stringify({
          method: 'client',
          query,
          limit,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch offers: ${response.status}`);
      }

      const data = await response.json();
      const offersArray = Array.isArray(data) ? data : [];
      setOffers(offersArray);
      return offersArray;
    } catch (err) {
      console.error('ZeroClick fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to load ads');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const trackImpressions = useCallback(async (offerIds: string[]) => {
    if (!offerIds.length) return;

    try {
      await fetch(`${ZEROCLOCK_API_BASE}/api/v2/impressions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ids: offerIds,
        }),
      });
    } catch (err) {
      console.error('Failed to track impressions:', err);
    }
  }, []);

  return {
    offers,
    isLoading,
    error,
    fetchOffers,
    trackImpressions,
  };
};

export default ZeroClickAd;
