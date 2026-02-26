-- OpenBento Auth and User Data Schema
-- Run this migration in your Supabase SQL editor

-- Enable required extensions
create extension if not exists "pgcrypto";

-- ============================================
-- USER PROFILES TABLE
-- ============================================
-- Stores user profile information and subscription status
create table if not exists public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  
  -- Subscription fields
  subscription_tier text not null default 'free' check (subscription_tier in ('free', 'pro')),
  subscription_status text not null default 'inactive' check (subscription_status in ('active', 'inactive', 'canceled', 'past_due')),
  stripe_customer_id text,
  stripe_subscription_id text,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.user_profiles enable row level security;

-- Policies for user_profiles
create policy "Users can view their own profile"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.user_profiles for update
  using (auth.uid() = id);

-- Allow insert during signup (service role handles this via trigger)
create policy "Allow insert during signup"
  on public.user_profiles for insert
  with check (true);

-- Index for faster lookups
create index if not exists user_profiles_email_idx on public.user_profiles(email);
create index if not exists user_profiles_stripe_customer_idx on public.user_profiles(stripe_customer_id);

-- ============================================
-- PROJECTS TABLE
-- ============================================
-- Stores user's bento projects
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.user_profiles(id) on delete cascade,
  name text not null,
  slug text not null unique,
  data jsonb not null,
  
  -- Custom domain fields
  custom_domain text unique,
  domain_verified boolean not null default false,
  
  -- Publishing status
  is_published boolean not null default false,
  
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.projects enable row level security;

-- Policies for projects
create policy "Users can view their own projects"
  on public.projects for select
  using (auth.uid() = user_id);

create policy "Users can create their own projects"
  on public.projects for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own projects"
  on public.projects for update
  using (auth.uid() = user_id);

create policy "Users can delete their own projects"
  on public.projects for delete
  using (auth.uid() = user_id);

-- Allow public access to published projects by slug
create policy "Public can view published projects"
  on public.projects for select
  using (is_published = true);

-- Indexes for faster lookups
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_slug_idx on public.projects(slug);
create index if not exists projects_custom_domain_idx on public.projects(custom_domain);
create index if not exists projects_published_idx on public.projects(is_published);

-- ============================================
-- DOMAIN VERIFICATIONS TABLE
-- ============================================
-- Tracks custom domain verification status
create table if not exists public.domain_verifications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  domain text not null,
  verification_token text not null,
  verified_at timestamptz,
  dns_records jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  
  constraint unique_project_domain unique(project_id)
);

-- Enable RLS
alter table public.domain_verifications enable row level security;

-- Policies for domain_verifications
create policy "Users can view their own domain verifications"
  on public.domain_verifications for select
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

create policy "Users can manage their own domain verifications"
  on public.domain_verifications for all
  using (
    project_id in (
      select id from public.projects where user_id = auth.uid()
    )
  );

-- Index for faster lookups
create index if not exists domain_verifications_project_idx on public.domain_verifications(project_id);
create index if not exists domain_verifications_domain_idx on public.domain_verifications(domain);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to automatically create a user profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update the updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
drop trigger if exists on_user_profiles_updated on public.user_profiles;
create trigger on_user_profiles_updated
  before update on public.user_profiles
  for each row execute procedure public.handle_updated_at();

drop trigger if exists on_projects_updated on public.projects;
create trigger on_projects_updated
  before update on public.projects
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- STORAGE BUCKETS
-- ============================================
-- Create storage bucket for user avatars and project assets
insert into storage.buckets (id, name, public)
values ('user-assets', 'user-assets', true)
on conflict (id) do nothing;

-- Policy for public read access
create policy "Public can view user assets"
  on storage.objects for select
  using (bucket_id = 'user-assets');

-- Policy for users to upload their own assets
create policy "Users can upload their own assets"
  on storage.objects for insert
  with check (
    bucket_id = 'user-assets' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for users to update their own assets
create policy "Users can update their own assets"
  on storage.objects for update
  using (
    bucket_id = 'user-assets' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy for users to delete their own assets
create policy "Users can delete their own assets"
  on storage.objects for delete
  using (
    bucket_id = 'user-assets' 
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================
-- EDGE FUNCTION SECRETS (SET MANUALLY)
-- ============================================
-- Run this in your terminal after deploying:
-- supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
-- supabase secrets set STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
