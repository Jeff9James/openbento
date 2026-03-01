import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
}

const supabase = createClient(supabaseUrl, serviceRoleKey);

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
  if (req.method !== 'GET') return json({ error: 'Method Not Allowed' }, 405);

  const url = new URL(req.url);
  const slug = url.searchParams.get('slug');

  if (!slug) {
    return json({ error: 'Missing slug parameter' }, 400);
  }

  // Get the published project by slug
  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (error || !project) {
    return json({ error: 'Site not found or not published' }, 404);
  }

  // Return the site data
  return json({
    site: {
      id: project.id,
      name: project.name,
      slug: project.slug,
      data: project.data,
      custom_domain: project.custom_domain,
    },
  });
});
