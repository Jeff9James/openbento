import React, { useState } from 'react';
import { BentoTemplate, TemplateCategory, BlockData, UserProfile, SiteData } from '../types';
import { TEMPLATE_CATEGORIES, getTemplatesByCategory, getTemplateById, allTemplates } from '../templates';
import { X, Search, Grid, ChevronRight, Layout, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TemplateGalleryProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (template: BentoTemplate) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ isOpen, onClose, onImport }) => {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<BentoTemplate | null>(null);

  const filteredTemplates = allTemplates.filter((template) => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleImport = (template: BentoTemplate) => {
    onImport(template);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Layout size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Template Gallery</h2>
              <p className="text-sm text-white/80">Choose a template to get started</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search and Categories */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative mb-4">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 focus:outline-none transition-all"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-violet-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              All Templates
            </button>
            {TEMPLATE_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <motion.button
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedTemplate(template)}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden text-left hover:shadow-lg hover:border-violet-300 transition-all group"
              >
                {/* Preview Area */}
                <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 relative overflow-hidden">
                  <div className="absolute inset-0 p-2">
                    {/* Mini grid preview */}
                    <div className="grid grid-cols-9 gap-0.5 h-full opacity-50">
                      {Array.from({ length: 18 }).map((_, i) => (
                        <div
                          key={i}
                          className={`rounded-sm ${
                            template.blocks.some((b) => {
                              const col = b.gridColumn || 1;
                              const row = b.gridRow || 1;
                              return i >= (row - 1) * 9 && i < (row - 1 + b.rowSpan) * 9 &&
                                (i % 9) >= col - 1 && (i % 9) < col - 1 + b.colSpan;
                            })
                              ? ['bg-pink-300', 'bg-blue-300', 'bg-green-300', 'bg-amber-300', 'bg-purple-300', 'bg-rose-300'][i % 6]
                              : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 bg-white/90 rounded-md text-xs font-medium text-gray-700 capitalize">
                      {template.category}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">{template.description}</p>
                  
                  {/* Features */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {template.blocks.some(b => b.type === 'GOOGLE_MAP') && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs font-medium">Map</span>
                    )}
                    {template.blocks.some(b => b.type === 'GOOGLE_RATING') && (
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded text-xs font-medium">Rating</span>
                    )}
                    {template.blocks.some(b => b.type === 'QR_CODE') && (
                      <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">QR Code</span>
                    )}
                    {template.blocks.some(b => b.type === 'SOCIAL') && (
                      <span className="px-2 py-0.5 bg-pink-100 text-pink-700 rounded text-xs font-medium">Social</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-500">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              {selectedTemplate && (
                <button
                  onClick={() => handleImport(selectedTemplate)}
                  className="px-4 py-2 bg-violet-600 text-white font-medium hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Sparkles size={16} />
                  Use Template
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Template Preview Modal */}
        <AnimatePresence>
          {selectedTemplate && (
            <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-8">
              <div className="max-w-4xl w-full max-h-full overflow-y-auto">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">{selectedTemplate.name}</h3>
                    <p className="text-gray-500 mt-1">{selectedTemplate.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Profile Preview */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Profile</h4>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-full" />
                    <div>
                      <p className="font-semibold text-gray-900">{selectedTemplate.profile.name}</p>
                      <p className="text-sm text-gray-500">{selectedTemplate.profile.bio}</p>
                    </div>
                  </div>
                </div>

                {/* Blocks Preview */}
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Blocks ({selectedTemplate.blocks.length})</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.blocks.map((block, index) => (
                      <div
                        key={index}
                        className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm"
                      >
                        <span className="font-medium text-gray-700">{block.type}</span>
                        {block.title && <span className="text-gray-500"> - {block.title}</span>}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={() => setSelectedTemplate(null)}
                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Choose Different
                  </button>
                  <button
                    onClick={() => handleImport(selectedTemplate)}
                    className="px-6 py-2 bg-violet-600 text-white font-medium hover:bg-violet-700 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Sparkles size={16} />
                    Import This Template
                  </button>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TemplateGallery;
