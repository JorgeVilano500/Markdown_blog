import { createServerSupabase } from '$lib/serverSupabaseClient';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const supabase = createServerSupabase(SUPABASE_SERVICE_ROLE_KEY);

export const GET: RequestHandler = async ({ url }) => {
    const { data: posts } = await supabase
        .from('posts')
        .select('id, created_at')
        .order('created_at', { ascending: false });

    const origin = url.origin;

    const postEntries = (posts ?? []).map((post: { id: string; created_at: string }) => `
  <url>
    <loc>${origin}/posts/${post.id}</loc>
    <lastmod>${new Date(post.created_at).toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>`).join('');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${postEntries}
</urlset>`;

    return new Response(xml, {
        headers: {
            'Content-Type': 'application/xml',
            'Cache-Control': 'max-age=3600'
        }
    });
};
