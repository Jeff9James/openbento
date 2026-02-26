import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Settings, 
  CreditCard, 
  LogOut, 
  ChevronDown, 
  Crown, 
  Sparkles,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface UserDropdownProps {
  onOpenSettings: () => void;
  onOpenUpgrade: () => void;
}

export default function UserDropdown({ onOpenSettings, onOpenUpgrade }: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user, signOut, isPro } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  const initials = user.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div ref={dropdownRef} className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="User menu"
        aria-expanded={isOpen}
      >
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
          {initials}
        </div>
        <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
          {user.displayName || user.email.split('@')[0]}
        </span>
        {isPro && (
          <Crown className="w-4 h-4 text-amber-500" />
        )}
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            {/* User Info Header */}
            <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Subscription Status */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isPro ? (
                    <>
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700">Pro Plan</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">Free Plan</span>
                    </>
                  )}
                </div>
                {!isPro && (
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onOpenUpgrade();
                    }}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700"
                  >
                    Upgrade
                  </button>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="w-full px-3 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <Settings className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">Account Settings</span>
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenUpgrade();
                }}
                className="w-full px-3 py-2.5 flex items-center gap-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors text-left"
              >
                <CreditCard className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium">
                  {isPro ? 'Manage Subscription' : 'Upgrade to Pro'}
                </span>
              </button>

              <div className="my-2 border-t border-gray-100" />

              <button
                onClick={handleSignOut}
                className="w-full px-3 py-2.5 flex items-center gap-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
