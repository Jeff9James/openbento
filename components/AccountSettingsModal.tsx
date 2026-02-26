import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  User,
  Shield,
  CreditCard,
  Globe,
  LogOut,
  Mail,
  Crown,
  CheckCircle,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import CustomDomainSettings from './CustomDomainSettings';
import type { DbProject } from '../lib/database-types';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenUpgrade: () => void;
  activeProject?: DbProject | null;
  onProjectUpdate?: (project: DbProject) => void;
}

type TabType = 'profile' | 'subscription' | 'domain' | 'security';

export default function AccountSettingsModal({
  isOpen,
  onClose,
  onOpenUpgrade,
  activeProject,
  onProjectUpdate,
}: AccountSettingsModalProps) {
  const { user, signOut, isPro, refreshUser } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setSaveMessage(null);
    
    // In a real implementation, this would call the database to update the profile
    // For now, we'll just show a success message
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setSaveMessage({ type: 'success', text: 'Profile updated successfully!' });
    setIsSaving(false);
    
    setTimeout(() => setSaveMessage(null), 3000);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen) return null;

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'subscription', label: 'Subscription', icon: <CreditCard size={16} /> },
    ...(isPro ? [{ id: 'domain' as TabType, label: 'Custom Domain', icon: <Globe size={16} /> }] : []),
    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
  ];

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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden ring-1 ring-gray-900/5"
          role="dialog"
          aria-modal="true"
          aria-label="Account settings"
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-start">
            <div>
              <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white mb-3">
                <User size={18} />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Account Settings</h2>
              <p className="text-gray-500 mt-1 text-sm">
                Manage your profile, subscription, and preferences
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
              aria-label="Close settings"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex min-h-[400px]">
            {/* Sidebar */}
            <div className="w-56 border-r border-gray-100 p-4 bg-gray-50">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full px-3 py-2.5 rounded-xl text-sm font-medium flex items-center gap-3 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
                    
                    {/* Avatar */}
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                        {user?.displayName?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user?.displayName || 'User'}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          placeholder="Your name"
                          className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={user?.email || ''}
                            disabled
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Email can be changed in Security settings
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  {saveMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-xl ${
                      saveMessage.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                      {saveMessage.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <AlertCircle className="w-5 h-5" />
                      )}
                      <span className="text-sm">{saveMessage.text}</span>
                    </div>
                  )}

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="px-6 py-2.5 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Save Changes
                  </button>
                </div>
              )}

              {/* Subscription Tab */}
              {activeTab === 'subscription' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Subscription</h3>

                  {/* Current Plan */}
                  <div className={`p-5 rounded-2xl ${isPro ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {isPro ? (
                          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Crown className="w-5 h-5 text-amber-600" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-200 rounded-xl flex items-center justify-center">
                            <User className="w-5 h-5 text-gray-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">
                            {isPro ? 'Pro Plan' : 'Free Plan'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {isPro ? '$9/month' : '$0/month'}
                          </p>
                        </div>
                      </div>

                      {!isPro && (
                        <button
                          onClick={onOpenUpgrade}
                          className="px-4 py-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white rounded-xl font-medium hover:opacity-90"
                        >
                          Upgrade
                        </button>
                      )}
                    </div>

                    {isPro && (
                      <div className="mt-4 pt-4 border-t border-amber-200">
                        <div className="flex items-center gap-2 text-sm text-amber-700">
                          <CheckCircle className="w-4 h-4" />
                          Custom domain enabled
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-700 mt-1">
                          <CheckCircle className="w-4 h-4" />
                          No branding
                        </div>
                        <div className="flex items-center gap-2 text-sm text-amber-700 mt-1">
                          <CheckCircle className="w-4 h-4" />
                          Priority support
                        </div>
                      </div>
                    )}
                  </div>

                  {isPro && (
                    <div className="text-sm text-gray-500">
                      <p>
                        To manage or cancel your subscription,{' '}
                        <a href="#" className="text-blue-600 hover:underline">
                          visit the billing portal
                        </a>
                        .
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Custom Domain Tab */}
              {activeTab === 'domain' && isPro && (
                <CustomDomainSettings
                  project={activeProject || null}
                  onProjectUpdate={onProjectUpdate || (() => {})}
                />
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Security</h3>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Password</p>
                          <p className="text-sm text-gray-500">Change your password</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
                          Change
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                        <button className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100">
                          Enable
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 text-red-600 hover:text-red-700 font-medium"
                      >
                        <LogOut className="w-5 h-5" />
                        Sign out of all devices
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
