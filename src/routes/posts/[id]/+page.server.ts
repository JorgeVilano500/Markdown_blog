import { supabase } from '$lib/supabaseClient';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, url }) => {
    const { data: post, error: err } = await supabase
        .from('posts')
        .select('id, title, content, created_at')
        .eq('id', params.id)
        .single();

    if (err || !post) {
        throw error(404, 'Post not found');
    }

    return {
        post,
        siteUrl: url.origin
    };
};
