import { supabase } from '../lib/supabase';
import { SiteData } from '../types';

// Template stored in Supabase
export interface SupabaseTemplate {
  id: string;
  name: string;
  category: 'retail' | 'food' | 'services' | 'creative';
  description: string;
  preview_image?: string;
  template_data: SiteData;
  created_at: string;
  updated_at: string;
  created_by?: string;
  is_public: boolean;
  usage_count: number;
}

// Fetch all public templates from Supabase
export const fetchPublicTemplates = async (): Promise<SupabaseTemplate[]> => {
  if (!supabase) {
    console.warn('Supabase not configured, using local templates');
    return [];
  }

  try {
    const { data, error } = await supabase!
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch templates from Supabase:', error);
    return [];
  }
};

// Fetch templates by category
export const fetchTemplatesByCategory = async (
  category: 'retail' | 'food' | 'services' | 'creative'
): Promise<SupabaseTemplate[]> => {
  if (!supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase!
      .from('templates')
      .select('*')
      .eq('is_public', true)
      .eq('category', category)
      .order('usage_count', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Failed to fetch templates by category:', error);
    return [];
  }
};

// Save a user template to Supabase
export const saveTemplateToSupabase = async (
  template: Omit<SupabaseTemplate, 'id' | 'created_at' | 'updated_at' | 'usage_count'>
): Promise<SupabaseTemplate | null> => {
  if (!supabase) {
    console.warn('Supabase not configured');
    return null;
  }

  try {
    const { data, error } = await supabase!
      .from('templates')
      .insert({
        ...template,
        usage_count: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to save template to Supabase:', error);
    return null;
  }
};

// Increment template usage count
export const incrementTemplateUsage = async (templateId: string): Promise<void> => {
  if (!supabase) return;

  try {
    // Use raw SQL to increment atomically
    await supabase!.rpc('increment_template_usage', { template_id: templateId });
  } catch {
    // Fallback: fetch and update
    try {
      const { data } = await supabase!
        .from('templates')
        .select('usage_count')
        .eq('id', templateId)
        .single();

      if (data) {
        await supabase!
          .from('templates')
          .update({ usage_count: (data.usage_count || 0) + 1 })
          .eq('id', templateId);
      }
    } catch {
      // Silently fail - usage count is optional
    }
  }
};

// Delete a template from Supabase
export const deleteTemplateFromSupabase = async (templateId: string): Promise<boolean> => {
  if (!supabase) return false;

  try {
    const { error } = await supabase!
      .from('templates')
      .delete()
      .eq('id', templateId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Failed to delete template:', error);
    return false;
  }
};

// SQL schema for creating templates table in Supabase
export const TEMPLATES_TABLE_SQL = `
-- Create templates table for storing bento templates
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('retail', 'food', 'services', 'creative')),
  description TEXT,
  preview_image TEXT,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0
);

-- Create index for faster category queries
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_usage ON templates(usage_count DESC);

-- Create function to increment usage count atomically
CREATE OR REPLACE FUNCTION increment_template_usage(template_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE templates
  SET usage_count = usage_count + 1
  WHERE id = template_id;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Create policy for public templates (anyone can read)
CREATE POLICY "Public templates are viewable by everyone"
  ON templates FOR SELECT
  USING (is_public = true);

-- Create policy for users to manage their own templates
CREATE POLICY "Users can manage their own templates"
  ON templates FOR ALL
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);
`;

// SQL for inserting default templates
export const SEED_TEMPLATES_SQL = `
-- This SQL can be used to seed the templates table with default templates
-- Run this after creating the table to populate it with the built-in templates
`;
