import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, X, Wand2, Code, Check, AlertCircle } from 'lucide-react';
import { useWebLLM } from '../hooks/useWebLLM';

interface AIEditorProps {
  onClose: () => void;
  onApplyCode?: (code: string) => void;
}

export const AIEditor: React.FC<AIEditorProps> = ({ onClose, onApplyCode }) => {
  const {
    status,
    isReady,
    isSettingUp,
    progress,
    progressText,
    error,
    initialize,
    generateWebsite,
  } = useWebLLM({ autoInitialize: false });

  const [description, setDescription] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const handleStart = useCallback(async () => {
    if (status === 'idle' || status === 'error') {
      await initialize();
    }
  }, [status, initialize]);

  const handleGenerate = useCallback(async () => {
    if (!description.trim()) return;

    setIsGenerating(true);
    try {
      const code = await generateWebsite(description, {
        onUpdate: (partial) => {
          setGeneratedCode(partial);
        },
      });
      setGeneratedCode(code);
    } catch (err) {
      console.error('Generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [description, generateWebsite]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(generatedCode);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  }, [generatedCode]);

  const handleApply = useCallback(() => {
    if (onApplyCode && generatedCode) {
      onApplyCode(generatedCode);
      onClose();
    }
  }, [generatedCode, onApplyCode, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                AI Website Creator
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Powered by WebLLM - runs locally in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          <AnimatePresence mode="wait">
            {/* Initial State - Not Started */}
            {(status === 'idle' || status === 'error') && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                  <Wand2 className="w-10 h-10 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Create with AI
                </h3>
                <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-6">
                  Describe the website you want to create, and our local AI will generate 
                  the code for you. Everything runs in your browser - no data leaves your device.
                </p>
                {error && (
                  <div className="flex items-center gap-2 justify-center text-red-600 dark:text-red-400 mb-4">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                )}
                <button
                  onClick={handleStart}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Creating
                </button>
              </motion.div>
            )}

            {/* Setting Up State */}
            {isSettingUp && (
              <motion.div
                key="settingup"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="relative w-24 h-24 mx-auto mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0"
                  >
                    <Loader2 className="w-24 h-24 text-purple-600 dark:text-purple-400" />
                  </motion.div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Setting up AI
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  The setup is being set up. This may take a moment...
                </p>
                <div className="max-w-md mx-auto">
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress * 100}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {progressText || `Progress: ${Math.round(progress * 100)}%`}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Ready State */}
            {isReady && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                {!generatedCode ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Describe your website
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="e.g., A modern portfolio website with a hero section, about me, projects grid, and contact form. Use a dark theme with purple accents."
                        className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleGenerate}
                      disabled={!description.trim() || isGenerating}
                      className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating your website...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate Website
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Code className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                          Generated Code
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopy}
                          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors flex items-center gap-1"
                        >
                          {showCopied ? (
                            <>
                              <Check className="w-4 h-4 text-green-500" />
                              Copied!
                            </>
                          ) : (
                            'Copy'
                          )}
                        </button>
                        <button
                          onClick={() => setGeneratedCode('')}
                          className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800 rounded-lg transition-colors"
                        >
                          Start Over
                        </button>
                      </div>
                    </div>
                    <div className="relative">
                      <pre className="w-full h-96 p-4 bg-gray-900 rounded-xl overflow-auto text-sm text-gray-100 font-mono">
                        <code>{generatedCode}</code>
                      </pre>
                    </div>
                    {onApplyCode && (
                      <button
                        onClick={handleApply}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                      >
                        <Check className="w-5 h-5" />
                        Apply to Editor
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Powered by WebLLM (Qwen2.5-Coder)</span>
            <span>Runs locally in your browser</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
