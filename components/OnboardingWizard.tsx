import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store,
  Camera,
  Type,
  Palette,
  Grid3X3,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  X,
} from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingWizardProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  onComplete: () => void;
}

const STEPS = [
  { id: 'welcome', title: 'Welcome!', icon: Sparkles },
  { id: 'store-name', title: 'Your Store Name', icon: Store },
  { id: 'photo', title: 'Add Your Photo', icon: Camera },
  { id: 'description', title: 'Describe Your Business', icon: Type },
  { id: 'style', title: 'Choose Your Style', icon: Palette },
  { id: 'grid', title: 'Build Your Grid', icon: Grid3X3 },
];

const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  onComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [tempName, setTempName] = useState(profile.name || '');
  const [tempBio, setTempBio] = useState(profile.bio || '');
  const [tempAvatar, setTempAvatar] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<'modern' | 'classic' | 'playful'>('modern');

  useEffect(() => {
    if (isOpen) {
      setTempName(profile.name || '');
      setTempBio(profile.bio || '');
      setCurrentStep(0);
    }
  }, [isOpen, profile]);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const updates: Partial<UserProfile> = {};
    if (tempName.trim()) updates.name = tempName.trim();
    if (tempBio.trim()) updates.bio = tempBio.trim();
    if (tempAvatar) updates.avatarUrl = tempAvatar;

    // Apply style preset
    if (selectedStyle === 'modern') {
      updates.primaryColor = '#6366f1';
      updates.avatarStyle = { shape: 'rounded', shadow: true, border: true, borderColor: '#ffffff', borderWidth: 4 };
    } else if (selectedStyle === 'classic') {
      updates.primaryColor = '#1f2937';
      updates.avatarStyle = { shape: 'circle', shadow: false, border: true, borderColor: '#e5e7eb', borderWidth: 2 };
    } else if (selectedStyle === 'playful') {
      updates.primaryColor = '#ec4899';
      updates.avatarStyle = { shape: 'rounded', shadow: true, border: true, borderColor: '#fce7f3', borderWidth: 6 };
    }

    if (Object.keys(updates).length > 0) {
      onUpdateProfile({ ...profile, ...updates });
    }

    onComplete();
    onClose();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return tempName.trim().length > 0;
      case 2:
        return true; // Photo is optional
      case 3:
        return true; // Bio is optional
      default:
        return true;
    }
  };

  const renderStepContent = () => {
    const CurrentIcon = STEPS[currentStep].icon;

    switch (currentStep) {
      case 0:
        return (
          <div className="text-center space-y-6">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl mx-auto flex items-center justify-center shadow-xl">
              <CurrentIcon size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome to OpenBento!</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Let's set up your business page in just a few simple steps. No technical knowledge needed!
              </p>
            </div>
            <div className="flex justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Easy to use
              </span>
              <span className="flex items-center gap-2">
                <Check size={16} className="text-green-500" /> Free forever
              </span>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CurrentIcon size={36} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">What's your business name?</h2>
              <p className="text-gray-600">This will be displayed at the top of your page.</p>
            </div>
            <div className="space-y-3">
              <label htmlFor="wizard-store-name" className="block text-base font-semibold text-gray-700">
                Business / Store Name <span className="text-red-500">*</span>
              </label>
              <input
                id="wizard-store-name"
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="e.g., Joe's Coffee Shop"
                className="w-full px-5 py-4 text-lg bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                autoFocus
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CurrentIcon size={36} className="text-pink-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add your photo or logo</h2>
              <p className="text-gray-600">Help customers recognize your business. (Optional)</p>
            </div>
            <div className="flex justify-center">
              <label className="relative cursor-pointer group">
                <div className="w-40 h-40 rounded-2xl border-3 border-dashed border-gray-300 group-hover:border-pink-400 transition-colors flex flex-col items-center justify-center bg-gray-50 group-hover:bg-pink-50 overflow-hidden">
                  {tempAvatar ? (
                    <img src={tempAvatar} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Camera size={40} className="text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500 font-medium">Click to upload</span>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            {tempAvatar && (
              <button
                onClick={() => setTempAvatar(null)}
                className="text-sm text-red-500 hover:text-red-700 font-medium mx-auto block"
              >
                Remove photo
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CurrentIcon size={36} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your business</h2>
              <p className="text-gray-600">A short description helps customers understand what you offer. (Optional)</p>
            </div>
            <div className="space-y-3">
              <label htmlFor="wizard-bio" className="block text-base font-semibold text-gray-700">
                Business Description
              </label>
              <textarea
                id="wizard-bio"
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                placeholder="e.g., Family-owned coffee shop serving fresh pastries and premium coffee since 1995."
                rows={4}
                className="w-full px-5 py-4 text-lg bg-white border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CurrentIcon size={36} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your style</h2>
              <p className="text-gray-600">Pick a look that matches your brand.</p>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {[
                { id: 'modern', name: 'Modern', desc: 'Clean and professional', color: 'bg-indigo-500' },
                { id: 'classic', name: 'Classic', desc: 'Timeless and elegant', color: 'bg-gray-700' },
                { id: 'playful', name: 'Playful', desc: 'Fun and vibrant', color: 'bg-pink-500' },
              ].map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id as any)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    selectedStyle === style.id
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${style.color}`} />
                    <div>
                      <h3 className="font-bold text-gray-900">{style.name}</h3>
                      <p className="text-sm text-gray-500">{style.desc}</p>
                    </div>
                    {selectedStyle === style.id && (
                      <Check size={24} className="text-purple-500 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <CurrentIcon size={36} className="text-amber-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">You're all set!</h2>
              <p className="text-gray-600">Now let's build your page with the drag-and-drop editor.</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold text-gray-900 text-lg">Quick Tips:</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">1</div>
                  <span>Click the <strong>"Add Content"</strong> buttons to add links, photos, and more</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">2</div>
                  <span><strong>Drag and drop</strong> blocks to rearrange them</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold shrink-0">3</div>
                  <span>Click <strong>"Deploy"</strong> when ready to publish your page</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header with progress */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-500">
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              aria-label="Close wizard"
            >
              <X size={20} className="text-gray-400" />
            </button>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600"
              initial={{ width: 0 }}
              animate={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer with buttons */}
        <div className="px-8 pb-8 pt-2">
          <div className="flex gap-4">
            {currentStep > 0 ? (
              <button
                onClick={handleBack}
                className="flex-1 px-6 py-4 text-lg font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={20} />
                Back
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 px-6 py-4 text-lg font-semibold text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip for now
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl hover:from-violet-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25"
            >
              {currentStep === STEPS.length - 1 ? 'Get Started' : 'Next'}
              {currentStep < STEPS.length - 1 && <ArrowRight size={20} />}
              {currentStep === STEPS.length - 1 && <Sparkles size={20} />}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OnboardingWizard;
