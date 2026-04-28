import {supabase} from '$lib/supabaseClient'
import {fail} from '@sveltejs/kit';
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
        const title = formData.get('title')?.toString()
        const content = formData.get('content')?.toString()
        const id = formData.get('id')?.toString()

        if (!content || !id) {
            return fail(400, {error: 'Missing content or id'})
        }

        const {error} = await supabase.from('posts').update({content, title}).eq('id', id);

        if (error) {
            console.log(`Supabase update error: ${error.message}`)
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
