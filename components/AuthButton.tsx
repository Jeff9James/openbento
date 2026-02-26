import React from 'react';
import { LogIn, User } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

interface AuthButtonProps {
  onOpenAuth: () => void;
  onOpenSettings: () => void;
  onOpenUpgrade: () => void;
}

export default function AuthButton({ onOpenAuth, onOpenSettings, onOpenUpgrade }: AuthButtonProps) {
  const { isAuthenticated, isLoading, user, isPro } = useAuth();

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
    );
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={onOpenAuth}
        className="bg-white px-3.5 py-2 rounded-lg shadow-sm border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <LogIn size={16} />
        <span className="hidden sm:inline">Sign In</span>
      </button>
    );
  }

  // User is authenticated - show user dropdown trigger
  const initials = user?.displayName
    ? user.displayName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <button
      onClick={onOpenSettings}
      className="flex items-center gap-2 bg-white px-2 py-1.5 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
    >
      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
        {initials}
      </div>
      {isPro && (
        <span className="text-xs font-medium text-amber-600">PRO</span>
      )}
    </button>
  );
}
