/**
 * Publication Service - Handles publishing sites to public subdomains
 * 
 * This service manages the "one-click deploy" functionality that allows
 * non-technical users to publish their bento page to a public URL like:
 *   username.offlink-nine.vercel.app
 * 
 * No code download required - just click "Publish" and get a public link!
 * 
 * SETUP REQUIRED:
 * 1. Configure wildcard DNS (*.yourdomain.com -> your server)
 * 2. Set VITE_PUBLISH_DOMAIN=yourdomain.com in your environment
 */

import { SavedBento, SiteData } from '../types';

const PUBLISHED_SITES_KEY = 'openbento_published_sites';
const PUBLISHED_SITE_KEY = 'openbento_published_site';

// Domain configuration from environment variables
// In production, set VITE_PUBLISH_DOMAIN=offlink-nine.vercel.app
const PUBLISH_DOMAIN = (import.meta.env.VITE_PUBLISH_DOMAIN as string) || 'arena.site';
const PUBLISH_PROTOCOL = (import.meta.env.VITE_PUBLISH_PROTOCOL as string) || 'https';

// Get the full domain (e.g., offlink-nine.vercel.app)
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
export const isSubdomainAvailable = (subdomain: string): boolean => {
  const sites = getAllPublishedSites();
  return !sites.some(s => s.subdomain === subdomain);
};

// Get an available subdomain (adds numbers if taken)
export const getAvailableSubdomain = (baseName: string): string => {
  let subdomain = generateSubdomain(baseName);
  let counter = 1;
  
  while (!isSubdomainAvailable(subdomain)) {
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

// Get all published sites
export const getAllPublishedSites = (): PublishedSite[] => {
  try {
    const stored = localStorage.getItem(PUBLISHED_SITES_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

// Get published site by subdomain
export const getPublishedSiteBySubdomain = (subdomain: string): PublishedSite | null => {
  const sites = getAllPublishedSites();
  return sites.find(s => s.subdomain === subdomain.toLowerCase()) || null;
};

// Get published site by bento ID
export const getPublishedSiteById = (id: string): PublishedSite | null => {
  const sites = getAllPublishedSites();
  return sites.find(s => s.id === id) || null;
};

// Check if a bento is published
export const isBentoPublished = (bentoId: string): boolean => {
  return getPublishedSiteById(bentoId) !== null;
};

// Get current published site for a bento (if any)
export const getCurrentPublishedSite = (bentoId: string): PublishedSite | null => {
  try {
    const stored = localStorage.getItem(PUBLISHED_SITE_KEY);
    if (!stored) return null;
    const site = JSON.parse(stored) as PublishedSite;
    return site.id === bentoId ? site : null;
  } catch {
    return null;
  }
};

// Publish a bento - creates a public subdomain
export const publishBento = (bento: SavedBento): PublishedSite => {
  const sites = getAllPublishedSites();
  
  // Check if already published
  const existing = sites.find(s => s.id === bento.id);
  if (existing) {
    // Update the existing published site with latest data
    const updated: PublishedSite = {
      ...existing,
      data: bento.data,
      lastUpdated: Date.now(),
    };
    
    const updatedSites = sites.map(s => s.id === bento.id ? updated : updated);
    localStorage.setItem(PUBLISHED_SITES_KEY, JSON.stringify(updatedSites));
    localStorage.setItem(PUBLISHED_SITE_KEY, JSON.stringify(updated));
    
    return updated;
  }
  
  // Create new published site
  const subdomain = getAvailableSubdomain(bento.name);
  const published: PublishedSite = {
    id: bento.id,
    subdomain,
    publishedAt: Date.now(),
    lastUpdated: Date.now(),
    name: bento.name,
    data: bento.data,
  };
  
  sites.push(published);
  localStorage.setItem(PUBLISHED_SITES_KEY, JSON.stringify(sites));
  localStorage.setItem(PUBLISHED_SITE_KEY, JSON.stringify(published));
  
  return published;
};

// Update published site content (re-publish with latest changes)
export const updatePublishedSite = (bento: SavedBento): PublishedSite | null => {
  const site = getCurrentPublishedSite(bento.id);
  if (!site) return null;
  
  const sites = getAllPublishedSites();
  const updated: PublishedSite = {
    ...site,
    data: bento.data,
    lastUpdated: Date.now(),
  };
  
  const updatedSites = sites.map(s => s.id === bento.id ? updated : updated);
  localStorage.setItem(PUBLISHED_SITES_KEY, JSON.stringify(updatedSites));
  localStorage.setItem(PUBLISHED_SITE_KEY, JSON.stringify(updated));
  
  return updated;
};

// Unpublish a bento (remove from public access)
export const unpublishBento = (bentoId: string): void => {
  const sites = getAllPublishedSites().filter(s => s.id !== bentoId);
  localStorage.setItem(PUBLISHED_SITES_KEY, JSON.stringify(sites));
  
  // Clear current if it was this one
  try {
    const current = localStorage.getItem(PUBLISHED_SITE_KEY);
    if (current) {
      const parsed = JSON.parse(current) as PublishedSite;
      if (parsed.id === bentoId) {
        localStorage.removeItem(PUBLISHED_SITE_KEY);
      }
    }
  } catch {
    // ignore
  }
};

// Change subdomain for a published site
export const changeSubdomain = (bentoId: string, newSubdomain: string): PublishedSite | null => {
  const sites = getAllPublishedSites();
  const site = sites.find(s => s.id === bentoId);
  
  if (!site) return null;
  
  // Check if new subdomain is available (unless it's the same site)
  const conflict = sites.find(s => s.subdomain === newSubdomain.toLowerCase() && s.id !== bentoId);
  if (conflict) return null;
  
  const updated: PublishedSite = {
    ...site,
    subdomain: newSubdomain.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
    lastUpdated: Date.now(),
  };
  
  const updatedSites = sites.map(s => s.id === bentoId ? updated : updated);
  localStorage.setItem(PUBLISHED_SITES_KEY, JSON.stringify(updatedSites));
  
  // Update current if it's this one
  try {
    const current = localStorage.getItem(PUBLISHED_SITE_KEY);
    if (current) {
      const parsed = JSON.parse(current) as PublishedSite;
      if (parsed.id === bentoId) {
        localStorage.setItem(PUBLISHED_SITE_KEY, JSON.stringify(updated));
      }
    }
  } catch {
    // ignore
  }
  
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
