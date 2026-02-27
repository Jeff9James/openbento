-- Migrate from Stripe to DodoPayments
-- This migration renames Stripe fields to DodoPayments fields

-- First, rename the existing columns
ALTER TABLE public.user_profiles 
RENAME COLUMN stripe_customer_id TO dodo_customer_id;

ALTER TABLE public.user_profiles 
RENAME COLUMN stripe_subscription_id TO dodo_subscription_id;

-- Add paused status to subscription_status if not already present
-- Note: PostgreSQL doesn't support ADD VALUE directly, so we use a workaround
DO $$ 
BEGIN
  -- Check if 'paused' is not already in the enum values
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_profiles_subscription_status_check' 
    AND contype = 'c'
  ) THEN
    -- If no check constraint exists, we need to handle this differently
    -- The check constraint may have been created differently
    NULL;
  END IF;
END $$;

-- Drop the old check constraint and add a new one with 'paused'
ALTER TABLE public.user_profiles 
DROP CONSTRAINT IF EXISTS user_profiles_subscription_status_check;

ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_subscription_status_check 
CHECK (subscription_status IN ('active', 'inactive', 'canceled', 'past_due', 'paused'));

-- Update the index name
DROP INDEX IF EXISTS public.user_profiles_stripe_customer_idx;
CREATE INDEX IF NOT EXISTS user_profiles_dodo_customer_idx ON public.user_profiles(dodo_customer_id);

-- Add a comment to document the change
COMMENT ON COLUMN public.user_profiles.dodo_customer_id IS 'DodoPayments customer ID for subscription management';
COMMENT ON COLUMN public.user_profiles.dodo_subscription_id IS 'DodoPayments subscription ID for the current subscription';

-- Note: You will need to set these secrets in your Supabase project:
-- supabase secrets set DODO_PAYMENTS_API_KEY=your_api_key
-- supabase secrets set DODO_PAYMENTS_WEBHOOK_KEY=your_webhook_secret
-- supabase secrets set DODO_PAYMENTS_ENVIRONMENT=test_mode  # or live_mode
