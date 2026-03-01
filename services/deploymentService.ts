/**
 * Deployment Service
 *
 * Handles deployment of bento sites to subdomains
 */

import { SiteData, SavedBento } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface DeploymentOptions {
  slug: string;
  isPublished: boolean;
}

export interface DeploymentResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Generate a unique slug for a subdomain
 */
export function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 50); // Limit to 50 characters
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

/**
 * Check if a slug is available
 */
export async function checkSlugAvailability(slug: string): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    return false;
  }

  const { data, error } = await supabase!
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single();

  // If error or no data, slug is available
  return !data && !!error;
}

/**
 * Deploy a bento site to a subdomain
 */
export async function deploySite(
  bento: SavedBento,
  options: DeploymentOptions
): Promise<DeploymentResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured. Please set up your environment variables.',
    };
  }

  try {
    // Check if project exists in database
    const { data: existingProject, error: fetchError } = await supabase!
      .from('projects')
      .select('*')
      .eq('id', bento.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing project:', fetchError);
      return {
        success: false,
        error: 'Failed to check existing project.',
      };
    }

    const projectData = {
      name: bento.name,
      slug: options.slug,
      data: bento.data,
      is_published: options.isPublished,
      updated_at: new Date().toISOString(),
    };

    let projectId: string;

    if (existingProject) {
      // Update existing project
      const { data: updatedProject, error: updateError } = await supabase!
        .from('projects')
        .update(projectData)
        .eq('id', bento.id)
        .select('id')
        .single();

      if (updateError) {
        console.error('Error updating project:', updateError);
        return {
          success: false,
          error: 'Failed to update project.',
        };
      }

      projectId = updatedProject.id;
    } else {
      // Create new project (requires user_id - we'll use the current user or a placeholder)
      // For now, we'll use a placeholder user_id since authentication might not be required
      const { data: newProject, error: insertError } = await supabase!
        .from('projects')
        .insert({
          id: bento.id,
          user_id: 'anonymous', // Placeholder for anonymous users
          ...projectData,
          custom_domain: null,
          domain_verified: false,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error creating project:', insertError);
        return {
          success: false,
          error: 'Failed to create project.',
        };
      }

      projectId = newProject.id;
    }

    // Generate the public URL
    const baseUrl = window.location.origin;
    const publicUrl = `${baseUrl}/site/${options.slug}`;

    return {
      success: true,
      url: publicUrl,
    };
  } catch (error) {
    console.error('Deployment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Unpublish a site
 */
export async function unpublishSite(bentoId: string): Promise<DeploymentResult> {
  if (!isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured.',
    };
  }

  try {
    const { error } = await supabase!
      .from('projects')
      .update({ is_published: false, updated_at: new Date().toISOString() })
      .eq('id', bentoId);

    if (error) {
      console.error('Error unpublishing site:', error);
      return {
        success: false,
        error: 'Failed to unpublish site.',
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Unpublish error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Get the deployment status of a bento
 */
export async function getDeploymentStatus(bentoId: string): Promise<{
  isPublished: boolean;
  slug?: string;
  url?: string;
}> {
  if (!isSupabaseConfigured()) {
    return { isPublished: false };
  }

  try {
    const { data, error } = await supabase!
      .from('projects')
      .select('slug, is_published')
      .eq('id', bentoId)
      .single();

    if (error || !data) {
      return { isPublished: false };
    }

    const baseUrl = window.location.origin;
    return {
      isPublished: data.is_published,
      slug: data.slug,
      url: data.is_published ? `${baseUrl}/site/${data.slug}` : undefined,
    };
  } catch (error) {
    console.error('Error getting deployment status:', error);
    return { isPublished: false };
  }
}
