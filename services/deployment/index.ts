/**
 * Auto-Deployment Service
 *
 * Handles deployment of bento sites to subdomains without requiring
 * users to download code or manage hosting themselves.
 */

import { SiteData, SavedBento } from '../../types';

export interface DeploymentConfig {
  /** The base domain for subdomains (e.g., "offlink.bio") */
  baseDomain: string;
  /** API endpoint for deployment */
  apiEndpoint: string;
  /** Optional API key for authentication */
  apiKey?: string;
}

export interface DeploymentStatus {
  id: string;
  subdomain: string;
  url: string;
  status: 'pending' | 'building' | 'deployed' | 'failed';
  createdAt: number;
  updatedAt: number;
  error?: string;
}

export interface DeployOptions {
  subdomain: string;
  siteData: SiteData;
  bento?: SavedBento;
}

export interface SubdomainCheckResult {
  available: boolean;
  subdomain: string;
  message?: string;
}

// Default configuration - can be overridden via environment variables
const getDefaultConfig = (): DeploymentConfig => ({
  baseDomain: import.meta.env.VITE_DEPLOYMENT_BASE_DOMAIN || 'offlink.bio',
  apiEndpoint: import.meta.env.VITE_DEPLOYMENT_API_ENDPOINT || '/api/deploy',
  apiKey: import.meta.env.VITE_DEPLOYMENT_API_KEY,
});

/**
 * Validate subdomain format
 */
export const validateSubdomain = (subdomain: string): { valid: boolean; error?: string } => {
  if (!subdomain || subdomain.trim().length === 0) {
    return { valid: false, error: 'Subdomain is required' };
  }

  const trimmed = subdomain.trim().toLowerCase();

  // Length check
  if (trimmed.length < 2) {
    return { valid: false, error: 'Subdomain must be at least 2 characters' };
  }
  if (trimmed.length > 63) {
    return { valid: false, error: 'Subdomain must be less than 63 characters' };
  }

  // Character validation - only allow alphanumeric and hyphens
  const validPattern = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!validPattern.test(trimmed)) {
    return {
      valid: false,
      error: 'Subdomain can only contain letters, numbers, and hyphens (cannot start or end with hyphen)',
    };
  }

  // Reserved subdomains
  const reservedSubdomains = [
    'www',
    'api',
    'admin',
    'app',
    'dashboard',
    'api',
    'static',
    'cdn',
    'mail',
    'ftp',
    'smtp',
    'pop',
    'imap',
    'ns1',
    'ns2',
    'ns3',
    'ns4',
    'test',
    'dev',
    'staging',
    'prod',
    'production',
    'localhost',
    'demo',
    'blog',
    'shop',
    'store',
    'support',
    'help',
    'docs',
    'documentation',
  ];

  if (reservedSubdomains.includes(trimmed)) {
    return { valid: false, error: 'This subdomain is reserved' };
  }

  return { valid: true };
};

/**
 * Check if a subdomain is available
 */
export const checkSubdomainAvailability = async (
  subdomain: string,
  config?: Partial<DeploymentConfig>
): Promise<SubdomainCheckResult> => {
  const cfg = { ...getDefaultConfig(), ...config };

  try {
    const response = await fetch(`${cfg.apiEndpoint}/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cfg.apiKey && { 'X-API-Key': cfg.apiKey }),
      },
      body: JSON.stringify({ subdomain: subdomain.toLowerCase().trim() }),
    });

    if (!response.ok) {
      // If API fails, assume it's available (will be validated during deployment)
      return {
        available: true,
        subdomain: subdomain.toLowerCase().trim(),
        message: 'Could not verify availability',
      };
    }

    const result = await response.json();
    return {
      available: result.available,
      subdomain: subdomain.toLowerCase().trim(),
      message: result.message,
    };
  } catch (error) {
    // Network or other errors - assume available
    return {
      available: true,
      subdomain: subdomain.toLowerCase().trim(),
      message: 'Could not verify availability',
    };
  }
};

/**
 * Deploy a site to a subdomain
 */
export const deploySite = async (
  options: DeployOptions,
  config?: Partial<DeploymentConfig>
): Promise<DeploymentStatus> => {
  const cfg = { ...getDefaultConfig(), ...config };
  const { subdomain, siteData, bento } = options;

  const validation = validateSubdomain(subdomain);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Prepare deployment payload
  const payload = {
    subdomain: subdomain.toLowerCase().trim(),
    siteData,
    bentoId: bento?.id,
    bentoName: bento?.name,
    metadata: {
      name: siteData.profile.name,
      description: siteData.profile.bio,
      createdAt: bento?.createdAt || Date.now(),
      updatedAt: bento?.updatedAt || Date.now(),
    },
  };

  const response = await fetch(cfg.apiEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cfg.apiKey && { 'X-API-Key': cfg.apiKey }),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Deployment failed' }));
    throw new Error(error.error || error.message || 'Deployment failed');
  }

  const result = await response.json();

  return {
    id: result.id || `deploy_${Date.now()}`,
    subdomain: result.subdomain || subdomain,
    url: result.url || `https://${subdomain}.${cfg.baseDomain}`,
    status: result.status || 'pending',
    createdAt: result.createdAt || Date.now(),
    updatedAt: result.updatedAt || Date.now(),
  };
};

/**
 * Get deployment status
 */
export const getDeploymentStatus = async (
  deploymentId: string,
  config?: Partial<DeploymentConfig>
): Promise<DeploymentStatus> => {
  const cfg = { ...getDefaultConfig(), ...config };

  const response = await fetch(`${cfg.apiEndpoint}/status/${deploymentId}`, {
    headers: {
      ...(cfg.apiKey && { 'X-API-Key': cfg.apiKey }),
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get deployment status');
  }

  return await response.json();
};

/**
 * List deployments for a user
 */
export const listDeployments = async (
  config?: Partial<DeploymentConfig>
): Promise<DeploymentStatus[]> => {
  const cfg = { ...getDefaultConfig(), ...config };

  try {
    const response = await fetch(`${cfg.apiEndpoint}/list`, {
      headers: {
        ...(cfg.apiKey && { 'X-API-Key': cfg.apiKey }),
      },
    });

    if (!response.ok) {
      return [];
    }

    const result = await response.json();
    return result.deployments || [];
  } catch {
    return [];
  }
};

/**
 * Delete a deployment
 */
export const deleteDeployment = async (
  deploymentId: string,
  config?: Partial<DeploymentConfig>
): Promise<boolean> => {
  const cfg = { ...getDefaultConfig(), ...config };

  try {
    const response = await fetch(`${cfg.apiEndpoint}/${deploymentId}`, {
      method: 'DELETE',
      headers: {
        ...(cfg.apiKey && { 'X-API-Key': cfg.apiKey }),
      },
    });

    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Generate a suggested subdomain from the bento name
 */
export const generateSubdomainSuggestion = (name: string): string => {
  if (!name || name.trim().length === 0) {
    return `my-site-${Math.random().toString(36).substring(2, 6)}`;
  }

  // Convert to lowercase, replace spaces and special chars with hyphens
  let suggestion = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Limit length
  if (suggestion.length > 30) {
    suggestion = suggestion.substring(0, 30);
  }

  // If too short or empty, add random suffix
  if (suggestion.length < 2) {
    suggestion = `site-${Math.random().toString(36).substring(2, 6)}`;
  }

  return suggestion;
};

/**
 * Store deployment info in localStorage for persistence
 */
export const saveDeploymentInfo = (bentoId: string, deployment: DeploymentStatus): void => {
  try {
    const key = `openbento_deployment_${bentoId}`;
    localStorage.setItem(key, JSON.stringify(deployment));
  } catch {
    // Ignore storage errors
  }
};

/**
 * Get stored deployment info from localStorage
 */
export const getDeploymentInfo = (bentoId: string): DeploymentStatus | null => {
  try {
    const key = `openbento_deployment_${bentoId}`;
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

/**
 * Clear stored deployment info
 */
export const clearDeploymentInfo = (bentoId: string): void => {
  try {
    const key = `openbento_deployment_${bentoId}`;
    localStorage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
};
