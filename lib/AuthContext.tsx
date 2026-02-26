import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from './supabase';
import { getUserProfile, upsertUserProfile } from './database';
import type { AuthUser, SubscriptionTier } from './database-types';
import { toAuthUser } from './database-types';

interface AuthContextType {
  // Auth state
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isPro: boolean;
  
  // Auth methods
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, displayName?: string) => Promise<{ error: string | null; needsEmailConfirmation?: boolean }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  
  // Configuration
  isConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isConfigured = isSupabaseConfigured();

  // Fetch and set user from Supabase session
  const fetchUser = useCallback(async (sessionUser: User | null) => {
    if (!sessionUser || !supabase) {
      setUser(null);
      return;
    }

    // Get profile from database
    let profile = await getUserProfile(sessionUser.id);

    // If no profile exists, create one
    if (!profile) {
      profile = await upsertUserProfile(
        sessionUser.id,
        sessionUser.email || '',
        sessionUser.user_metadata?.full_name,
        sessionUser.user_metadata?.avatar_url
      );
    }

    setUser(toAuthUser(sessionUser, profile));
  }, []);

  // Initialize auth state
  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      fetchUser(initialSession?.user || null).finally(() => setIsLoading(false));
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession);
      await fetchUser(newSession?.user || null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchUser]);

  // Sign in with email/password
  const signInWithEmail = async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!supabase) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Incorrect email or password. Please try again.' };
        }
        return { error: error.message };
      }
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Sign up with email/password
  const signUpWithEmail = async (
    email: string,
    password: string,
    displayName?: string
  ): Promise<{ error: string | null; needsEmailConfirmation?: boolean }> => {
    if (!supabase) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: displayName || null,
          },
        },
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Try signing in instead.' };
        }
        if (error.message.includes('Password')) {
          return { error: 'Password must be at least 6 characters long.' };
        }
        return { error: error.message };
      }

      // Check if email confirmation is required
      const needsConfirmation = !data.session && data.user && !data.user.email_confirmed_at;

      // Create profile if user was created
      if (data.user) {
        await upsertUserProfile(data.user.id, email, displayName);
      }

      return { error: null, needsEmailConfirmation: needsConfirmation };
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Sign in with Google
  const signInWithGoogle = async (): Promise<{ error: string | null }> => {
    if (!supabase) {
      return { error: 'Authentication is not configured. Please contact support.' };
    }

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        return { error: error.message };
      }
      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred. Please try again.' };
    }
  };

  // Sign out
  const signOut = async () => {
    if (!supabase) return;

    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    if (!session?.user || !supabase) return;
    await fetchUser(session.user);
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isPro: user?.subscriptionTier === 'pro' && user?.subscriptionStatus === 'active',
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    refreshUser,
    isConfigured,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook to check if user can use Pro features
export function useProFeatures() {
  const { isPro, isAuthenticated } = useAuth();

  return {
    isPro,
    isAuthenticated,
    canUseCustomDomain: isPro,
    canUseAdvancedAnalytics: isPro,
    canRemoveBranding: isPro,
    canExportToCustomDomain: isPro,
    canUseWebLLM: isPro,
    canUse3DBlocks: isPro,
    canUseLivePreview: isPro,
    canUseCustomCSS: isPro,
    canExportToAllPlatforms: isPro,
    hasPrioritySupport: isPro,
    hasNoAds: isPro,
    requiresUpgrade: !isPro,
    limits: {
      maxProjects: isPro ? Infinity : 3,
      maxBlocksPerProject: isPro ? Infinity : 15,
      canUseCustomDomain: isPro,
      canRemoveBranding: isPro,
      canUseAdvancedAnalytics: isPro,
      canUseWebLLM: isPro,
      canUse3DBlocks: isPro,
      canUseCustomCSS: isPro,
      canUseLivePreview: isPro,
      canExportToAllPlatforms: isPro,
      hasPrioritySupport: isPro,
      hasNoAds: isPro,
    },
    checkFeature: (feature: string) => isPro,
    getUpgradeMessage: (featureName: string) =>
      isAuthenticated
        ? `Upgrade to Pro to unlock ${featureName}`
        : `Sign in and upgrade to Pro to unlock ${featureName}`,
    upgradeMessage: isAuthenticated
      ? 'Upgrade to Pro to unlock this feature'
      : 'Sign in and upgrade to Pro to unlock this feature',
  };
}
