import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Sparkles,
  Send,
  Loader2,
  Wand2,
  Type,
  Layout,
  Palette,
  Copy,
  Check,
  AlertCircle,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
import { useProFeatures } from '../hooks/useProFeatures';
import { ProGuard, UpgradePrompt } from './ProGuard';
import type { BlockData, BlockType, UserProfile } from '../types';

interface WebLLMModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  currentBlocks: BlockData[];
  onApplySuggestion: (suggestion: LayoutSuggestion | TextSuggestion) => void;
}

interface LayoutSuggestion {
  type: 'layout';
  description: string;
  blocks: Partial<BlockData>[];
  reasoning: string;
}

interface TextSuggestion {
  type: 'text';
  forBlock: string;
  suggestions: string[];
  tone: string;
}

type SuggestionType = LayoutSuggestion | TextSuggestion;

const QUICK_PROMPTS = [
  {
    icon: Layout,
    label: 'Suggest Layout',
    prompt: 'Suggest a new block layout for my page based on my profile',
    type: 'layout' as const,
  },
  {
    icon: Type,
    label: 'Improve Bio',
    prompt: 'Write a compelling bio for my profile',
    type: 'text' as const,
  },
  {
    icon: Palette,
    label: 'Color Scheme',
    prompt: 'Suggest a color scheme that matches my brand',
    type: 'layout' as const,
  },
  {
    icon: Wand2,
    label: 'Auto-Generate',
    prompt: 'Auto-generate content sections for my page',
    type: 'layout' as const,
  },
];

const TONES = [
  { value: 'professional', label: 'Professional', description: 'Corporate and serious' },
  { value: 'casual', label: 'Casual', description: 'Friendly and approachable' },
  { value: 'creative', label: 'Creative', description: 'Artistic and unique' },
  { value: 'minimal', label: 'Minimal', description: 'Simple and clean' },
  { value: 'playful', label: 'Playful', description: 'Fun and energetic' },
];

const WebLLMModal: React.FC<WebLLMModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  currentBlocks,
  onApplySuggestion,
}) => {
  const { canUseWebLLM, isPro } = useProFeatures();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTone, setSelectedTone] = useState('professional');
  const [suggestions, setSuggestions] = useState<SuggestionType[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Simulate WebLLM processing
  const processWithWebLLM = async (userPrompt: string): Promise<SuggestionType> => {
    await new Promise((resolve) => setTimeout(resolve, 1500 + Math.random() * 1000));

    // Generate context-aware suggestions
    const hasSocialBlocks = currentBlocks.some((b) => b.type === 'SOCIAL' || b.type === 'SOCIAL_ICON');
    const hasLinkBlocks = currentBlocks.some((b) => b.type === 'LINK');
    const hasTextBlocks = currentBlocks.some((b) => b.type === 'TEXT');

    if (userPrompt.toLowerCase().includes('layout') || userPrompt.toLowerCase().includes('arrange')) {
      return {
        type: 'layout',
        description: 'Recommended layout for better engagement',
        reasoning: 'Based on your profile and common best practices, this layout emphasizes visual hierarchy and clear calls-to-action.',
        blocks: [
          {
            type: 'TEXT' as BlockType,
            title: 'Welcome',
            content: `Hi! I'm ${currentProfile.name}. ${currentProfile.bio.slice(0, 100)}...`,
            colSpan: 6,
            rowSpan: 3,
            color: 'bg-violet-500',
            textColor: 'text-white',
          },
          ...(!hasSocialBlocks
            ? [
                {
                  type: 'SOCIAL_ICON' as BlockType,
                  socialPlatform: 'instagram' as const,
                  socialHandle: currentProfile.name.toLowerCase().replace(/\s+/g, ''),
                  colSpan: 1,
                  rowSpan: 1,
                  color: 'bg-pink-500',
                },
              ]
            : []),
          ...(!hasLinkBlocks
            ? [
                {
                  type: 'LINK' as BlockType,
                  title: 'My Portfolio',
                  subtext: 'Check out my work',
                  content: 'https://example.com',
                  colSpan: 3,
                  rowSpan: 3,
                  color: 'bg-blue-500',
                  textColor: 'text-white',
                },
              ]
            : []),
        ],
      };
    }

    if (userPrompt.toLowerCase().includes('bio') || userPrompt.toLowerCase().includes('description')) {
      const bios: Record<string, string[]> = {
        professional: [
          `${currentProfile.name} - Building products that matter. Experienced in creating user-centric solutions that drive results.`,
          `Hi, I'm ${currentProfile.name}. I help businesses grow through innovative digital strategies and clean design.`,
        ],
        casual: [
          `Hey there! I'm ${currentProfile.name}. I make cool stuff on the internet ☕✨`,
          `${currentProfile.name} here! Just a creative soul sharing my journey and projects with the world.`,
        ],
        creative: [
          `${currentProfile.name} — Crafting digital experiences at the intersection of art and technology.`,
          `Welcome to my creative space. I'm ${currentProfile.name}, and I turn ideas into reality.`,
        ],
        minimal: [
          `${currentProfile.name}. Creator. Thinker. Builder.`,
          `Less is more. - ${currentProfile.name}`,
        ],
        playful: [
          `✨ ${currentProfile.name} ✨ | Professional chaos coordinator & creative wizard 🎨🚀`,
          `Hey! ${currentProfile.name} here 🌈 Making the internet more colorful, one pixel at a time!`,
        ],
      };

      return {
        type: 'text',
        forBlock: 'profile',
        tone: selectedTone,
        suggestions: bios[selectedTone] || bios.professional,
      };
    }

    if (userPrompt.toLowerCase().includes('color') || userPrompt.toLowerCase().includes('scheme')) {
      const schemes = [
        {
          name: 'Ocean Breeze',
          primary: '#3B82F6',
          secondary: '#06B6D4',
          accent: '#1E40AF',
          description: 'Calming blues that evoke trust and professionalism',
        },
        {
          name: 'Sunset Glow',
          primary: '#F97316',
          secondary: '#EC4899',
          accent: '#7C3AED',
          description: 'Warm oranges and pinks for creative energy',
        },
        {
          name: 'Forest Haven',
          primary: '#10B981',
          secondary: '#84CC16',
          accent: '#065F46',
          description: 'Natural greens for growth and harmony',
        },
      ];

      return {
        type: 'layout',
        description: 'Recommended color schemes',
        reasoning: 'These color palettes align with your profile aesthetic and current design trends.',
        blocks: schemes.map((scheme) => ({
          type: 'TEXT' as BlockType,
          title: scheme.name,
          content: `${scheme.description}\n\nPrimary: ${scheme.primary}\nSecondary: ${scheme.secondary}\nAccent: ${scheme.accent}`,
          colSpan: 3,
          rowSpan: 2,
          customBackground: `linear-gradient(135deg, ${scheme.primary} 0%, ${scheme.secondary} 100%)`,
          textColor: 'text-white',
        })),
      };
    }

    // Default response
    return {
      type: 'layout',
      description: 'AI-powered suggestion',
      reasoning: 'Based on your current page structure and best practices.',
      blocks: [
        {
          type: 'TEXT' as BlockType,
          title: 'AI Suggestion',
          content: 'Consider adding more visual elements to engage visitors. Try using media blocks to showcase your work!',
          colSpan: 6,
          rowSpan: 3,
          color: 'bg-violet-100',
          textColor: 'text-violet-900',
        },
      ],
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!isPro) {
      setShowUpgradePrompt(true);
      return;
    }

    setIsLoading(true);
    try {
      const suggestion = await processWithWebLLM(input);
      setSuggestions((prev) => [...prev, suggestion]);
      setInput('');
    } catch (error) {
      console.error('WebLLM error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [suggestions]);

  if (!isOpen) return null;

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 16 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 16 }}
              className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-violet-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">AI Website Editor</h2>
                    <p className="text-sm text-violet-100">
                      {isPro
                        ? 'Powered by WebLLM - Free & Private'
                        : 'Upgrade to Pro for unlimited AI suggestions'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/20 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <div className="w-72 border-r border-gray-100 bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-semibold text-gray-500">Quick Actions</h3>
                  <div className="space-y-2">
                    {QUICK_PROMPTS.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => handleQuickPrompt(item.prompt)}
                        className="flex w-full items-center gap-3 rounded-xl bg-white p-3 text-left transition-all hover:shadow-md"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <span className="font-medium text-gray-700">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <h3 className="mb-3 mt-6 text-sm font-semibold text-gray-500">Tone</h3>
                  <div className="space-y-1">
                    {TONES.map((tone) => (
                      <button
                        key={tone.value}
                        onClick={() => setSelectedTone(tone.value)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          selectedTone === tone.value
                            ? 'bg-violet-100 font-medium text-violet-700'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <div>{tone.label}</div>
                        <div className="text-xs opacity-70">{tone.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Chat Area */}
                <div className="flex flex-1 flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    {suggestions.length === 0 ? (
                      <div className="flex h-full flex-col items-center justify-center text-center">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-violet-100 text-violet-600">
                          <Lightbulb className="h-10 w-10" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-gray-900">AI Website Editor</h3>
                        <p className="max-w-sm text-gray-500">
                          Get AI-powered suggestions for layouts, text, and color schemes. All
                          processing happens locally in your browser for complete privacy.
                        </p>
                        {!isPro && (
                          <div className="mt-6 rounded-2xl bg-amber-50 p-4 text-sm text-amber-800">
                            <div className="flex items-center gap-2 font-medium">
                              <Sparkles className="h-4 w-4" />
                              Pro Feature
                            </div>
                            <p className="mt-1 text-amber-700">
                              Upgrade to Pro for unlimited AI suggestions
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {suggestions.map((suggestion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="rounded-2xl border border-gray-100 bg-gray-50 p-5"
                          >
                            {suggestion.type === 'layout' ? (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <Layout className="h-5 w-5 text-violet-600" />
                                  <h4 className="font-semibold text-gray-900">
                                    {suggestion.description}
                                  </h4>
                                </div>
                                <p className="mb-4 text-sm text-gray-600">
                                  {suggestion.reasoning}
                                </p>
                                <div className="space-y-3">
                                  {suggestion.blocks.map((block, bIndex) => (
                                    <div
                                      key={bIndex}
                                      className="rounded-xl bg-white p-4 shadow-sm"
                                    >
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <p className="font-medium text-gray-900">
                                            {block.title}
                                          </p>
                                          <p className="text-sm text-gray-500">
                                            {block.type} • {block.colSpan}x{block.rowSpan}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() =>
                                            onApplySuggestion({
                                              ...suggestion,
                                              blocks: [block],
                                            } as LayoutSuggestion)
                                          }
                                          className="rounded-lg bg-violet-100 px-3 py-1.5 text-sm font-medium text-violet-700 hover:bg-violet-200"
                                        >
                                          Add Block
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <button
                                  onClick={() => onApplySuggestion(suggestion)}
                                  className="mt-4 w-full rounded-xl bg-violet-600 py-2.5 font-medium text-white hover:bg-violet-700"
                                >
                                  Apply All Suggestions
                                </button>
                              </div>
                            ) : (
                              <div>
                                <div className="mb-3 flex items-center gap-2">
                                  <Type className="h-5 w-5 text-violet-600" />
                                  <h4 className="font-semibold text-gray-900">
                                    Text Suggestions ({suggestion.tone})
                                  </h4>
                                </div>
                                <div className="space-y-3">
                                  {suggestion.suggestions.map((text, tIndex) => (
                                    <div
                                      key={tIndex}
                                      className="flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm"
                                    >
                                      <div className="flex-1">
                                        <p className="text-gray-700">{text}</p>
                                      </div>
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleCopy(text, tIndex)}
                                          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                                          title="Copy"
                                        >
                                          {copiedIndex === tIndex ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                          ) : (
                                            <Copy className="h-4 w-4" />
                                          )}
                                        </button>
                                        <button
                                          onClick={() =>
                                            onApplySuggestion({
                                              ...suggestion,
                                              selectedText: text,
                                            } as TextSuggestion)
                                          }
                                          className="rounded-lg bg-violet-100 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-200"
                                        >
                                          Use
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Input Area */}
                  <div className="border-t border-gray-100 p-4">
                    <form onSubmit={handleSubmit} className="flex gap-3">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          placeholder={
                            isPro
                              ? "Ask AI for layout suggestions, text ideas, or color schemes..."
                              : "Upgrade to Pro to use AI features"
                          }
                          disabled={!isPro || isLoading}
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-gray-900 placeholder-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 disabled:opacity-50"
                        />
                        <MessageSquare className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      </div>
                      <button
                        type="submit"
                        disabled={!isPro || isLoading || !input.trim()}
                        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5" />
                        )}
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </form>
                    {!isPro && (
                      <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-500">
                        <AlertCircle className="h-4 w-4" />
                        <span>AI features are available with Pro</span>
                        <button
                          onClick={() => setShowUpgradePrompt(true)}
                          className="font-medium text-violet-600 hover:text-violet-700"
                        >
                          Upgrade now
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradePrompt
        isOpen={showUpgradePrompt}
        onClose={() => setShowUpgradePrompt(false)}
        onUpgrade={() => {
          setShowUpgradePrompt(false);
          onClose();
        }}
        feature="AI-powered website editing with WebLLM"
      />
    </>
  );
};

export default WebLLMModal;
