-- Migration: Update subscription fields from Stripe to DodoPayments
-- This migration renames the Stripe columns to DodoPayments columns

-- Rename stripe_customer_id to dodo_customer_id
ALTER TABLE user_profiles 
RENAME COLUMN stripe_customer_id TO dodo_customer_id;

-- Rename stripe_subscription_id to dodo_subscription_id
ALTER TABLE user_profiles 
RENAME COLUMN stripe_subscription_id TO dodo_subscription_id;

-- Add comment to document the change
COMMENT ON COLUMN user_profiles.dodo_customer_id IS 'DodoPayments customer ID for subscription management';
COMMENT ON COLUMN user_profiles.dodo_subscription_id IS 'DodoPayments subscription ID for Pro users';
