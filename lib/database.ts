import { supabase, isSupabaseConfigured } from './supabase';
import type { DbUserProfile, DbProject, AuthUser, SubscriptionTier } from './database-types';
import type { SavedBento, SiteData } from '../types';
import { toAuthUser } from './database-types';

// ============ USER PROFILE OPERATIONS ============

// Get user profile from database
export async function getUserProfile(userId: string): Promise<DbUserProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }

  return data;
}

// Create or update user profile
export async function upsertUserProfile(
  userId: string,
  email: string,
  displayName?: string,
  avatarUrl?: string
): Promise<DbUserProfile | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        id: userId,
        email,
        display_name: displayName || null,
        avatar_url: avatarUrl || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )
    .select()
    .single();

  if (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }

  return data;
}

// Update user subscription
export async function updateUserSubscription(
  userId: string,
  tier: SubscriptionTier,
  dodoCustomerId?: string,
  dodoSubscriptionId?: string
): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase
    .from('user_profiles')
    .update({
      subscription_tier: tier,
      subscription_status: tier === 'pro' ? 'active' : 'inactive',
      dodo_customer_id: dodoCustomerId || null,
      dodo_subscription_id: dodoSubscriptionId || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  return !error;
}

// ============ PROJECT OPERATIONS ============

// Generate a unique slug for a project
function generateSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${base}-${random}`;
}

// Get all projects for a user
export async function getUserProjects(userId: string): Promise<DbProject[]> {
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }

  return data || [];
}

// Get a single project by ID
export async function getProject(projectId: string): Promise<DbProject | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

// Get a project by slug (for public viewing)
export async function getProjectBySlug(slug: string): Promise<DbProject | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error) {
    console.error('Error fetching project by slug:', error);
    return null;
  }

  return data;
}

// Create a new project
export async function createProject(
  userId: string,
  name: string,
  data: SiteData
): Promise<DbProject | null> {
  if (!supabase) return null;

  const slug = generateSlug(name);

  const { data: project, error } = await supabase
    .from('projects')
    .insert({
      user_id: userId,
      name,
      slug,
      data,
      custom_domain: null,
      domain_verified: false,
      is_published: false,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating project:', error);
    return null;
  }

  return project;
}

// Update a project
export async function updateProject(
  projectId: string,
  updates: Partial<Pick<DbProject, 'name' | 'data' | 'is_published'>>
): Promise<DbProject | null> {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from('projects')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .select()
    .single();

  if (error) {
    console.error('Error updating project:', error);
    return null;
  }

  return data;
}

// Delete a project
export async function deleteProject(projectId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error } = await supabase.from('projects').delete().eq('id', projectId);

  return !error;
}

// ============ CUSTOM DOMAIN OPERATIONS ============

// Set custom domain for a project (Pro only)
export async function setCustomDomain(
  projectId: string,
  domain: string
): Promise<{ success: boolean; verificationToken?: string; dnsRecords?: typeof dnsRecords; error?: string }> {
  if (!supabase) return { success: false, error: 'Database not configured' };

  // Generate verification token
  const verificationToken = `openbento-verify-${Math.random().toString(36).substring(2, 15)}`;

  // DNS records needed for the domain
  const dnsRecords = [
    {
      type: 'CNAME' as const,
      name: domain,
      value: 'cname.vercel-dns.com', // For Vercel deployment
    },
    {
      type: 'TXT' as const,
      name: `_openbento-verification.${domain}`,
      value: verificationToken,
    },
  ];

  const { error } = await supabase.from('domain_verifications').upsert(
    {
      project_id: projectId,
      domain,
      verification_token: verificationToken,
      dns_records: dnsRecords,
      verified_at: null,
    },
    { onConflict: 'project_id' }
  );

  if (error) {
    console.error('Error setting custom domain:', error);
    return { success: false, error: error.message };
  }

  // Also update the project
  await supabase
    .from('projects')
    .update({
      custom_domain: domain,
      domain_verified: false,
    })
    .eq('id', projectId);

  return { success: true, verificationToken, dnsRecords };
}

// Verify custom domain
export async function verifyCustomDomain(
  projectId: string
): Promise<{ verified: boolean; error?: string }> {
  if (!supabase) return { verified: false, error: 'Database not configured' };

  // Get the verification record
  const { data: verification, error: fetchError } = await supabase
    .from('domain_verifications')
    .select('*')
    .eq('project_id', projectId)
    .single();

  if (fetchError || !verification) {
    return { verified: false, error: 'No domain verification found' };
  }

  // In a real implementation, we would verify the DNS records here
  // For now, we'll just mark it as verified
  const { error: updateError } = await supabase
    .from('domain_verifications')
    .update({ verified_at: new Date().toISOString() })
    .eq('project_id', projectId);

  if (updateError) {
    return { verified: false, error: updateError.message };
  }

  // Update the project
  await supabase
    .from('projects')
    .update({ domain_verified: true })
    .eq('id', projectId);

  return { verified: true };
}

// Remove custom domain
export async function removeCustomDomain(projectId: string): Promise<boolean> {
  if (!supabase) return false;

  const { error: deleteError } = await supabase
    .from('domain_verifications')
    .delete()
    .eq('project_id', projectId);

  if (deleteError) return false;

  const { error: updateError } = await supabase
    .from('projects')
    .update({
      custom_domain: null,
      domain_verified: false,
    })
    .eq('id', projectId);

  return !updateError;
}

// ============ SYNC OPERATIONS ============

// Convert SavedBento to DbProject format
export function savedBentoToDbProject(bento: SavedBento, userId: string): Omit<DbProject, 'created_at' | 'updated_at'> {
  return {
    id: bento.id,
    user_id: userId,
    name: bento.name,
    slug: generateSlug(bento.name),
    data: bento.data,
    custom_domain: null,
    domain_verified: false,
    is_published: false,
  };
}

// Convert DbProject to SavedBento format
export function dbProjectToSavedBento(project: DbProject): SavedBento {
  return {
    id: project.id,
    name: project.name,
    createdAt: new Date(project.created_at).getTime(),
    updatedAt: new Date(project.updated_at).getTime(),
    data: project.data,
  };
}

// Sync local bentos to database (for new users)
export async function syncLocalBentosToDatabase(
  userId: string,
  localBentos: SavedBento[]
): Promise<DbProject[]> {
  if (!supabase) return [];

  const projects: DbProject[] = [];

  for (const bento of localBentos) {
    const projectData = savedBentoToDbProject(bento, userId);
    const { data, error } = await supabase
      .from('projects')
      .insert(projectData)
      .select()
      .single();

    if (!error && data) {
      projects.push(data);
    }
  }

  return projects;
}

// Check if user is Pro
export async function isProUser(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.subscription_tier === 'pro' && profile?.subscription_status === 'active';
}
