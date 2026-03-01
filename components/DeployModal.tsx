import React, { useState, useEffect } from 'react';
import { X, Globe, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { SavedBento } from '../types';
import {
  deploySite,
  unpublishSite,
  getDeploymentStatus,
  generateSlug,
  checkSlugAvailability,
} from '../services/deploymentService';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  bento: SavedBento | null;
}

const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, bento }) => {
  const [slug, setSlug] = useState('');
  const [isDeploying, setIsDeploying] = useState(false);
  const [isUnpublishing, setIsUnpublishing] = useState(false);
  const [isCheckingSlug, setIsCheckingSlug] = useState(false);
  const [deploymentResult, setDeploymentResult] = useState<{
    success: boolean;
    url?: string;
    error?: string;
  } | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [currentUrl, setCurrentUrl] = useState<string | undefined>();
  const [slugAvailability, setSlugAvailability] = useState<'available' | 'taken' | 'unknown'>(
    'unknown'
  );

  // Load current deployment status when modal opens
  useEffect(() => {
    if (isOpen && bento) {
      getDeploymentStatus(bento.id).then((status) => {
        setIsPublished(status.isPublished);
        setCurrentUrl(status.url);
        if (status.slug) {
          setSlug(status.slug);
        }
      });
    }
  }, [isOpen, bento]);

  // Generate initial slug from bento name
  useEffect(() => {
    if (bento && !slug && !isPublished) {
      const generatedSlug = generateSlug(bento.name);
      setSlug(generatedSlug);
    }
  }, [bento, slug, isPublished]);

  // Check slug availability when it changes
  useEffect(() => {
    const checkAvailability = async () => {
      if (slug && slug !== currentUrl?.split('/').pop()) {
        setIsCheckingSlug(true);
        setSlugAvailability('unknown');
        const available = await checkSlugAvailability(slug);
        setSlugAvailability(available ? 'available' : 'taken');
        setIsCheckingSlug(false);
      }
    };

    const timer = setTimeout(checkAvailability, 500);
    return () => clearTimeout(timer);
  }, [slug, currentUrl]);

  const handleDeploy = async () => {
    if (!bento || !slug) return;

    setIsDeploying(true);
    setDeploymentResult(null);

    const result = await deploySite(bento, { slug, isPublished: true });

    setDeploymentResult(result);
    setIsDeploying(false);

    if (result.success && result.url) {
      setIsPublished(true);
      setCurrentUrl(result.url);
    }
  };

  const handleUnpublish = async () => {
    if (!bento) return;

    setIsUnpublishing(true);
    const result = await unpublishSite(bento.id);

    if (result.success) {
      setIsPublished(false);
      setCurrentUrl(undefined);
    }

    setIsUnpublishing(false);
  };

  const handleCopyUrl = () => {
    if (currentUrl) {
      navigator.clipboard.writeText(currentUrl);
    }
  };

  const regenerateSlug = () => {
    if (bento) {
      const newSlug = generateSlug(bento.name);
      setSlug(newSlug);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Deploy Your Site</h2>
              <p className="text-sm text-gray-500">{bento?.name || 'Untitled Bento'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Close modal"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Status */}
          {isPublished && currentUrl ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-900">Site is Live!</p>
                  <p className="text-xs text-green-700 mt-1">Your site is publicly accessible</p>
                  <div className="mt-3 flex items-center gap-2">
                    <code className="flex-1 bg-white border border-green-200 rounded-lg px-3 py-2 text-xs text-green-800 font-mono break-all">
                      {currentUrl}
                    </code>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg text-xs font-semibold hover:bg-green-700 transition-colors whitespace-nowrap"
                    >
                      Copy
                    </button>
                    <a
                      href={currentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2 bg-white border border-green-200 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-50 transition-colors whitespace-nowrap"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <Globe size={16} className="text-gray-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">Not Published</p>
                  <p className="text-xs text-gray-600 mt-1">
                    Deploy your site to make it publicly accessible
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slug Input */}
          {!isPublished && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-900">
                Your Site URL
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 font-mono">
                    {window.location.origin}/site/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      const value = e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, '')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      setSlug(value);
                    }}
                    placeholder="your-site-name"
                    className="w-full pl-[calc(50%+10px)] pr-10 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  {isCheckingSlug && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 size={16} className="text-gray-400 animate-spin" />
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={regenerateSlug}
                  className="p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  title="Generate new slug"
                >
                  <RefreshCw size={16} className="text-gray-600" />
                </button>
              </div>
              {/* Slug Status */}
              {slugAvailability === 'available' && (
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <Check size={14} />
                  This URL is available!
                </p>
              )}
              {slugAvailability === 'taken' && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  This URL is already taken. Try another.
                </p>
              )}
              <p className="text-xs text-gray-500">
                Choose a unique name for your site. This will be part of your public URL.
              </p>
            </div>
          )}

          {/* Deployment Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-semibold mb-1">How it works</p>
            <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
              <li>Your site will be deployed instantly</li>
              <li>No coding or GitHub required</li>
              <li>Updates automatically when you save changes</li>
              <li>Free SSL certificate included</li>
            </ul>
          </div>

          {/* Error Message */}
          {deploymentResult && !deploymentResult.success && deploymentResult.error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-900">{deploymentResult.error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          {isPublished ? (
            <>
              <button
                type="button"
                onClick={handleUnpublish}
                disabled={isUnpublishing}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isUnpublishing ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Unpublishing...
                  </span>
                ) : (
                  'Unpublish Site'
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Done
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeploy}
                disabled={!slug || slugAvailability !== 'available' || isDeploying}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-lg text-sm font-semibold hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isDeploying ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Deploying...
                  </span>
                ) : (
                  'Deploy Now'
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeployModal;
