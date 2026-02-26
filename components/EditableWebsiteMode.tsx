import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Code,
  Eye,
  EyeOff,
  Save,
  Undo,
  Redo,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  AlertCircle,
  Palette,
  Type,
  Layout,
  MousePointer2,
  Settings,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import { ProGuard, UpgradePrompt } from './ProGuard';
import type { BlockData, UserProfile } from '../types';

interface EditableWebsiteModeProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  blocks: BlockData[];
  onProfileChange: (profile: UserProfile) => void;
  onBlocksChange: (blocks: BlockData[]) => void;
  onUpgradeClick?: () => void;
}

type ViewMode = 'desktop' | 'tablet' | 'mobile';
type EditMode = 'visual' | 'code';

interface CSSRule {
  selector: string;
  properties: Record<string, string>;
}

interface CustomStyles {
  global: string;
  blocks: Record<string, string>;
  profile: string;
}

export const EditableWebsiteMode: React.FC<EditableWebsiteModeProps> = ({
  isOpen,
  onClose,
  profile,
  blocks,
  onProfileChange,
  onBlocksChange,
  onUpgradeClick,
}) => {
  const { canUseLivePreview, canUseCustomCSS, isPro } = useProFeatures();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [editMode, setEditMode] = useState<EditMode>('visual');
  const [isLivePreview, setIsLivePreview] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [customCSS, setCustomCSS] = useState<CustomStyles>({
    global: '',
    blocks: {},
    profile: '',
  });
  const [history, setHistory] = useState<{ blocks: BlockData[]; profile: UserProfile }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);
  const previewRef = useRef<HTMLIFrameElement>(null);

  // Save state to history
  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ blocks: [...blocks], profile: { ...profile } });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      onBlocksChange(prev.blocks);
      onProfileChange(prev.profile);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      onBlocksChange(next.blocks);
      onProfileChange(next.profile);
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleBlockEdit = (blockId: string, updates: Partial<BlockData>) => {
    saveToHistory();
    onBlocksChange(blocks.map((b) => (b.id === blockId ? { ...b, ...updates } : b)));
  };

  const handleProfileEdit = (updates: Partial<UserProfile>) => {
    saveToHistory();
    onProfileChange({ ...profile, ...updates });
  };

  const handleSave = () => {
    // Save custom CSS to localStorage
    localStorage.setItem('openbento_custom_css', JSON.stringify(customCSS));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 2000);
  };

  const getPreviewWidth = () => {
    switch (viewMode) {
      case 'mobile':
        return '375px';
      case 'tablet':
        return '768px';
      default:
        return '100%';
    }
  };

  // Generate preview HTML
  const generatePreviewHTML = () => {
    const globalStyles = `
      <style>
        ${customCSS.global}
        
        .bento-block {
          transition: all 0.3s ease;
        }
        
        .bento-block:hover {
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }
        
        .bento-block.selected {
          outline: 2px solid #8b5cf6;
          outline-offset: 2px;
        }
        
        ${Object.entries(customCSS.blocks)
          .map(([id, css]) => `[data-block-id="${id}"] { ${css} }`)
          .join('\n')}
        
        .profile-section { ${customCSS.profile} }
      </style>
    `;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="https://cdn.tailwindcss.com"></script>
          ${globalStyles}
        </head>
        <body class="bg-gray-50 min-h-screen">
          <div class="max-w-6xl mx-auto p-8">
            <div class="profile-section text-center mb-8">
              ${profile.avatarUrl ? `<img src="${profile.avatarUrl}" class="w-24 h-24 rounded-full mx-auto mb-4" />` : ''}
              <h1 class="text-3xl font-bold">${profile.name}</h1>
              <p class="text-gray-600 mt-2">${profile.bio}</p>
            </div>
            <div class="grid grid-cols-3 gap-4">
              ${blocks
                .map(
                  (block) => `
                <div 
                  data-block-id="${block.id}"
                  class="bento-block bg-white rounded-2xl p-6 shadow-sm"
                  style="grid-column: span ${block.colSpan}; grid-row: span ${block.rowSpan};"
                >
                  ${block.title ? `<h3 class="font-semibold mb-2">${block.title}</h3>` : ''}
                  ${block.content ? `<p class="text-gray-600">${block.content}</p>` : ''}
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </body>
      </html>
    `;
  };

  useEffect(() => {
    if (previewRef.current && isLivePreview) {
      previewRef.current.srcdoc = generatePreviewHTML();
    }
  }, [blocks, profile, customCSS, isLivePreview]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-[100] bg-gray-900 ${isFullscreen ? '' : 'p-4'}`}
          >
            <div className={`flex h-full flex-col overflow-hidden rounded-2xl bg-white ${isFullscreen ? '' : 'shadow-2xl'}`}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                      <MousePointer2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-bold text-gray-900">Live Editor</h2>
                      <p className="text-xs text-gray-500">
                        {isPro ? 'Unlimited edits • Live preview' : 'Pro Feature'}
                      </p>
                    </div>
                  </div>

                  <div className="h-8 w-px bg-gray-200" />

                  {/* Undo/Redo */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={undo}
                      disabled={historyIndex <= 0}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                      title="Undo"
                    >
                      <Undo className="h-4 w-4" />
                    </button>
                    <button
                      onClick={redo}
                      disabled={historyIndex >= history.length - 1}
                      className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 disabled:opacity-30"
                      title="Redo"
                    >
                      <Redo className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="h-8 w-px bg-gray-200" />

                  {/* View Mode */}
                  <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                    {(['desktop', 'tablet', 'mobile'] as ViewMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => setViewMode(mode)}
                        className={`rounded-md p-2 transition-colors ${
                          viewMode === mode ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                        title={mode}
                      >
                        {mode === 'desktop' && <Monitor className="h-4 w-4" />}
                        {mode === 'tablet' && <Tablet className="h-4 w-4" />}
                        {mode === 'mobile' && <Smartphone className="h-4 w-4" />}
                      </button>
                    ))}
                  </div>

                  <div className="h-8 w-px bg-gray-200" />

                  {/* Edit Mode */}
                  <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
                    <button
                      onClick={() => setEditMode('visual')}
                      className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                        editMode === 'visual' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Layout className="mr-1 inline h-4 w-4" />
                      Visual
                    </button>
                    {canUseCustomCSS && (
                      <button
                        onClick={() => setEditMode('code')}
                        className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                          editMode === 'code' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Code className="mr-1 inline h-4 w-4" />
                        CSS
                      </button>
                    )}
                  </div>

                  <div className="h-8 w-px bg-gray-200" />

                  {/* Live Preview Toggle */}
                  <button
                    onClick={() => setIsLivePreview(!isLivePreview)}
                    className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      isLivePreview ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {isLivePreview ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    {isLivePreview ? 'Live' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-700"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={onClose}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="flex flex-1 overflow-hidden">
                {isPro ? (
                  <>
                    {/* Sidebar */}
                    <div className="w-80 border-r border-gray-200 bg-gray-50">
                      {editMode === 'visual' ? (
                        <div className="h-full overflow-y-auto p-4">
                          <h3 className="mb-4 font-semibold text-gray-900">Blocks</h3>
                          <div className="space-y-3">
                            {blocks.map((block) => (
                              <div
                                key={block.id}
                                onClick={() => setSelectedBlockId(block.id)}
                                className={`cursor-pointer rounded-xl border p-4 transition-all ${
                                  selectedBlockId === block.id
                                    ? 'border-violet-500 bg-violet-50'
                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-medium text-gray-900">{block.title || 'Untitled'}</span>
                                  <span className="text-xs text-gray-500">{block.type}</span>
                                </div>
                                {selectedBlockId === block.id && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="mt-3 space-y-3"
                                  >
                                    <div>
                                      <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
                                      <input
                                        type="text"
                                        value={block.title || ''}
                                        onChange={(e) => handleBlockEdit(block.id, { title: e.target.value })}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                                      />
                                    </div>
                                    <div>
                                      <label className="mb-1 block text-xs font-medium text-gray-600">Content</label>
                                      <textarea
                                        value={block.content || ''}
                                        onChange={(e) => handleBlockEdit(block.id, { content: e.target.value })}
                                        rows={3}
                                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Width</label>
                                        <input
                                          type="number"
                                          min={1}
                                          max={9}
                                          value={block.colSpan}
                                          onChange={(e) =>
                                            handleBlockEdit(block.id, { colSpan: parseInt(e.target.value) || 1 })
                                          }
                                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                                        />
                                      </div>
                                      <div>
                                        <label className="mb-1 block text-xs font-medium text-gray-600">Height</label>
                                        <input
                                          type="number"
                                          min={1}
                                          max={50}
                                          value={block.rowSpan}
                                          onChange={(e) =>
                                            handleBlockEdit(block.id, { rowSpan: parseInt(e.target.value) || 1 })
                                          }
                                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                                        />
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            ))}
                          </div>

                          <h3 className="mb-4 mt-8 font-semibold text-gray-900">Profile</h3>
                          <div className="space-y-3">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-600">Name</label>
                              <input
                                type="text"
                                value={profile.name}
                                onChange={(e) => handleProfileEdit({ name: e.target.value })}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-600">Bio</label>
                              <textarea
                                value={profile.bio}
                                onChange={(e) => handleProfileEdit({ bio: e.target.value })}
                                rows={3}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="h-full overflow-y-auto p-4">
                          <h3 className="mb-4 font-semibold text-gray-900">Custom CSS</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-600">Global Styles</label>
                              <textarea
                                value={customCSS.global}
                                onChange={(e) => setCustomCSS({ ...customCSS, global: e.target.value })}
                                placeholder="/* Add your global CSS here */"
                                rows={10}
                                className="w-full rounded-lg border border-gray-200 bg-gray-900 p-3 font-mono text-sm text-gray-100 focus:border-violet-500 focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium text-gray-600">
                                Profile Section CSS
                              </label>
                              <textarea
                                value={customCSS.profile}
                                onChange={(e) => setCustomCSS({ ...customCSS, profile: e.target.value })}
                                placeholder="/* Style the profile section */"
                                rows={5}
                                className="w-full rounded-lg border border-gray-200 bg-gray-900 p-3 font-mono text-sm text-gray-100 focus:border-violet-500 focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Preview Area */}
                    <div className="flex flex-1 items-center justify-center bg-gray-100 p-8">
                      <div
                        style={{ width: getPreviewWidth() }}
                        className="h-full overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
                      >
                        <iframe
                          ref={previewRef}
                          className="h-full w-full"
                          sandbox="allow-scripts"
                          title="Live Preview"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 items-center justify-center p-8">
                    <ProGuard
                      feature="canUseLivePreview"
                      onUpgradeClick={() => setShowUpgradePrompt(true)}
                      showUpgradePrompt={true}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Save Success Toast */}
            <AnimatePresence>
              {showSaveSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-white shadow-lg"
                >
                  <Check className="h-5 w-5" />
                  Changes saved successfully
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={() => {
          setShowUpgradePrompt(false);
          onUpgradeClick?.();
        }}
        feature="Live website editing with custom CSS"
      />
    </>
  );
};

export default EditableWebsiteMode;
