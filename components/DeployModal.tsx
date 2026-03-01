import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X,
  Globe,
  Rocket,
  Check,
  AlertCircle,
  Loader2,
  ExternalLink,
  Copy,
  CheckCircle2,
  RefreshCw,
  Trash2,
  Sparkles,
} from 'lucide-react';
import { SiteData, SavedBento } from '../types';
import {
  deploySite,
  checkSubdomainAvailability,
  validateSubdomain,
  generateSubdomainSuggestion,
  saveDeploymentInfo,
  getDeploymentInfo,
  deleteDeployment,
  DeploymentStatus,
} from '../services/deployment';

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteData: SiteData;
  bento?: SavedBento | null;
}

type DeployStep = 'input' | 'validating' | 'deploying' | 'success' | 'error';

const DeployModal: React.FC<DeployModalProps> = ({ isOpen, onClose, siteData, bento }) => {
  const [subdomain, setSubdomain] = useState('');
  const [step, setStep] = useState<DeployStep>('input');
  const [deployment, setDeployment] = useState<DeploymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [suggestion, setSuggestion] = useState('');

  // Base domain from environment or default
  const baseDomain = import.meta.env.VITE_DEPLOYMENT_BASE_DOMAIN || 'offlink.bio';

  // Load existing deployment on open
  useEffect(() => {
    if (isOpen && bento) {
      const existing = getDeploymentInfo(bento.id);
      if (existing) {
        setDeployment(existing);
        if (existing.status === 'deployed') {
          setStep('success');
        } else {
          setStep('input');
        }
      } else {
        setStep('input');
        setDeployment(null);
        // Generate suggestion from profile name
        const suggested = generateSubdomainSuggestion(siteData.profile.name);
        setSuggestion(suggested);
      }
      setError(null);
      setValidationError(null);
      setSubdomain('');
    }
  }, [isOpen, bento, siteData.profile.name]);

  // Validate subdomain on input
  useEffect(() => {
    if (subdomain) {
      const validation = validateSubdomain(subdomain);
      if (!validation.valid) {
        setValidationError(validation.error || 'Invalid subdomain');
      } else {
        setValidationError(null);
      }
    } else {
      setValidationError(null);
    }
  }, [subdomain]);

  const handleSubdomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
    setSubdomain(value);
  };

  const handleCheckAvailability = async () => {
    const validation = validateSubdomain(subdomain);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid subdomain');
      return;
    }

    setIsChecking(true);
    setStep('validating');

    try {
      const result = await checkSubdomainAvailability(subdomain);
      if (result.available) {
        setStep('input');
      } else {
        setValidationError(result.message || 'This subdomain is already taken');
        setStep('input');
      }
    } catch {
      // If check fails, we'll try deployment anyway
      setStep('input');
    } finally {
      setIsChecking(false);
    }
  };

  const handleDeploy = async () => {
    const validation = validateSubdomain(subdomain);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid subdomain');
      return;
    }

    setStep('deploying');
    setError(null);

    try {
      const result = await deploySite({
        subdomain,
        siteData,
        bento: bento || undefined,
      });

      setDeployment(result);
      if (bento) {
        saveDeploymentInfo(bento.id, result);
      }
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deployment failed. Please try again.');
      setStep('error');
    }
  };

  const handleCopyUrl = useCallback(() => {
    if (deployment?.url) {
      navigator.clipboard.writeText(deployment.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [deployment?.url]);

  const handleDelete = async () => {
    if (!deployment || !bento) return;

    if (window.confirm('Are you sure you want to remove this deployment? Your site will no longer be accessible at this URL.')) {
      try {
        await deleteDeployment(deployment.id);
        // Clear local storage
        const key = `openbento_deployment_${bento.id}`;
        localStorage.removeItem(key);
        setDeployment(null);
        setStep('input');
        setSubdomain('');
        // Generate new suggestion
        const suggested = generateSubdomainSuggestion(siteData.profile.name);
        setSuggestion(suggested);
      } catch {
        // Ignore errors
      }
    }
  };

  const handleTryAgain = () => {
    setStep('input');
    setError(null);
  };

  const fullUrl = deployment?.url || `https://${subdomain || 'your-name'}.${baseDomain}`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden ring-1 ring-gray-900/5"
            role="dialog"
            aria-modal="true"
            aria-label="Deploy your site"
          >
            {/* Header */}
            <div className="p-6 pb-4 flex justify-between items-start border-b border-gray-100">
              <div>
                <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-3">
                  {step === 'success' ? <Check size={18} /> : <Rocket size={18} />}
                </div>
                <h2 className="text-xl font-bold text-gray-900">
                  {step === 'success' ? 'Site is Live!' : 'Launch Your Site'}
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                  {step === 'success'
                    ? 'Your site is now public and ready to share.'
                    : 'Make your bento page public with one click.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                aria-label="Close deploy modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Input Step */}
              {(step === 'input' || step === 'validating') && (
                <>
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Choose your subdomain
                    </label>
                    <div className="flex items-center">
                      <span className="text-gray-500 text-sm mr-2">https://</span>
                      <input
                        type="text"
                        value={subdomain}
                        onChange={handleSubdomainChange}
                        placeholder={suggestion || 'your-name'}
                        className={`flex-1 px-3 py-2 border rounded-lg text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                          validationError
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20'
                            : 'border-gray-200 focus:border-violet-500 focus:ring-violet-500/20'
                        }`}
                        disabled={isChecking}
                        autoFocus
                      />
                      <span className="text-gray-400 text-sm ml-2">.{baseDomain}</span>
                    </div>
                    {validationError && (
                      <div className="flex items-center gap-1.5 text-red-500 text-xs">
                        <AlertCircle size={12} />
                        <span>{validationError}</span>
                      </div>
                    )}
                    {!validationError && subdomain && (
                      <div className="flex items-center gap-1.5 text-amber-600 text-xs">
                        <Sparkles size={12} />
                        <span>Your site will be live at: {fullUrl}</span>
                      </div>
                    )}
                  </div>

                  {/* Quick suggestion */}
                  {!subdomain && suggestion && (
                    <button
                      onClick={() => setSubdomain(suggestion)}
                      className="w-full p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                    >
                      <span className="text-xs text-gray-400 uppercase font-medium">Suggested:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-medium text-gray-700">{suggestion}</span>
                        <span className="text-sm text-gray-400">.{baseDomain}</span>
                      </div>
                    </button>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={handleDeploy}
                      disabled={!subdomain || !!validationError || isChecking}
                      className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
                    >
                      {isChecking ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Checking...
                        </>
                      ) : (
                        <>
                          <Rocket size={18} />
                          Launch Site
                        </>
                      )}
                    </button>
                    <p className="text-xs text-gray-400 text-center mt-3">
                      No credit card required. Your site will be live in seconds.
                    </p>
                  </div>
                </>
              )}

              {/* Deploying Step */}
              {step === 'deploying' && (
                <div className="py-8 text-center space-y-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-violet-200 border-t-violet-500 rounded-full mx-auto"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">Deploying your site...</p>
                    <p className="text-sm text-gray-500 mt-1">
                      This usually takes 10-30 seconds
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-500 font-mono">
                    {fullUrl}
                  </div>
                </div>
              )}

              {/* Success Step */}
              {step === 'success' && deployment && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 size={20} className="text-green-600" />
                      <span className="font-semibold text-green-800">Successfully deployed!</span>
                    </div>
                    <p className="text-sm text-green-700">
                      Your site is now live and ready to share with the world.
                    </p>
                  </div>

                  {/* URL Display */}
                  <div className="bg-gray-900 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white">
                        <Globe size={16} className="text-violet-400" />
                        <span className="font-mono text-sm truncate max-w-[180px]">
                          {deployment.url}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopyUrl}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                          title="Copy URL"
                        >
                          {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                        </button>
                        <a
                          href={deployment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors text-white"
                          title="Open site"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2">
                    <a
                      href={deployment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-bold hover:from-violet-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2"
                    >
                      <ExternalLink size={18} />
                      Visit Your Site
                    </a>
                    <button
                      onClick={handleCopyUrl}
                      className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={handleDelete}
                      className="w-full py-2 text-red-500 text-sm hover:text-red-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={14} />
                      Remove Deployment
                    </button>
                  </div>

                  {/* Share tip */}
                  <div className="bg-violet-50 rounded-lg p-3 text-center">
                    <p className="text-xs text-violet-700">
                      💡 <strong>Pro tip:</strong> Add this link to your social media bios!
                    </p>
                  </div>
                </div>
              )}

              {/* Error Step */}
              {step === 'error' && (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle size={20} className="text-red-600" />
                      <span className="font-semibold text-red-800">Deployment failed</span>
                    </div>
                    <p className="text-sm text-red-700">{error || 'Something went wrong. Please try again.'}</p>
                  </div>

                  <button
                    onClick={handleTryAgain}
                    className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    <RefreshCw size={18} />
                    Try Again
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                {step === 'success' ? (
                  <>Your site is hosted on our secure infrastructure.</>
                ) : (
                  <>Free hosting included. No hidden fees.</>
                )}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeployModal;
