import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, X, Check, RefreshCw, Link, ExternalLink, Unlink, Globe } from 'lucide-react';
import { PublishedSite, getPublishedUrl, getPublishDomain } from '../services/publicationService';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  publishedSite: PublishedSite | null;
  isPublishing: boolean;
  publishError: string | null;
  newSubdomain: string;
  onSubdomainChange: (value: string) => void;
  onPublish: () => void;
  onRepublish: () => void;
  onUnpublish: () => void;
  onChangeSubdomain: () => void;
}

const PublishModal: React.FC<PublishModalProps> = ({
  isOpen,
  onClose,
  publishedSite,
  isPublishing,
  publishError,
  newSubdomain,
  onSubdomainChange,
  onPublish,
  onRepublish,
  onUnpublish,
  onChangeSubdomain,
}) => {
  const domain = getPublishDomain();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden ring-1 ring-gray-900/5"
          >
            <div className="p-6 pb-4 flex justify-between items-start">
              <div>
                <div className="w-9 h-9 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white mb-3">
                  <Rocket size={18} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Publish Your Site</h2>
                <p className="text-gray-500 mt-1 text-sm">
                  {publishedSite 
                    ? 'Your site is live! Update or manage it below.' 
                    : 'Launch your bento page to a public URL in one click.'}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-6 space-y-4 pb-2">
              {publishedSite ? (
                // Already published - show status and actions
                <>
                  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={18} className="text-green-600" />
                      <span className="font-bold text-green-700">Your site is live!</span>
                    </div>
                    <a 
                      href={getPublishUrl(publishedSite.subdomain)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-green-700 hover:underline"
                    >
                      <Link size={14} />
                      <code className="text-sm">{getPublishUrl(publishedSite.subdomain)}</code>
                      <ExternalLink size={14} />
                    </a>
                    <p className="text-xs text-green-600 mt-2">
                      Published on {new Date(publishedSite.publishedAt).toLocaleDateString()}
                      {publishedSite.lastUpdated > publishedSite.publishedAt && 
                        ` • Updated ${new Date(publishedSite.lastUpdated).toLocaleDateString()}`}
                    </p>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Custom subdomain
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newSubdomain}
                        onChange={(e) => onSubdomainChange(e.target.value)}
                        className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-black/5 focus:border-black focus:outline-none transition-all font-semibold text-gray-800"
                        placeholder="your-name"
                      />
                      <span className="text-gray-400 text-sm">.{domain}</span>
                    </div>
                    <button
                      onClick={onChangeSubdomain}
                      className="w-full py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Update subdomain
                    </button>
                  </div>

                  {publishError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700 font-semibold">
                      {publishError}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={onRepublish}
                      disabled={isPublishing}
                      className="py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isPublishing ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <RefreshCw size={16} />
                      )}
                      Update Live
                    </button>
                    <button
                      onClick={onUnpublish}
                      className="py-3 bg-white text-red-600 rounded-xl font-bold border border-red-200 hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <Unlink size={16} />
                      Unpublish
                    </button>
                  </div>
                </>
              ) : (
                // Not published yet - show publish button
                <>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-white p-2 rounded-full shadow-sm border border-gray-100">
                        <Globe size={20} className="text-gray-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Free Public URL</p>
                        <p className="text-gray-500 text-sm mt-1">
                          Your site will be available at <code className="bg-gray-200 px-1 rounded">*.{domain}</code>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-sm text-blue-700">
                    <strong>No coding required!</strong> Just click publish and share your link.
                  </div>

                  {publishError && (
                    <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-700 font-semibold">
                      {publishError}
                    </div>
                  )}

                  <button
                    onClick={onPublish}
                    disabled={isPublishing}
                    className="w-full py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                  >
                    {isPublishing ? (
                      <>
                        <RefreshCw size={20} className="animate-spin" />
                        Publishing...
                      </>
                    ) : (
                      <>
                        <Rocket size={20} />
                        Publish Now
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

            <div className="p-6 pt-4 border-t border-gray-100">
              <button
                onClick={onClose}
                className="w-full py-3 bg-white text-gray-900 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {publishedSite ? 'Done' : 'Cancel'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PublishModal;
