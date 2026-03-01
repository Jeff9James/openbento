-- Published Sites Table
-- Stores bento configurations for instant public deployment

CREATE TABLE IF NOT EXISTS published_sites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subdomain TEXT UNIQUE NOT NULL,
  site_data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast subdomain lookups
CREATE INDEX IF NOT EXISTS idx_published_sites_subdomain ON published_sites(subdomain);

-- Enable RLS
ALTER TABLE published_sites ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for serving published sites)
CREATE POLICY "Public sites are viewable by everyone"
  ON published_sites FOR SELECT
  USING (true);

-- Allow authenticated users to manage their sites
CREATE POLICY "Users can insert their own sites"
  ON published_sites FOR INSERT
  WITH CHECK (true);

-- Allow users to update their own sites
CREATE POLICY "Users can update their own sites"
  ON published_sites FOR UPDATE
  USING (true);

-- Allow users to delete their own sites
CREATE POLICY "Users can delete their own sites"
  ON published_sites FOR DELETE
  USING (true);
