import { createServerSupabase } from '$lib/serverSupabaseClient';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';
import {fail} from '@sveltejs/kit';

const supabase = createServerSupabase(SUPABASE_SERVICE_ROLE_KEY);
import type { Actions, RequestEvent } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';


export const actions: Actions = {

    delete: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const id = formData.get('id')

        if (!id || typeof id !== 'string') {
            return {success: false, error: 'Invalid Id'}
        }

        const {error} = await supabase.from('posts').delete().eq('id', id)

        if (error) {
            return {success: false, error: error.message}
        }

        return {success: true}
    },

    addBlog: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const title = formData.get('title')?.toString();
        const content = formData.get('content')?.toString();

        if (!title || !content) {
            return fail(400, {error: 'title and content are required'});
        }

        const {data: blogData, error} = await supabase.from('posts').insert({title, content}).select()

        if (error) {
            console.log(`Supabase insert error: ${error.message}`)
            return fail(500, {error: error.message})
        }

        return {success: true, data: blogData}
    },

    editBlog: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const title       = formData.get('title')?.toString()
        const content     = formData.get('content')?.toString()
        const id          = formData.get('id')?.toString()
        const cover_emoji = formData.get('cover_emoji')?.toString() || null
        const excerpt     = formData.get('excerpt')?.toString() || null
        const tagsRaw     = formData.get('tags')?.toString()
        const tags        = tagsRaw ? JSON.parse(tagsRaw) : null
        const theme       = formData.get('theme')?.toString() || null

        if (!content || !id) {
            return fail(400, {error: 'Missing content or id'})
        }

        const {error} = await supabase
            .from('posts')
            .update({content, title, cover_emoji, excerpt, tags, theme})
            .eq('id', id);

        if (error) {
            console.log(`Supabase update error: ${error.message}`)
            return fail(500, {error: error.message})
        }

        return {success: true}
    },

    togglePublic: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const id        = formData.get('id')?.toString()
        const published = formData.get('published') === 'true'

        if (!id) return fail(400, {error: 'Missing id'})

        const {error} = await supabase.from('posts').update({published}).eq('id', id);

        if (error) {
            console.log(`Toggle public error: ${error.message}`)
            return fail(500, {error: error.message})
        }

        return {success: true}
    },

    addBlogByFile: async ({request}: RequestEvent) => {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title')?.toString();

        const content = await file.text();

        if (!content || !title) return fail(400, {error: 'title and file are required'})

        const {data: blogData, error} = await supabase.from('posts').insert({title, content}).select();
        if (error) {
            console.log(`Supabase insert error: ${error.message}`)
            return fail(500, {error: error.message})
        }

        return {success: true, data: blogData}
    },

    postManTest: async () => {
        return {success: true, message: 'request successful'}
    }

}



export const load: PageServerLoad = async () => {
    const {data: posts, error} = await supabase.from('posts').select('*').order('created_at', {ascending: false})

    if (error) {
        console.log(`Error fetching posts: ${error.message}`)
        return {posts: []}
    }

    return {posts}
}
 