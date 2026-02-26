-- Migration: OpenBento Templates Table
-- Creates a table for storing and managing bento templates
-- This allows users to save and share their bento designs as templates

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('retail', 'food', 'services', 'creative')),
  description TEXT,
  preview_image TEXT,
  template_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_templates_category ON templates(category);
CREATE INDEX IF NOT EXISTS idx_templates_public ON templates(is_public);
CREATE INDEX IF NOT EXISTS idx_templates_usage ON templates(usage_count DESC);
CREATE INDEX IF NOT EXISTS idx_templates_created_by ON templates(created_by);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON templates
  FOR EACH ROW
  EXECUTE FUNCTION update_templates_updated_at();

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

-- Create policy for users to read their own templates (including private ones)
CREATE POLICY "Users can view their own templates"
  ON templates FOR SELECT
  USING (auth.uid() = created_by);

-- Create policy for users to insert their own templates
CREATE POLICY "Users can insert their own templates"
  ON templates FOR INSERT
  WITH CHECK (auth.uid() = created_by);

-- Create policy for users to update their own templates
CREATE POLICY "Users can update their own templates"
  ON templates FOR UPDATE
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- Create policy for users to delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON templates FOR DELETE
  USING (auth.uid() = created_by);

-- Grant permissions to authenticated users
GRANT SELECT ON templates TO authenticated;
GRANT SELECT ON templates TO anon;
GRANT INSERT ON templates TO authenticated;
GRANT UPDATE ON templates TO authenticated;
GRANT DELETE ON templates TO authenticated;
GRANT EXECUTE ON FUNCTION increment_template_usage(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_template_usage(UUID) TO anon;

-- Insert some default templates (optional - can be done via app)
-- These are examples that users can customize

-- Template: Coffee Shop
INSERT INTO templates (name, category, description, template_data, is_public) VALUES
('Coffee Shop', 'food', 'A warm and inviting template for coffee shops and cafes', 
'{"profile":{"name":"Morning Brew Coffee","bio":"Your neighborhood coffee shop\nFreshly roasted • Organic • Fair Trade","avatarUrl":"https://picsum.photos/seed/coffee/200/200","theme":"light","primaryColor":"amber","showBranding":true},"blocks":[{"id":"block1","type":"LINK","title":"Our Menu","content":"/menu","colSpan":6,"rowSpan":3,"gridColumn":1,"gridRow":1,"color":"bg-amber-500","textColor":"text-white"},{"id":"block2","type":"RATING","title":"Customer Reviews","ratingValue":4.8,"ratingCount":324,"colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":1,"color":"bg-yellow-50"},{"id":"block3","type":"MAP_EMBED","title":"Visit Us","mapAddress":"123 Coffee Lane, Downtown","mapShowDirections":true,"colSpan":6,"rowSpan":6,"gridColumn":1,"gridRow":4,"color":"bg-gray-100"},{"id":"block4","type":"LINK","title":"Order Online","content":"/order","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":4,"color":"bg-gray-900","textColor":"text-white"},{"id":"block5","type":"QR_CODE","title":"Scan for Rewards","qrLabel":"Join our loyalty program","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":7,"color":"bg-white"}]}',
true);

-- Template: Fashion Boutique
INSERT INTO templates (name, category, description, template_data, is_public) VALUES
('Fashion Boutique', 'retail', 'Elegant template for clothing and fashion stores',
'{"profile":{"name":"Style House","bio":"Curated fashion for the modern wardrobe","avatarUrl":"https://picsum.photos/seed/fashion/200/200","theme":"light","primaryColor":"rose","showBranding":true},"blocks":[{"id":"block1","type":"LINK","title":"New Collection","content":"/new","colSpan":6,"rowSpan":4,"gridColumn":1,"gridRow":1,"color":"bg-rose-500","textColor":"text-white"},{"id":"block2","type":"RATING","title":"Shop Reviews","ratingValue":4.9,"ratingCount":156,"colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":1,"color":"bg-yellow-50"},{"id":"block3","type":"LINK","title":"Shop Now","content":"/shop","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":4,"color":"bg-gray-900","textColor":"text-white"},{"id":"block4","type":"MAP_EMBED","title":"Our Store","mapAddress":"456 Fashion Ave","mapShowDirections":true,"colSpan":6,"rowSpan":5,"gridColumn":1,"gridRow":5,"color":"bg-gray-100"},{"id":"block5","type":"QR_CODE","title":"Get 15% Off","qrLabel":"Scan for discount code","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":7,"color":"bg-white"}]}',
true);

-- Template: Hair Salon
INSERT INTO templates (name, category, description, template_data, is_public) VALUES
('Hair Salon', 'services', 'Professional template for salons and beauty services',
'{"profile":{"name":"Luxe Hair Studio","bio":"Premium hair care & styling\nExperienced stylists • Premium products","avatarUrl":"https://picsum.photos/seed/salon/200/200","theme":"light","primaryColor":"purple","showBranding":true},"blocks":[{"id":"block1","type":"LINK","title":"Book Appointment","content":"/book","colSpan":6,"rowSpan":3,"gridColumn":1,"gridRow":1,"color":"bg-purple-600","textColor":"text-white"},{"id":"block2","type":"RATING","title":"Client Reviews","ratingValue":4.9,"ratingCount":412,"colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":1,"color":"bg-yellow-50"},{"id":"block3","type":"LINK","title":"Our Services","content":"/services","colSpan":3,"rowSpan":3,"gridColumn":1,"gridRow":4,"color":"bg-gray-100"},{"id":"block4","type":"LINK","title":"Gallery","content":"/gallery","colSpan":3,"rowSpan":3,"gridColumn":4,"gridRow":4,"color":"bg-gray-900","textColor":"text-white"},{"id":"block5","type":"MAP_EMBED","title":"Find Us","mapAddress":"789 Beauty Blvd","mapShowDirections":true,"colSpan":3,"rowSpan":6,"gridColumn":7,"gridRow":4,"color":"bg-gray-100"},{"id":"block6","type":"QR_CODE","title":"Book Online","qrLabel":"Scan to schedule","colSpan":3,"rowSpan":3,"gridColumn":1,"gridRow":7,"color":"bg-white"}]}',
true);

-- Template: Art Gallery
INSERT INTO templates (name, category, description, template_data, is_public) VALUES
('Art Gallery', 'creative', 'Minimalist template for artists and galleries',
'{"profile":{"name":"The Gallery","bio":"Contemporary art space\nFeaturing local & international artists","avatarUrl":"https://picsum.photos/seed/art/200/200","theme":"light","primaryColor":"gray","showBranding":true},"blocks":[{"id":"block1","type":"LINK","title":"Current Exhibition","content":"/exhibition","colSpan":6,"rowSpan":4,"gridColumn":1,"gridRow":1,"color":"bg-gray-900","textColor":"text-white"},{"id":"block2","type":"RATING","title":"Visitor Reviews","ratingValue":4.7,"ratingCount":89,"colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":1,"color":"bg-yellow-50"},{"id":"block3","type":"LINK","title":"Artists","content":"/artists","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":4,"color":"bg-gray-100"},{"id":"block4","type":"MAP_EMBED","title":"Visit Gallery","mapAddress":"101 Art District","mapShowDirections":true,"colSpan":6,"rowSpan":5,"gridColumn":1,"gridRow":5,"color":"bg-gray-50"},{"id":"block5","type":"QR_CODE","title":"Virtual Tour","qrLabel":"Scan to explore online","colSpan":3,"rowSpan":3,"gridColumn":7,"gridRow":7,"color":"bg-white"}]}',
true);
