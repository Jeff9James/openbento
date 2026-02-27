import type { User } from '@supabase/supabase-js';
import type { SiteData } from '../types';

// Subscription tier type
export type SubscriptionTier = 'free' | 'pro';

// Template category type
export type TemplateCategory = 'retail' | 'food' | 'services' | 'creative';

// User profile in database
export interface DbUserProfile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  subscription_tier: SubscriptionTier;
  subscription_status: 'active' | 'inactive' | 'canceled' | 'past_due';
  dodo_customer_id: string | null;
  dodo_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

// Project in database
export interface DbProject {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  data: SiteData;
  custom_domain: string | null;
  domain_verified: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

// Template in database
export interface DbTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string | null;
  preview_image: string | null;
  template_data: SiteData;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  is_public: boolean;
  usage_count: number;
}

// Custom domain verification record
export interface DomainVerification {
  id: string;
  project_id: string;
  domain: string;
  verification_token: string;
  verified_at: string | null;
  dns_records: {
    type: 'CNAME' | 'A';
    name: string;
    value: string;
  }[];
  created_at: string;
}

// Auth user type extending Supabase User
export interface AuthUser {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  subscriptionTier: SubscriptionTier;
  subscriptionStatus: 'active' | 'inactive' | 'canceled' | 'past_due';
}

// Convert Supabase user + profile to AuthUser
export function toAuthUser(user: User, profile?: DbUserProfile | null): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    displayName: profile?.display_name || user.user_metadata?.full_name || null,
    avatarUrl: profile?.avatar_url || user.user_metadata?.avatar_url || null,
    subscriptionTier: profile?.subscription_tier || 'free',
    subscriptionStatus: profile?.subscription_status || 'inactive',
  };
}
