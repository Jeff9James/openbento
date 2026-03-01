/**
 * Publication Service - Multi-tenant SaaS for publishing sites to public subdomains
 * 
 * Uses Supabase for persistent storage to enable true multi-tenant functionality.
 * Users get their own subdomain like: username.offlink-nine.vercel.app
 * 
 * SETUP REQUIRED:
 * 1. Run the SQL migration below to create the published_sites table
 * 2. Configure wildcard DNS (*.yourdomain.com -> your server)
 * 3. Set VITE_PUBLISH_DOMAIN=yourdomain.com in Vercel environment variables
 * 
 * SQL Migration:
 * ```
 * create table published_sites (
 *   id text primary key,
 *   subdomain text unique not null,
 *   name text not null,
 *   data jsonb not null,
 *   published_at bigint not null,
 *   last_updated bigint not null,
 *   created_at timestamptz default now()
 * );
 * create index idx_published_sites_subdomain on published_sites(subdomain);
 * create index idx_published_sites_id on published_sites(id);
 * ```
 */

import { SavedBento, SiteData } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Domain configuration from environment variables
// In Vercel, set VITE_PUBLISH_DOMAIN=offlink-nine.vercel.app
const PUBLISH_DOMAIN = (import.meta.env.VITE_PUBLISH_DOMAIN as string) || 'arena.site';
const PUBLISH_PROTOCOL = (import.meta.env.VITE_PUBLISH_PROTOCOL as string) || 'https';

// Local cache for quick access (synced with Supabase)
let localCache: PublishedSite[] = [];
let cacheLoaded = false;

export const getPublishDomain = () => PUBLISH_DOMAIN;
export const getPublishProtocol = () => PUBLISH_PROTOCOL;

export interface PublishedSite {
  id: string;              // Original bento ID
  subdomain: string;       // User's chosen subdomain (e.g., "john")
  publishedAt: number;     // Timestamp when published
  lastUpdated: number;     // Timestamp of last content update
  name: string;            // Bento name
  data: SiteData;          // The site data snapshot
}

// Supabase database row type
interface PublishedSiteRow {
  id: string;
  subdomain: string;
  name: string;
  data: SiteData;
  published_at: number;
  last_updated: number;
}

// Convert DB row to PublishedSite
const rowToPublishedSite = (row: PublishedSiteRow): PublishedSite => ({
  id: row.id,
  subdomain: row.subdomain,
  name: row.name,
  data: row.data,
  publishedAt: row.published_at,
  lastUpdated: row.last_updated,
});

// Load all sites from Supabase into local cache
const loadSitesFromSupabase = async (): Promise<PublishedSite[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using empty cache');
    return [];
  }

  try {
    const { data, error } = await supabase!
      .from('published_sites')
      .select('*');
    
    if (error) {
      console.error('Failed to load published sites:', error);
      return [];
    }
    
    return data ? data.map(rowToPublishedSite) : [];
  } catch (e) {
    console.error('Error loading published sites:', e);
    return [];
  }
};

// Ensure cache is loaded
const ensureCacheLoaded = async (): Promise<PublishedSite[]> => {
  if (!cacheLoaded) {
    localCache = await loadSitesFromSupabase();
    cacheLoaded = true;
  }
  return localCache;
};

// Generate a URL-safe subdomain from a name
export const generateSubdomain = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50) || 'bento';
};

// Check if subdomain is available (not already taken)
export const isSubdomainAvailable = async (subdomain: string): Promise<boolean> => {
  const sites = await ensureCacheLoaded();
  return !sites.some(s => s.subdomain === subdomain);
};

// Get an available subdomain (adds numbers if taken)
export const getAvailableSubdomain = async (baseName: string): Promise<string> => {
  let subdomain = generateSubdomain(baseName);
  let counter = 1;
  
  while (!await isSubdomainAvailable(subdomain)) {
    subdomain = `${generateSubdomain(baseName)}${counter}`;
    counter++;
    if (counter > 100) {
      // Fallback to random
      subdomain = `bento_${Date.now().toString(36)}`;
      break;
    }
  }
  
  return subdomain;
};

// Get all published sites (from cache)
export const getAllPublishedSites = async (): Promise<PublishedSite[]> => {
  return ensureCacheLoaded();
};

// Get published site by subdomain
export const getPublishedSiteBySubdomain = async (subdomain: string): Promise<PublishedSite | null> => {
  const sites = await ensureCacheLoaded();
  return sites.find(s => s.subdomain === subdomain.toLowerCase()) || null;
};

// Get published site by bento ID
export const getPublishedSiteById = async (id: string): Promise<PublishedSite | null> => {
  const sites = await ensureCacheLoaded();
  return sites.find(s => s.id === id) || null;
};

// Check if a bento is published
export const isBentoPublished = async (bentoId: string): Promise<boolean> => {
  return (await getPublishedSiteById(bentoId)) !== null;
};

// Get current published site for a bento (if any)
export const getCurrentPublishedSite = async (bentoId: string): Promise<PublishedSite | null> => {
  return getPublishedSiteById(bentoId);
};

// Publish a bento - creates a public subdomain
export const publishBento = async (bento: SavedBento): Promise<PublishedSite> => {
  const sites = await ensureCacheLoaded();
  
  // Check if already published
  const existing = sites.find(s => s.id === bento.id);
  if (existing) {
    // Update the existing published site with latest data
    const updated: PublishedSite = {
      ...existing,
      data: bento.data,
      lastUpdated: Date.now(),
    };
    
    // Update in Supabase
    if (isSupabaseConfigured()) {
      await supabase!
        .from('published_sites')
        .update({
          data: updated.data,
          last_updated: updated.lastUpdated,
        })
        .eq('id', bento.id);
    }
    
    // Update local cache
    localCache = localCache.map(s => s.id === bento.id ? updated : s);
    
    return updated;
  }
  
  // Create new published site
  const subdomain = await getAvailableSubdomain(bento.name);
  const published: PublishedSite = {
    id: bento.id,
    subdomain,
    publishedAt: Date.now(),
    lastUpdated: Date.now(),
    name: bento.name,
    data: bento.data,
  };
  
  // Save to Supabase
  if (isSupabaseConfigured()) {
    const { error } = await supabase!
      .from('published_sites')
      .insert({
        id: published.id,
        subdomain: published.subdomain,
        name: published.name,
        data: published.data,
        published_at: published.publishedAt,
        last_updated: published.lastUpdated,
      });
    
    if (error) {
      console.error('Failed to publish site:', error);
      throw new Error('Failed to publish site: ' + error.message);
    }
  }
  
  // Add to local cache
  localCache.push(published);
  
  return published;
};

// Update published site content (re-publish with latest changes)
export const updatePublishedSite = async (bento: SavedBento): Promise<PublishedSite | null> => {
  const site = await getPublishedSiteById(bento.id);
  if (!site) return null;
  
  const updated: PublishedSite = {
    ...site,
    data: bento.data,
    lastUpdated: Date.now(),
  };
  
  // Update in Supabase
  if (isSupabaseConfigured()) {
    await supabase!
      .from('published_sites')
      .update({
        data: updated.data,
        last_updated: updated.lastUpdated,
      })
      .eq('id', bento.id);
  }
  
  // Update local cache
  localCache = localCache.map(s => s.id === bento.id ? updated : s);
  
  return updated;
};

// Unpublish a bento (remove from public access)
export const unpublishBento = async (bentoId: string): Promise<void> => {
  // Remove from Supabase
  if (isSupabaseConfigured()) {
    await supabase!
      .from('published_sites')
      .delete()
      .eq('id', bentoId);
  }
  
  // Remove from local cache
  localCache = localCache.filter(s => s.id !== bentoId);
};

// Change subdomain for a published site
export const changeSubdomain = async (bentoId: string, newSubdomain: string): Promise<PublishedSite | null> => {
  const sites = await ensureCacheLoaded();
  const site = sites.find(s => s.id === bentoId);
  
  if (!site) return null;
  
  const cleanSubdomain = newSubdomain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
  
  // Check if new subdomain is available (unless it's the same site)
  const conflict = sites.find(s => s.subdomain === cleanSubdomain && s.id !== bentoId);
  if (conflict) return null;
  
  const updated: PublishedSite = {
    ...site,
    subdomain: cleanSubdomain,
    lastUpdated: Date.now(),
  };
  
  // Update in Supabase
  if (isSupabaseConfigured()) {
    const { error } = await supabase!
      .from('published_sites')
      .update({
        subdomain: updated.subdomain,
        last_updated: updated.lastUpdated,
      })
      .eq('id', bentoId);
    
    if (error) {
      console.error('Failed to update subdomain:', error);
      return null;
    }
  }
  
  // Update local cache
  localCache = localCache.map(s => s.id === bentoId ? updated : s);
  
  return updated;
};

// Get the public URL for a published site
export const getPublishedUrl = (subdomain: string): string => {
  return `${PUBLISH_PROTOCOL}://${subdomain}.${PUBLISH_DOMAIN}`;
};

// Get config for publishing
export const getPublishConfig = () => ({
  domain: PUBLISH_DOMAIN,
  protocol: PUBLISH_PROTOCOL,
});

// Check if Supabase is configured
export const isPublicationConfigured = () => isSupabaseConfigured();
