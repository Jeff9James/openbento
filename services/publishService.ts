/**
 * Publish Service - Handles publishing sites to the web
 * 
 * This service allows non-technical users to publish their bento
 * to a public subdomain without needing to download or deploy any code.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { SiteData } from '../types';
import type { PublishedSite } from '../export/deploy/types';

const PUBLISHED_SITES_TABLE = 'published_sites';

/**
 * Check if publishing is available (Supabase configured)
 */
export const isPublishAvailable = (): boolean => {
  return isSupabaseConfigured();
};

/**
 * Publish a site to a public subdomain
 */
export const publishSite = async (
  siteData: SiteData,
  subdomain: string
): Promise<{ success: boolean; url?: string; error?: string }> => {
  try {
    // Validate subdomain
    const cleanSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 50);
    if (!cleanSubdomain || cleanSubdomain.length < 2) {
      return { success: false, error: 'Subdomain must be at least 2 characters' };
    }

    // Check if subdomain is already taken
    const { data: existing } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .select('id')
      .eq('subdomain', cleanSubdomain)
      .single();

    if (existing) {
      // Update existing site
      const { error: updateError } = await supabase
        .from(PUBLISHED_SITES_TABLE)
        .update({
          site_data: siteData,
          updated_at: new Date().toISOString(),
        })
        .eq('subdomain', cleanSubdomain);

      if (updateError) {
        return { success: false, error: updateError.message };
      }

      const baseUrl = getBaseUrl();
      return { success: true, url: `https://${cleanSubdomain}.${baseUrl}` };
    }

    // Create new published site
    const { error: insertError } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .insert({
        subdomain: cleanSubdomain,
        site_data: siteData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (insertError) {
      return { success: false, error: insertError.message };
    }

    const baseUrl = getBaseUrl();
    return { success: true, url: `https://${cleanSubdomain}.${baseUrl}` };
  } catch (error) {
    console.error('Failed to publish site:', error);
    return { success: false, error: 'Failed to publish site. Please try again.' };
  }
};

/**
 * Unpublish a site (remove from public access)
 */
export const unpublishSite = async (
  subdomain: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .delete()
      .eq('subdomain', subdomain.toLowerCase());

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Failed to unpublish site:', error);
    return { success: false, error: 'Failed to unpublish site. Please try again.' };
  }
};

/**
 * Check if a subdomain is available
 */
export const checkSubdomainAvailability = async (
  subdomain: string
): Promise<{ available: boolean }> => {
  try {
    const { data, count } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .select('id', { count: 'exact' })
      .eq('subdomain', subdomain.toLowerCase());

    return { available: !data || count === 0 };
  } catch {
    return { available: false };
  }
};

/**
 * Get published site by subdomain
 */
export const getPublishedSite = async (
  subdomain: string
): Promise<PublishedSite | null> => {
  try {
    const { data, error } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .select('*')
      .eq('subdomain', subdomain.toLowerCase())
      .single();

    if (error || !data) {
      return null;
    }

    return {
      id: data.id,
      subdomain: data.subdomain,
      siteData: data.site_data,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  } catch {
    return null;
  }
};

/**
 * Get all published sites for a user (based on localStorage)
 */
export const getUserPublishedSites = async (): Promise<PublishedSite[]> => {
  try {
    // Get subdomains from localStorage that this user has published
    const publishedSubdomains = JSON.parse(
      localStorage.getItem('openbento_published_sites') || '[]'
    ) as string[];

    if (publishedSubdomains.length === 0) {
      return [];
    }

    const { data, error } = await supabase
      .from(PUBLISHED_SITES_TABLE)
      .select('*')
      .in('subdomain', publishedSubdomains);

    if (error || !data) {
      return [];
    }

    return data.map((item) => ({
      id: item.id,
      subdomain: item.subdomain,
      siteData: item.site_data,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));
  } catch {
    return [];
  }
};

/**
 * Save subdomain to user's local list
 */
export const savePublishedSubdomain = (subdomain: string): void => {
  const published = JSON.parse(
    localStorage.getItem('openbento_published_sites') || '[]'
  ) as string[];
  
  if (!published.includes(subdomain)) {
    published.push(subdomain);
    localStorage.setItem('openbento_published_sites', JSON.stringify(published));
  }
};

/**
 * Get the base URL for published sites
 */
function getBaseUrl(): string {
  // In production, this would be the actual domain
  // For now, use the current host
  if (typeof window === 'undefined') {
    return 'openbento.com';
  }
  
  const hostname = window.location.hostname;
  
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // If we're on localhost, use a placeholder
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'openbento.com';
  }
  
  return host;
}

/**
 * Generate a suggested subdomain based on profile name
 */
export const generateSuggestedSubdomain = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 50)
    || 'mybento';
};
