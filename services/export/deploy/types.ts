/**
 * Deployment target types
 */

export type ExportDeploymentTarget =
  | 'vercel'
  | 'netlify'
  | 'github-pages'
  | 'docker'
  | 'vps'
  | 'heroku';

/**
 * Published site - stored in Supabase for instant deployment
 */
export interface PublishedSite {
  id: string;
  subdomain: string;
  siteData: {
    profile: {
      name: string;
      bio: string;
      avatarUrl: string;
      avatarStyle?: {
        shape: 'circle' | 'square' | 'rounded';
        shadow: boolean;
        border: boolean;
        borderColor?: string;
        borderWidth?: number;
      };
      theme: 'light' | 'dark';
      primaryColor: string;
      showBranding?: boolean;
      showSocialInHeader?: boolean;
      showFollowerCount?: boolean;
      backgroundColor?: string;
      backgroundImage?: string;
      backgroundBlur?: number;
      socialAccounts?: Array<{
        platform: string;
        handle: string;
        followerCount?: number;
      }>;
      openGraph?: {
        title?: string;
        description?: string;
        image?: string;
        siteName?: string;
        twitterHandle?: string;
        twitterCardType?: 'summary' | 'summary_large_image';
      };
    };
    blocks: Array<Record<string, unknown>>;
    gridVersion?: number;
  };
  createdAt: string;
  updatedAt: string;
}
